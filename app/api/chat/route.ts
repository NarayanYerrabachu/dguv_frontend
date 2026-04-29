import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { msg, context, language } = body;

    if (!msg || typeof msg !== 'string') {
      return NextResponse.json(
        { error: 'msg is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      // === OPTION 1: OpenAI (ChatGPT) ===
      try {
        const openai = new OpenAI({
          apiKey: openaiKey,
        });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Oder 'gpt-4' für bessere Qualität
          messages: [
            {
              role: 'system',
              content: 'Du bist ein hilfreicher Assistent für Fragen zu Arbeitssicherheit und Gesundheitsschutz (DGUV). Antworte präzise und auf Deutsch.'
            },
            {
              role: 'user',
              content: msg
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content || 'Keine Antwort erhalten.';

        return NextResponse.json({
          msg: msg,
          response: response,
          language: language || 'de',
          context: context
        });
      } catch (error: any) {
        console.error('OpenAI API error:', error);
        return NextResponse.json(
          { error: 'OpenAI API error', msg: msg, response: 'Fehler bei der Kommunikation mit OpenAI.' },
          { status: 500 }
        );
      }
    }

    // Check for custom LLM backend
    const llmUrl = process.env.LLM_URL;
    const llmHeader = process.env.LLM_HEADER;

    if (llmUrl && llmHeader) {
      // === OPTION 2: Custom LLM Backend ===
      const headers = JSON.parse(llmHeader);

      const llmResponse = await fetch(llmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ msg, context, language }),
      });

      if (!llmResponse.ok) {
        throw new Error(`LLM API error: ${llmResponse.statusText}`);
      }

      const data = await llmResponse.json();
      return NextResponse.json(data);
    }

    // === FALLBACK: Echo/Mock Mode ===
    if (msg.includes('*waittesting*')) {
      await new Promise((resolve) => setTimeout(resolve, 35000));
    }

    return NextResponse.json({
      msg: msg,
      response: `Echo: ${msg}`,
      language: language || 'de',
      context: context
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
