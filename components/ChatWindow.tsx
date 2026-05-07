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
  {
    code: '01',
    title: '高新技术企业认定',
    desc: '> 申报条件 / 减税优惠 / 流程详解',
    query: '如何申请高新技术企业认定？需要满足哪些核心条件？',
  },
  {
    code: '02',
    title: '生成式AI产品备案',
    desc: '> 算法备案 / 安全评估 / 上线合规',
    query: '生成式AI产品上线前需要完成哪些备案手续？',
  },
  {
    code: '03',
    title: '算力补贴政策',
    desc: '> 国家级 + 地方级 / 申请条件',
    query: 'AI企业可以申请哪些算力补贴？北京、上海、深圳分别有什么政策？',
  },
  {
    code: '04',
    title: '欧盟AI法案合规',
    desc: '> 出海风险 / 高风险等级 / 应对',
    query: '欧盟AI法案对中国出海AI企业有哪些核心影响？如何合规？',
  },
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
            '`[ERROR 0x0500]` 节点链路异常，未能从政策中枢获取响应。请稍后重试或检查 API 密钥配置。',
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
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-6">
        {messages.length === 0 ? (
          <WelcomeScreen onPick={sendMessage} questions={SUGGESTED_QUESTIONS} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading &&
              messages[messages.length - 1]?.role === 'user' && <AnalyzingBubble />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入区域 */}
      <div
        className="px-2 sm:px-4 pb-4 pt-3"
        style={{
          borderTop: '1px solid rgba(0, 245, 255, 0.15)',
          background:
            'linear-gradient(180deg, transparent, rgba(0, 10, 20, 0.6))',
        }}
      >
        <div
          className="glass relative flex items-end gap-2 rounded-lg px-4 py-2"
          style={{
            boxShadow: 'var(--glow-soft)',
          }}
        >
          {/* 终端提示符 */}
          <span
            className="font-mono flex-shrink-0 pb-[10px]"
            style={{
              color: 'var(--neon-green)',
              fontSize: '0.95rem',
              textShadow: '0 0 6px var(--neon-green)',
            }}
          >
            &gt;
          </span>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入指令... (例如：我的AI公司如何申请专精特新认定？)"
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent py-2 max-h-32 font-mono"
            style={{
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              caretColor: 'var(--neon-cyan)',
            }}
            disabled={loading}
          />

          {/* 六边形发送按钮 */}
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="发送指令"
            className="hex flex-shrink-0 flex items-center justify-center transition-all duration-200 mb-1"
            style={{
              width: '40px',
              height: '40px',
              background:
                loading || !input.trim()
                  ? 'rgba(58, 106, 138, 0.3)'
                  : 'linear-gradient(135deg, var(--neon-cyan), var(--neon-blue))',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              boxShadow:
                loading || !input.trim()
                  ? 'none'
                  : '0 0 16px rgba(0, 245, 255, 0.6)',
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.boxShadow =
                  '0 0 24px rgba(0, 245, 255, 0.9), 0 0 48px rgba(0, 245, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              if (!loading && input.trim()) {
                e.currentTarget.style.boxShadow =
                  '0 0 16px rgba(0, 245, 255, 0.6)'
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={loading || !input.trim() ? 'var(--text-muted)' : '#020408'}
              style={{ marginLeft: '2px' }}
            >
              <polygon points="5,3 21,12 5,21" />
            </svg>
          </button>
        </div>

        {/* 底部状态栏 */}
        <div
          className="flex items-center justify-between mt-3 px-1 font-mono"
          style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}
        >
          <span>
            <span style={{ color: 'var(--neon-green)' }}>●</span> POWERED BY
            DEEPSEEK × TAVILY
          </span>
          <span className="hidden sm:inline">
            BUILD FOR POLICY INTELLIGENCE · v2.0.1
          </span>
          <span>
            ENTER ↵ <span style={{ color: 'var(--text-muted)' }}>SEND</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ============ 欢迎界面 ============ */

function WelcomeScreen({
  onPick,
  questions,
}: {
  onPick: (q: string) => void
  questions: typeof SUGGESTED_QUESTIONS
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center pt-6 pb-10">
      {/* 六边形图腾 */}
      <div className="relative mb-6">
        <div
          className="hex flex-shrink-0 flex items-center justify-center"
          style={{
            width: '88px',
            height: '88px',
            background:
              'linear-gradient(135deg, rgba(0,245,255,0.18), rgba(0,128,255,0.08))',
            border: '2px solid var(--neon-cyan)',
            boxShadow: 'var(--glow-strong)',
            animation: 'pulseGlow 3s ease-in-out infinite',
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              color: 'var(--neon-cyan)',
              letterSpacing: '0.05em',
              textShadow: '0 0 12px var(--neon-cyan)',
            }}
          >
            P.AI
          </span>
        </div>
        {/* 旋转外环装饰 */}
        <div
          className="absolute inset-0 hex pointer-events-none"
          style={{
            border: '1px dashed rgba(0, 245, 255, 0.4)',
            transform: 'scale(1.25)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* 主标题 */}
      <h1
        className="font-display glow-text mb-2"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          color: 'var(--neon-cyan)',
          letterSpacing: '0.12em',
          animation: 'neonFlicker 4s linear infinite',
        }}
      >
        POLICY.AI
      </h1>

      {/* 副标题（终端风） */}
      <p
        className="font-mono mb-1"
        style={{
          fontSize: '0.85rem',
          color: 'var(--neon-green)',
          letterSpacing: '0.08em',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>{'> '}</span>
        智能政策检索系统 v2.0.1
        <span
          className="ml-1 inline-block"
          style={{
            width: '8px',
            height: '14px',
            background: 'var(--neon-green)',
            verticalAlign: 'middle',
            animation: 'caretBlink 0.9s step-end infinite',
            boxShadow: '0 0 8px var(--neon-green)',
          }}
        />
      </p>
      <p
        className="font-mono mb-10"
        style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}
      >
        REAL-TIME · AUTHORITATIVE · CITATION-AWARE
      </p>

      {/* 标题栏 */}
      <div className="w-full max-w-2xl mb-3 flex items-center gap-3">
        <span
          className="font-mono"
          style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
          }}
        >
          ── PRESET QUERIES ──
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(0,245,255,0.3), transparent)',
          }}
        />
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onPick(q.query)}
            className="scan-card group relative text-left rounded-md p-4 transition-all duration-200"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 20, 40, 0.7), rgba(0, 10, 20, 0.5))',
              border: '1px solid rgba(0, 245, 255, 0.18)',
              borderLeft: '3px solid var(--neon-cyan)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--neon-cyan)'
              e.currentTarget.style.borderLeftColor = 'var(--neon-cyan)'
              e.currentTarget.style.boxShadow =
                '0 0 16px rgba(0, 245, 255, 0.3), inset 0 0 30px rgba(0, 245, 255, 0.05)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.18)'
              e.currentTarget.style.borderLeftColor = 'var(--neon-cyan)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <span
                className="font-display"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--neon-cyan)',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                }}
              >
                [{q.code}]
              </span>
              <span
                className="font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--neon-green)',
                  letterSpacing: '0.1em',
                }}
              >
                EXEC ►
              </span>
            </div>
            <div
              className="font-display mb-1"
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
              }}
            >
              {q.title}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              {q.desc}
            </div>
          </button>
        ))}
      </div>

      {/* 提示 */}
      <p
        className="font-mono mt-8"
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}
      >
        // 也可以直接在下方输入框提问
      </p>
    </div>
  )
}

