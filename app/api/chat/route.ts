import { NextRequest } from 'next/server';

function streamEcho(msg: string): Response {
  const echoText = `Echo: ${msg}`;
  const words = echoText.split(' ');
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = i === 0 ? words[i] : ' ' + words[i];
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

async function streamLLMBackend(
  msg: string,
  context: string | undefined,
  language: string | undefined,
  url: string,
  header: string
): Promise<Response> {
  const headers = JSON.parse(header);

  const llmResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ msg, context, language }),
  });

  if (!llmResponse.ok) {
    throw new Error(`LLM API error: ${llmResponse.statusText}`);
  }

  const contentType = llmResponse.headers.get('content-type') || '';
  if (contentType.includes('text/') || contentType.includes('stream')) {
    return new Response(llmResponse.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const data = await llmResponse.json();
  const text = (data.msg || data.response || '') as string;
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { msg, context, language } = body;

    if (!msg || typeof msg !== 'string') {
      return new Response(JSON.stringify({ error: 'msg is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const llmUrl = process.env.LLM_URL;
    const llmHeader = process.env.LLM_HEADER;

    if (llmUrl && llmHeader) {
      return await streamLLMBackend(msg, context, language, llmUrl, llmHeader);
    }

    if (msg.includes('*waittesting*')) {
      await new Promise((resolve) => setTimeout(resolve, 35000));
    }

    return streamEcho(msg);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
