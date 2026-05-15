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
      const text = await transcribeWithBackend(file, sttUrl, sttToken);
      return Response.json({ text });
    }

    return Response.json({ text: 'Das ist eine Testtranskription. (Mock-Modus — STT_URL nicht konfiguriert)' });
  } catch (error) {
    console.error('Transcription API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
