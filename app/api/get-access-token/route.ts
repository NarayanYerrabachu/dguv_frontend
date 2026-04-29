import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const heygenApiKey = process.env.HEYGEN_API_KEY;
    const heygenVoiceId = process.env.HEYGEN_VOICE_ID;
    const heygenAvatarId = process.env.HEYGEN_AVATAR_ID || process.env.HEYGEN_AVATAR_NAME;
    const heygenQuality = process.env.HEYGEN_QUALITY || 'high';
    const avatarLanguage = process.env.AVATAR_LANGUAGE || 'de';
    const avatarContextId = process.env.AVATAR_CONTEXT_ID;

    if (!heygenApiKey || !heygenVoiceId || !heygenAvatarId) {
      return NextResponse.json(
        { error: 'HeyGen configuration is missing' },
        { status: 400 }
      );
    }

    const validQualities = ['low', 'medium', 'high', 'very_high'];
    if (!validQualities.includes(heygenQuality)) {
      return NextResponse.json(
        { error: 'Invalid HEYGEN_QUALITY value' },
        { status: 400 }
      );
    }

    const requestBody: any = {
      mode: 'FULL',
      avatar_id: heygenAvatarId,
      avatar_persona: {
        voice_id: heygenVoiceId,
        language: avatarLanguage,
      },
      video_settings: {
        quality: heygenQuality,
      },
    };

    if (avatarContextId) {
      requestBody.avatar_persona.context_id = avatarContextId;
    }

    const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
      method: 'POST',
      headers: {
        'X-API-KEY': heygenApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }

    const data = await response.json();
    const token = data?.data?.session_token;

    if (!token) {
      throw new Error('No session token in HeyGen response');
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('HeyGen API error:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
