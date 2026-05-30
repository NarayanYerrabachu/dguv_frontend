export async function GET() {
  const llmUrl = process.env.LLM_URL;
  const llmStreamUrl = process.env.LLM_STREAM_URL;

  // The app needs at least LLM_URL — LLM_STREAM_URL is optional (derived from LLM_URL if absent)
  const hasLlmEndpoint = !!(llmUrl || llmStreamUrl);

  if (!hasLlmEndpoint) {
    return Response.json(
      { status: 'not_ready', missing: ['LLM_URL'] },
      { status: 503 }
    );
  }

  return Response.json(
    { status: 'ready', service: 'frontend', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
