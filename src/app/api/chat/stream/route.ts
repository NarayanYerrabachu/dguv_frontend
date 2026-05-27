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
  let parsedHeader: Record<string, string>;
  try {
    parsedHeader = JSON.parse(header);
  } catch {
    throw new Error('Invalid LLM_HEADER: must be valid JSON');
  }

  // Extract api-key from header config (supports both api_key and api-key spellings)
  const apiKey = parsedHeader['api-key'] ?? parsedHeader['api_key'] ?? '';
  // Strip api key fields — they go in the body, not the HTTP headers
  const { 'api-key': _a, api_key: _b, ...httpHeaders } = parsedHeader;

  const outgoingBody = {
    msg,
    context: context ?? 'noSession',
    lang: language ?? 'de',
    'api-key': apiKey,
  };

  console.log(`[chat/stream] → ${url} | payload keys: ${Object.keys(outgoingBody).join(', ')}`);

  const llmResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...httpHeaders },
    body: JSON.stringify(outgoingBody),
    signal: AbortSignal.timeout(60_000),
  });

  console.log(`[chat/stream] ← status: ${llmResponse.status}`);

  if (!llmResponse.ok) {
    throw new Error(`LLM API error: ${llmResponse.statusText}`);
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = llmResponse.body!.getReader();
      const decoder = new TextDecoder();
      // Buffer partial SSE lines across chunk boundaries
      let lineBuffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          lineBuffer += decoder.decode(value, { stream: true });
          // Process complete SSE messages (delimited by blank line)
          const parts = lineBuffer.split('\n\n');
          lineBuffer = parts.pop() ?? '';
          for (const part of parts) {
            const dataLine = part.split('\n').find((l) => l.startsWith('data: '));
            if (!dataLine) continue;
            let msg: Record<string, unknown>;
            try {
              msg = JSON.parse(dataLine.slice(6));
            } catch {
              continue;
            }
            if (msg.type === 'token') {
              const token = (msg.content ?? '') as string;
              controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`));
            } else if (msg.type === 'sources') {
              const content = (msg.content ?? '') as string;
              console.log(`[chat/stream] event: sources (${content.length} chars)`);
              controller.enqueue(encoder.encode(`event: sources\ndata: ${JSON.stringify({ content })}\n\n`));
            } else if (msg.type === 'done') {
              console.log('[chat/stream] event: done');
              controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
            }
          }
        }
        // Flush any remaining buffered message
        if (lineBuffer.trim()) {
          const dataLine = lineBuffer.split('\n').find((l) => l.startsWith('data: '));
          if (dataLine) {
            try {
              const msg = JSON.parse(dataLine.slice(6)) as Record<string, unknown>;
              if (msg.type === 'token') {
                const token = (msg.content ?? '') as string;
                controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`));
              } else if (msg.type === 'sources') {
                const content = (msg.content ?? '') as string;
                controller.enqueue(encoder.encode(`event: sources\ndata: ${JSON.stringify({ content })}\n\n`));
              } else if (msg.type === 'done') {
                controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
              }
            } catch { /* ignore */ }
          }
        }
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
