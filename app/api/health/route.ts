export const runtime = 'nodejs'

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'policy-ai',
    version: '2.0.1',
    timestamp: new Date().toISOString(),
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
    tavily: Boolean(process.env.TAVILY_API_KEY),
  })
}
