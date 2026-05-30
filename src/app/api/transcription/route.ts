import { NextRequest } from 'next/server';

async function transcribeWithBackend(file: File, url: string, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) headers['x-token'] = token;

  const response = await fetch(url, {
    method: 'POST',
    headers,
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

    const sttUrl = process.env.STT_URL;
    const sttToken = process.env.STT_TOKEN ?? '';

    if (sttUrl) {
      console.log(`[transcription] → backend: ${sttUrl} | Datei: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      const text = await transcribeWithBackend(file, sttUrl, sttToken);
      console.log(`[transcription] ✓ Ergebnis: "${text.slice(0, 100)}"`);
      return Response.json({ text });
    }

    console.log('[transcription] mock-modus (STT_URL nicht konfiguriert)');
    return Response.json({ text: 'Das ist eine Testtranskription. (Mock-Modus — STT_URL nicht konfiguriert)' });
  } catch (error) {
    console.error('[transcription] ✗ Fehler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
