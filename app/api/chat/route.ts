import { NextRequest } from 'next/server';
import OpenAI from 'openai';

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

    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein hilfreicher Assistent für Fragen zu Arbeitssicherheit und Gesundheitsschutz (DGUV). Antworte präzise und auf Deutsch.'
          },
          { role: 'user', content: msg }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const llmUrl = process.env.LLM_URL;
    const llmHeader = process.env.LLM_HEADER;

    if (llmUrl && llmHeader) {
      const headers = JSON.parse(llmHeader);

      const llmResponse = await fetch(llmUrl, {
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
      const text = data.msg || data.response || '';
      return new Response(text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Fallback echo mode — streamt Wort für Wort
    if (msg.includes('*waittesting*')) {
      await new Promise((resolve) => setTimeout(resolve, 35000));
    }

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

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
