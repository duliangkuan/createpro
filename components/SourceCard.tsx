interface Source {
  title: string
  url: string
  content: string
}

export default function SourceCard({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null

  return (
    <div
      className="mt-3 pt-3 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <p
        className="text-xs mb-2 font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        参考来源
      </p>
      <div className="flex flex-col gap-2">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2 rounded-lg transition-colors group"
            style={{ backgroundColor: '#eef3fb' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dde7f5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#eef3fb'
            }}
          >
            <div
              className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
              style={{ backgroundColor: '#c4d4ea' }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: 'var(--primary)' }}
              >
                {i + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium truncate"
                style={{ color: 'var(--primary)' }}
              >
                {source.title || '未命名来源'}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: 'var(--primary-light)' }}
              >
                {source.url}
              </p>
            </div>
            <svg
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--primary-light)' }}
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
