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
      <div className="flex justify-end mb-4">
        <div
          className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tr-sm text-white text-sm leading-relaxed shadow-sm"
          style={{
            backgroundColor: 'var(--primary)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 text-white text-xs font-bold"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        指
      </div>
      <div
        className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white shadow-sm border text-sm"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="markdown-body">
          <ReactMarkdown>{message.content || ' '}</ReactMarkdown>
        </div>
        {message.sources && message.sources.length > 0 && (
          <SourceCard sources={message.sources} />
        )}
      </div>
    </div>
  )
}
