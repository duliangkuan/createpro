import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '政策指南针 - AI产业政策智能顾问',
  description:
    '面向 AI 企业、政府、投资机构的政策问答平台，实时检索国家及地方 AI 产业政策，提供带来源引用的专业解答。',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
