import { NextRequest } from 'next/server';

async function transcribeWithBackend(file: File, url: string, extraHeaders: Record<string, string>): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    headers: extraHeaders,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`STT API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text?.trim() ?? '';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'file is required' }, { status: 400 });
    }

    const sttUrl = process.env.TRANSCRIPTION_URL ?? process.env.STT_URL;

    let extraHeaders: Record<string, string> = {};
    const headerEnv = process.env.TRANSCRIPTION_HEADER;
    if (headerEnv) {
      try { extraHeaders = JSON.parse(headerEnv); } catch { /* ignore */ }
    } else if (process.env.STT_TOKEN) {
      extraHeaders['x-token'] = process.env.STT_TOKEN;
    }

    if (sttUrl) {
      console.log(`[transcription] → backend: ${sttUrl} | Datei: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      const text = await transcribeWithBackend(file, sttUrl, extraHeaders);
      console.log(`[transcription] ✓ Ergebnis: "${text.slice(0, 100)}"`);
      return Response.json({ text });
    }

    console.log('[transcription] mock-modus (TRANSCRIPTION_URL nicht konfiguriert)');
    return Response.json({ text: 'Das ist eine Testtranskription. (Mock-Modus — TRANSCRIPTION_URL nicht konfiguriert)' });
  } catch (error) {
    console.error('[transcription] ✗ Fehler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
