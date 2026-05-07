import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 环境光晕 */}
      <div
        className="ambient-glow"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(255,0,60,0.3), transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        <div
          className="font-display mb-2"
          style={{
            fontSize: 'clamp(4rem, 14vw, 10rem)',
            fontWeight: 900,
            color: 'var(--neon-red)',
            letterSpacing: '0.15em',
            textShadow:
              '0 0 20px rgba(255,0,60,0.7), 0 0 40px rgba(255,0,60,0.3)',
            animation: 'neonFlicker 3s linear infinite',
          }}
        >
          404
        </div>
        <div
          className="font-mono mb-1"
          style={{
            fontSize: '0.95rem',
            color: 'var(--neon-red)',
            letterSpacing: '0.18em',
            fontWeight: 600,
          }}
        >
          [ ROUTE NOT FOUND ]
        </div>
        <div
          className="font-mono mb-8"
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          {'> '}请求的政策节点不存在或已被销毁
        </div>

        <Link
          href="/"
          className="font-display inline-block px-6 py-3 rounded-md transition-all"
          style={{
            background: 'rgba(0, 245, 255, 0.08)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            letterSpacing: '0.15em',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: 'var(--glow-soft)',
          }}
        >
          ← RETURN TO MAINFRAME
        </Link>
      </div>
    </div>
  )
}
