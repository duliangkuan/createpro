import OpenAI from 'openai'
import { tavily } from '@tavily/core'
import { searchTool, SYSTEM_PROMPT } from '@/lib/tools'

export const runtime = 'nodejs'
export const maxDuration = 30

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! })

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const allMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages,
    ]

    // 第一轮：让 DeepSeek 决定是否需要搜索
    const firstResponse = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: allMessages,
      tools: [searchTool],
      tool_choice: 'auto',
      max_tokens: 1000,
    })

    const firstChoice = firstResponse.choices[0]
    let sources: { title: string; url: string; content: string }[] = []
    let finalMessages = [...allMessages]

    // 如果 DeepSeek 决定调用搜索工具
    if (
      firstChoice.finish_reason === 'tool_calls' &&
      firstChoice.message.tool_calls &&
      firstChoice.message.tool_calls.length > 0
    ) {
      const toolCalls = firstChoice.message.tool_calls

      // 先把 assistant 的 tool_calls 消息原样追加，保持 tool_call_id 配对
      finalMessages.push({
        role: 'assistant' as const,
        content: firstChoice.message.content ?? '',
        tool_calls: toolCalls,
      } as OpenAI.Chat.ChatCompletionMessageParam)

      // 必须为每一个 tool_call 都追加一条 tool 消息，否则 DeepSeek 会 400
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') {
          finalMessages.push({
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: '不支持的工具类型',
          } as OpenAI.Chat.ChatCompletionMessageParam)
          continue
        }

        let query = ''
        try {
          const args = JSON.parse(toolCall.function.arguments || '{}')
          query = typeof args.query === 'string' ? args.query : ''
        } catch (e) {
          console.error('解析 tool_call.arguments 失败:', e)
        }

        let searchContent = '搜索失败：未获取到有效结果'
        if (query) {
          try {
            const searchResult = await tvly.search(query, {
              maxResults: 5,
              includeDomains: [
                'gov.cn',
                'npc.gov.cn',
                'miit.gov.cn',
                'most.gov.cn',
                'cac.gov.cn',
                'lawinfochina.com',
                'pkulaw.com',
              ],
              includeAnswer: true,
            })

            const results = (searchResult?.results ?? []) as {
              title: string
              url: string
              content: string
            }[]

            if (results.length > 0) {
              sources.push(
                ...results.map((r) => ({
                  title: r.title,
                  url: r.url,
                  content: (r.content ?? '').slice(0, 300),
                }))
              )

              searchContent = results
                .map(
                  (r, i) =>
                    `[${i + 1}] 标题：${r.title}\n来源：${r.url}\n内容：${(r.content ?? '').slice(0, 500)}`
                )
                .join('\n\n---\n\n')
            } else {
              searchContent = `搜索关键词「${query}」未在指定政府/法律站点中找到结果，请基于已有知识谨慎回答，并提示用户去官网核验。`
            }
          } catch (e) {
            console.error('Tavily 搜索失败:', e)
            searchContent = `搜索接口暂时不可用：${(e as Error).message}`
          }
        }

        finalMessages.push({
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: `搜索关键词：${query}\n\n搜索结果：\n\n${searchContent}`,
        } as OpenAI.Chat.ChatCompletionMessageParam)
      }
    }

    // 最终流式输出
    const stream = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: finalMessages,
      stream: true,
      max_tokens: 2000,
    })

    // 创建 ReadableStream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content
          if (delta) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: delta })}\n\n`))
          }
        }
        // 发送来源信息
        if (sources.length > 0) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'sources', sources })}\n\n`
            )
          )
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json({ error: '服务暂时不可用，请稍后重试' }, { status: 500 })
  }
}
