import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'POLICY.AI · 政策指南针',
  description:
    '面向AI企业的赛博政策智能体 — 实时检索国家及地方AI产业政策，DeepSeek × Tavily 驱动',
  keywords: ['AI政策', '政策检索', '生成式AI备案', '高新技术认定', '算力补贴'],
  authors: [{ name: '石家庄铁道大学大创团队' }],
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