/* ============ 加载中"扫描"气泡 ============ */

function AnalyzingBubble() {
  return (
    <div
      className="flex items-start gap-3 mb-4"
      style={{ animation: 'slideInLeft 0.3s ease-out' }}
    >
      {/* 六边形头像 */}
      <div
        className="hex flex-shrink-0 flex items-center justify-center"
        style={{
          width: '36px',
          height: '36px',
          background:
            'linear-gradient(135deg, rgba(0,245,255,0.25), rgba(0,128,255,0.15))',
          border: '1px solid var(--neon-cyan)',
          boxShadow: 'var(--glow-soft)',
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: '0.7rem',
            fontWeight: 900,
            color: 'var(--neon-cyan)',
            letterSpacing: '0.05em',
          }}
        >
          AI
        </span>
      </div>

      <div
        className="glass rounded-lg px-4 py-3"
        style={{
          borderLeft: '3px solid var(--neon-cyan)',
          boxShadow: 'var(--glow-soft)',
          minWidth: '260px',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-mono"
            style={{
              fontSize: '0.66rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            [ POLICY.AI OUTPUT ]
          </span>
        </div>
        <div
          className="font-mono mb-2"
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em',
          }}
        >
          ANALYZING POLICY DATABASE
          <span
            className="inline-block ml-1"
            style={{
              animation: 'caretBlink 1s step-end infinite',
              color: 'var(--neon-cyan)',
            }}
          >
            ...
          </span>
        </div>
        <div className="scan-progress" />
      </div>
    </div>
  )
}
