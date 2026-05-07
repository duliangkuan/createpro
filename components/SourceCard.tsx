interface Source {
  title: string
  url: string
  content: string
}

export default function SourceCard({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null

  return (
    <div
      className="mt-4 pt-3"
      style={{
        borderTop: '1px dashed rgba(0, 245, 255, 0.2)',
      }}
    >
      {/* 标题栏 */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono"
          style={{
            fontSize: '0.66rem',
            color: 'var(--neon-cyan)',
            letterSpacing: '0.15em',
            fontWeight: 600,
          }}
        >
          ─── REFERENCES
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}
        >
          [{sources.length} SOURCE{sources.length > 1 ? 'S' : ''} INDEXED]
        </span>
        <div
          className="flex-1"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(0,245,255,0.3), transparent)',
          }}
        />
      </div>

      {/* 来源列表 */}
      <div className="flex flex-col gap-2">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="scan-card group relative block rounded-md p-2.5 transition-all duration-200"
            style={{
              background: 'rgba(0, 10, 20, 0.6)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              borderLeft: '2px solid var(--neon-green)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.5)'
              e.currentTarget.style.borderLeftColor = 'var(--neon-green)'
              e.currentTarget.style.boxShadow =
                '0 0 12px rgba(0, 255, 136, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.15)'
              e.currentTarget.style.borderLeftColor = 'var(--neon-green)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="flex items-start gap-3">
              {/* REF 序号 */}
              <span
                className="font-display flex-shrink-0"
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--neon-green)',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  marginTop: '1px',
                  textShadow: '0 0 4px rgba(0,255,136,0.4)',
                }}
              >
                [REF.{String(i + 1).padStart(2, '0')}]
              </span>

              <div className="flex-1 min-w-0">
                {/* 标题 */}
                <p
                  className="truncate"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                  }}
                >
                  {source.title}
                </p>
                {/* URL（终端绿色） */}
                <p
                  className="font-mono truncate mt-0.5 group-hover:opacity-100"
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--neon-green)',
                    letterSpacing: '0.02em',
                    opacity: 0.7,
                  }}
                >
                  ↳ {source.url}
                </p>
              </div>

              {/* 外链图标 */}
              <span
                className="font-mono flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--neon-cyan)',
                  marginTop: '1px',
                }}
              >
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* 底部 */}
      <p
        className="font-mono mt-2"
        style={{
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}
      >
        // EOF · 数据来源以官网为准
      </p>
    </div>
  )
}
