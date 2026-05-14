'use client'

import { useEffect, useState } from 'react'
import {
  Conversation,
  clearAllConversations,
  deleteConversation,
  formatRelativeTime,
  listConversations,
} from '@/lib/storage'

interface HistoryDrawerProps {
  open: boolean
  onClose: () => void
  currentId: string | null
  onPick: (id: string) => void
  onNewChat: () => void
  /**
   * 父组件每次写入 storage 后自增，触发抽屉刷新列表
   */
  refreshKey: number
}

export default function HistoryDrawer({
  open,
  onClose,
  currentId,
  onPick,
  onNewChat,
  refreshKey,
}: HistoryDrawerProps) {
  const [list, setList] = useState<Conversation[]>([])
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  useEffect(() => {
    if (open) {
      setList(listConversations())
      setConfirmClearAll(false)
    }
  }, [open, refreshKey])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
    setList(listConversations())
    if (id === currentId) onNewChat()
  }

  const handleClearAll = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true)
      return
    }
    clearAllConversations()
    setList([])
    setConfirmClearAll(false)
    onNewChat()
  }

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* 抽屉本体 */}
      <aside
        className="fixed top-0 left-0 z-50 h-full w-[300px] sm:w-[340px] bg-white shadow-xl flex flex-col transition-transform duration-200"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
        aria-label="对话历史"
      >
        {/* 抽屉头 */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            对话历史
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="关闭"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--text-muted)' }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 新建对话按钮 */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新对话
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {list.length === 0 ? (
            <div
              className="text-center text-xs py-10 px-4"
              style={{ color: 'var(--text-muted)' }}
            >
              暂无历史对话
              <br />
              <span className="text-[11px]">开始聊天后会自动保存到本地浏览器</span>
            </div>
          ) : (
            list.map((c) => {
              const active = c.id === currentId
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onPick(c.id)
                    onClose()
                  }}
                  className="group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors mb-1"
                  style={{
                    backgroundColor: active ? '#eef3fb' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = '#f5f7fb'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 mt-0.5"
                    style={{
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-medium truncate"
                      style={{
                        color: active ? 'var(--primary)' : 'var(--text)',
                      }}
                      title={c.title}
                    >
                      {c.title}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {formatRelativeTime(c.updatedAt)} · {c.messages.length} 条消息
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all flex-shrink-0"
                    aria-label="删除"
                    title="删除这条对话"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: '#d14a4a' }}
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* 底部操作 */}
        {list.length > 0 && (
          <div
            className="px-3 py-2 border-t flex-shrink-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              onClick={handleClearAll}
              onBlur={() => setConfirmClearAll(false)}
              className="w-full text-xs py-2 rounded-lg transition-colors"
              style={{
                color: confirmClearAll ? '#fff' : '#d14a4a',
                backgroundColor: confirmClearAll ? '#d14a4a' : 'transparent',
                border: `1px solid ${confirmClearAll ? '#d14a4a' : '#f1d5d5'}`,
              }}
            >
              {confirmClearAll ? '再点一次确认清空全部历史' : '清空全部历史'}
            </button>
            <p
              className="text-[10px] text-center mt-2"
              style={{ color: 'var(--text-muted)' }}
            >
              数据仅保存在本机浏览器，清理浏览器数据会丢失
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
