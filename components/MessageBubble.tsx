'use client'

import ReactMarkdown from 'react-markdown'
import SourceCard from './SourceCard'

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

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div
        className="flex justify-end mb-5"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        <div className="max-w-[78%] flex flex-col items-end">
          {/* 标签 */}
          <div className="flex items-center gap-2 mb-1 mr-1">
            <span
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--neon-blue)',
                letterSpacing: '0.18em',
                fontWeight: 600,
                textShadow: '0 0 6px rgba(0, 128, 255, 0.5)',
              }}
            >
              [ USER INPUT ]
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}
            >
              {timestamp()}
            </span>
          </div>
          <div className="flex items-stretch gap-2">
            <div
              className="px-4 py-3 rounded-md text-sm leading-relaxed"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 80, 160, 0.45), rgba(0, 40, 100, 0.55))',
                border: '1px solid rgba(0, 128, 255, 0.5)',
                color: 'var(--text-primary)',
                boxShadow:
                  '0 0 12px rgba(0, 128, 255, 0.2), inset 0 0 20px rgba(0, 128, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.content}
            </div>
            {/* 右侧装饰竖线 */}
            <div
              style={{
                width: '2px',
                background:
                  'linear-gradient(180deg, transparent, var(--neon-blue), transparent)',
                boxShadow: '0 0 6px var(--neon-blue)',
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex justify-start mb-5"
      style={{ animation: 'slideInLeft 0.3s ease-out' }}
    >
      <div className="flex items-start gap-3 max-w-[88%] w-full">
        {/* 六边形头像 */}
        <div
          className="hex flex-shrink-0 flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            background:
              'linear-gradient(135deg, rgba(0,245,255,0.28), rgba(0,128,255,0.18))',
            border: '1px solid var(--neon-cyan)',
            boxShadow: 'var(--glow-soft)',
            marginTop: '18px',
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

        <div className="flex-1 min-w-0">
          {/* 标签 */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span
              className="font-mono glow-text"
              style={{
                fontSize: '0.62rem',
                color: 'var(--neon-cyan)',
                letterSpacing: '0.18em',
                fontWeight: 600,
              }}
            >
              [ POLICY.AI OUTPUT ]
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}
            >
              {timestamp()}
            </span>
          </div>

          <div
            className="rounded-md px-4 py-3 relative"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 20, 40, 0.85), rgba(0, 10, 20, 0.85))',
              border: '1px solid rgba(0, 245, 255, 0.18)',
              borderLeft: '3px solid var(--neon-cyan)',
              boxShadow:
                '0 0 16px rgba(0, 245, 255, 0.12), inset 0 0 30px rgba(0, 245, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <div className="markdown-body">
              <ReactMarkdown>{message.content || ' '}</ReactMarkdown>
            </div>
            {message.sources && message.sources.length > 0 && (
              <SourceCard sources={message.sources} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function timestamp() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}
