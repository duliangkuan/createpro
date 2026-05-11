import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 text-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md"
        style={{
          backgroundColor: 'var(--primary)',
          boxShadow: '0 6px 16px rgba(26, 58, 107, 0.25)',
        }}
      >
        政
      </div>

      <h1
        className="text-5xl sm:text-6xl font-bold mb-3"
        style={{ color: 'var(--primary)' }}
      >
        404
      </h1>

      <p
        className="text-base mb-2"
        style={{ color: 'var(--text)' }}
      >
        抱歉，您访问的页面不存在
      </p>
      <p
        className="text-sm mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        可能是链接已失效，或您输入的地址有误。
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        返回首页
      </Link>
    </div>
  )
}
