import ChatWindow from '@/components/ChatWindow'

export default function Home() {
  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* 顶部 Header */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 shadow-sm flex-shrink-0"
        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-base font-bold">
            政
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-wide">
              政策指南针
            </h1>
            <p className="text-xs opacity-75 mt-0.5">
              AI 产业政策智能顾问
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs opacity-85">
            <span
              className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"
              style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)' }}
            />
            <span>实时检索</span>
          </div>
          <a
            href="#"
            className="hidden md:inline-block text-xs px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 transition-colors"
          >
            关于
          </a>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 overflow-hidden w-full max-w-3xl mx-auto">
        <ChatWindow />
      </main>
    </div>
  )
}
