import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const sttForwardUrl = process.env.STT_FORWARD_URL;
    const sttForwardToken = process.env.STT_FORWARD_TOKEN;
    const transcriptionUrl = process.env.TRANSCRIPTION_URL;
    const transcriptionHeader = process.env.TRANSCRIPTION_HEADER;

    const url = sttForwardUrl || transcriptionUrl;

    if (!url) {
      return NextResponse.json({
        text: 'Kein Transkriptions-Backend konfiguriert.',
      });
    }

    const sttFormData = new FormData();
    sttFormData.append('file', file);

    let headers: Record<string, string> = {};

    if (sttForwardToken) {
      headers['x-token'] = sttForwardToken;
    } else if (transcriptionHeader) {
      try {
        headers = JSON.parse(transcriptionHeader);
      } catch (error) {
        console.error('Failed to parse TRANSCRIPTION_HEADER:', error);
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: sttFormData,
      });
    } catch (networkError) {
      console.error('Transcription backend not reachable:', networkError);
      return NextResponse.json({ text: 'Was kann ich für Sie tun?' });
    }

    if (!response.ok) {
      console.error(`Transcription service error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ text: 'Was kann ich für Sie tun?' });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Transcription API error:', error);
    return NextResponse.json({ text: 'Was kann ich für Sie tun?' });
  }
}
