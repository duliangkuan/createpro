import ChatWindow from '@/components/ChatWindow'

export default function Home() {
  return (
    <div
      className="relative flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 环境光晕 */}
      <div
        className="ambient-glow"
        style={{
          top: '-10%',
          left: '-10%',
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(0,245,255,0.35), transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="ambient-glow"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle, rgba(0,128,255,0.35), transparent 70%)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="ambient-glow"
        style={{
          top: '40%',
          right: '20%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(255,0,60,0.18), transparent 70%)',
          animationDelay: '-6s',
        }}
      />

      {/* Header */}
      <header
        className="relative z-20 flex items-center justify-between px-6 flex-shrink-0"
        style={{
          height: '64px',
          background: 'rgba(2, 4, 8, 0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid var(--border-glow)',
        }}
      >
        {/* 左侧 Logo */}
        <div className="flex items-center gap-3">
          {/* 六边形图标 */}
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
              className="status-dot"
              style={{ width: '6px', height: '6px' }}
            />
          </div>

          {/* 文字 Logo */}
          <div className="flex flex-col">
            <span
              className="font-display typing-title glow-text"
              style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                color: 'var(--neon-cyan)',
                letterSpacing: '0.18em',
              }}
            >
              [POLICY.AI]
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                marginTop: '-2px',
              }}
            >
              POLICY INTELLIGENCE SYSTEM
            </span>
          </div>
        </div>

        {/* 右侧状态指示 */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono"
            style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
            <span style={{ color: 'var(--text-muted)' }}>NODE://</span>
            <span style={{ color: 'var(--neon-cyan)' }}>BEIJING-01</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" />
            <span
              className="font-mono glow-text-green"
              style={{
                fontSize: '0.72rem',
                color: 'var(--neon-green)',
                letterSpacing: '0.12em',
                fontWeight: 500,
              }}
            >
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* 底部流光 */}
        <div className="flow-line" />
      </header>

      {/* 主体 */}
      <main className="relative z-10 flex-1 overflow-hidden w-full max-w-4xl mx-auto px-2 sm:px-4">
        <ChatWindow />
      </main>
    </div>
  )
}
