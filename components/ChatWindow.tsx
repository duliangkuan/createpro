'use client'

import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'

interface Source {
  title: string
  url: string
  content: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

const SUGGESTED_QUESTIONS = [
  '如何申请高新技术企业认定？需要满足哪些核心条件？',
  '生成式AI产品上线前需要完成哪些备案手续？',
  'AI企业可以申请哪些算力补贴？北京、上海、深圳分别有什么政策？',
  '欧盟AI法案对中国出海AI企业有哪些核心影响？如何合规？',
]

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('请求失败')
      if (!response.body) throw new Error('无响应体')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let sources: Source[] = []
      let placeholderInserted = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'text') {
              assistantContent += parsed.content
              if (!placeholderInserted) {
                placeholderInserted = true
                setMessages((prev) => [
                  ...prev,
                  { role: 'assistant', content: assistantContent, sources: [] },
                ])
              } else {
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                    sources,
                  }
                  return updated
                })
              }
            } else if (parsed.type === 'sources') {
              sources = parsed.sources
              if (!placeholderInserted) {
                placeholderInserted = true
                setMessages((prev) => [
                  ...prev,
                  { role: 'assistant', content: assistantContent, sources },
                ])
              } else {
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    sources,
                  }
                  return updated
                })
              }
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '抱歉，请求出现错误，请稍后重试或联系管理员检查 API 配置。',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-6">
        {messages.length === 0 ? (
          <WelcomeScreen onPick={sendMessage} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading &&
              messages[messages.length - 1]?.role === 'user' && (
                <TypingBubble />
              )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div
        className="px-3 sm:px-4 pb-4 pt-2 border-t"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
      >
        <div
          className="flex items-end gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border"
          style={{ borderColor: 'var(--border)' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的政策问题，例如：我的AI公司如何申请专精特新认定？"
            rows={1}
            className="flex-1 resize-none outline-none text-sm bg-transparent py-2 max-h-32"
            style={{ color: 'var(--text)' }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="发送"
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all mb-1"
            style={{
              backgroundColor:
                loading || !input.trim() ? '#c8d3e6' : 'var(--primary)',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = 'var(--primary-hover)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = 'var(--primary)'
              }
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p
          className="text-center text-xs mt-2"
          style={{ color: 'var(--text-muted)' }}
        >
          由 DeepSeek × Tavily 驱动 · 仅供参考，具体申报请以官方文件为准
        </p>
      </div>
    </div>
  )
}

/* ============ 欢迎界面 ============ */

function WelcomeScreen({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center pt-8 pb-16">
      {/* 标志 */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md"
        style={{
          backgroundColor: 'var(--primary)',
          boxShadow: '0 6px 16px rgba(26, 58, 107, 0.25)',
        }}
      >
        政
      </div>

      <h2
        className="text-xl sm:text-2xl font-semibold mb-2"
        style={{ color: 'var(--primary)' }}
      >
        政策指南针
      </h2>
      <p
        className="text-sm mb-1"
        style={{ color: 'var(--text-muted)' }}
      >
        实时检索 · 精准解读 · AI 产业政策专家
      </p>
      <p
        className="text-xs mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        覆盖：生成式AI管理 · 数据安全 · 算力补贴 · 高新认定 · 专精特新 · 出海合规
      </p>

      {/* 分隔标题 */}
      <div className="w-full max-w-2xl mb-3 flex items-center gap-3">
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--border)',
          }}
        />
        <span
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          常见问题
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--border)',
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 w-full max-w-2xl">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onPick(q)}
            className="text-left px-4 py-3 rounded-xl text-sm transition-all"
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-light)'
              e.currentTarget.style.color = 'var(--primary)'
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(26, 58, 107, 0.08)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span
              className="inline-block mr-2 font-medium"
              style={{ color: 'var(--accent)' }}
            >
              0{i + 1}
            </span>
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ============ 思考中气泡 ============ */

function TypingBubble() {
  return (
    <div className="flex justify-start mb-4">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 text-white text-xs font-bold"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        指
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="typing-dot w-2 h-2 rounded-full bg-gray-300"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full bg-gray-300"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full bg-gray-300"
          style={{ animationDelay: '300ms' }}
        />
        <span
          className="ml-2 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          正在检索政策库...
        </span>
      </div>
    </div>
  )
}
