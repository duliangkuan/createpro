/**
 * 对话历史本地存储
 *
 * 设计原则：
 * - 所有读写都通过本模块暴露的纯函数完成，便于将来切换到云端（Supabase / Vercel KV / 自建 API）
 *   只需替换本文件实现即可，UI 层无需改动。
 * - 仅在浏览器环境工作（SSR 安全：检测 typeof window）。
 * - 数据完全留在用户本机浏览器，不上传服务器。
 */

export interface StoredSource {
  title: string
  url: string
  content: string
}

export interface StoredMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: StoredSource[]
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: StoredMessage[]
}

const STORAGE_KEY = 'policy-agent:conversations:v1'
const CURRENT_ID_KEY = 'policy-agent:current-id:v1'
const MAX_CONVERSATIONS = 100

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function readAll(): Conversation[] {
  if (!isBrowser()) return []
  return safeParse<Conversation[]>(localStorage.getItem(STORAGE_KEY), [])
}

function writeAll(list: Conversation[]): void {
  if (!isBrowser()) return
  try {
    const trimmed = list
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CONVERSATIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (err) {
    // 容量超限时丢弃最旧的一半重试一次
    try {
      const half = list
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, Math.max(1, Math.floor(list.length / 2)))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(half))
    } catch {
      console.error('保存对话失败：', err)
    }
  }
}

export function listConversations(): Conversation[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getConversation(id: string): Conversation | undefined {
  return readAll().find((c) => c.id === id)
}

export function getCurrentId(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(CURRENT_ID_KEY)
}

export function setCurrentId(id: string | null): void {
  if (!isBrowser()) return
  if (id) {
    localStorage.setItem(CURRENT_ID_KEY, id)
  } else {
    localStorage.removeItem(CURRENT_ID_KEY)
  }
}

/**
 * 用 crypto.randomUUID 生成，老旧浏览器降级用 Math.random
 */
export function newId(): string {
  if (isBrowser() && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 从首条用户消息生成标题（前 20 字）。空对话用默认占位符。
 */
export function deriveTitle(messages: StoredMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user')
  if (!firstUser) return '新对话'
  const text = firstUser.content.replace(/\s+/g, ' ').trim()
  if (!text) return '新对话'
  return text.length > 20 ? text.slice(0, 20) + '…' : text
}

/**
 * 保存（或新建）一个对话。
 * - 若传入 id 已存在 → 更新（替换 messages、刷新 updatedAt、重新派生 title）。
 * - 若不存在 → 创建一条新记录。
 * 空消息列表不会写入，避免产生"幽灵会话"。
 */
export function upsertConversation(
  id: string,
  messages: StoredMessage[],
): Conversation | null {
  if (!isBrowser()) return null
  if (!messages || messages.length === 0) return null

  const list = readAll()
  const now = Date.now()
  const idx = list.findIndex((c) => c.id === id)
  const title = deriveTitle(messages)

  if (idx >= 0) {
    const updated: Conversation = {
      ...list[idx],
      title,
      messages,
      updatedAt: now,
    }
    list[idx] = updated
    writeAll(list)
    return updated
  }

  const created: Conversation = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages,
  }
  list.push(created)
  writeAll(list)
  return created
}

export function deleteConversation(id: string): void {
  const list = readAll().filter((c) => c.id !== id)
  writeAll(list)
  if (getCurrentId() === id) setCurrentId(null)
}

export function clearAllConversations(): void {
  if (!isBrowser()) return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(CURRENT_ID_KEY)
}

/**
 * 格式化时间为相对/绝对的人类可读字符串，用于历史列表显示。
 */
export function formatRelativeTime(ts: number): string {
  const now = Date.now()
  const diff = now - ts
  const min = 60_000
  const hour = 60 * min
  const day = 24 * hour

  if (diff < min) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`

  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
