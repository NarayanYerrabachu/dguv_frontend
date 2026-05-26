import { NextRequest } from 'next/server';

function sseEcho(msg: string): Response {
  const words = `Echo: ${msg}`.split(' ');
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const token = i === 0 ? words[i] : ' ' + words[i];
        controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`));
        await new Promise((r) => setTimeout(r, 80));
      }
      controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ sources: [] })}\n\n`));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

async function sseFromLLMBackend(
  msg: string,
  context: string | undefined,
  language: string | undefined,
  url: string,
  header: string
): Promise<Response> {
  let parsedHeaders: Record<string, string>;
  try {
    parsedHeaders = JSON.parse(header);
  } catch {
    throw new Error('Invalid LLM_HEADER: must be valid JSON');
  }

  const llmResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...parsedHeaders },
    body: JSON.stringify({ msg, context, language }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!llmResponse.ok) {
    throw new Error(`LLM API error: ${llmResponse.statusText}`);
  }

  const contentType = llmResponse.headers.get('content-type') || '';

  // Backend already sends SSE — pass through directly
  if (contentType.includes('text/event-stream')) {
    return new Response(llmResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // Backend sends plain stream — wrap tokens as SSE events
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = llmResponse.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const token = decoder.decode(value, { stream: true });
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ sources: [] })}\n\n`));
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export async function POST(request: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await request.json();
    const { msg, context, language } = body;

    if (!msg || typeof msg !== 'string') {
      return new Response(JSON.stringify({ error: 'msg is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const llmStreamUrl = process.env.LLM_STREAM_URL;
    const llmUrl = process.env.LLM_URL;
    const llmHeader = process.env.LLM_HEADER;

    let streamUrl: string | null = llmStreamUrl ?? null;
    if (!streamUrl && llmUrl) {
      const derived = llmUrl.replace(/\/chat\/?$/, '/chat/stream');
      if (derived !== llmUrl) {
        streamUrl = derived;
      } else {
        console.warn('[chat/stream] LLM_URL does not end with /chat — set LLM_STREAM_URL explicitly');
      }
    }

    if (streamUrl && llmHeader) {
      console.log(`[chat/stream] → backend: ${streamUrl} | msg: "${msg.slice(0, 80)}"${language ? ` | lang: ${language}` : ''}`);
      const response = await sseFromLLMBackend(msg, context, language, streamUrl, llmHeader);
      console.log(`[chat/stream] ✓ backend responded (${Date.now() - startMs}ms)`);
      return response;
    }

    if (process.env.NODE_ENV === 'development' && msg.includes('*waittesting*')) {
      await new Promise((r) => setTimeout(r, 35000));
    }

    console.log(`[chat/stream] echo-modus | msg: "${msg.slice(0, 80)}"`);
    return sseEcho(msg);
  } catch (error) {
    console.error(`[chat/stream] ✗ Fehler (${Date.now() - startMs}ms):`, error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
