# POLICY.AI · 政策指南针

> **赛博朋克风格的中国 AI 产业政策智能体**
> 实时检索国家及地方 AI 产业政策，DeepSeek × Tavily 驱动。

由石家庄铁道大学大创团队出品。

---

## ✨ 功能

- **实时联网检索**：每次提问触发 Tavily 在 `gov.cn` / `miit.gov.cn` / `cac.gov.cn` 等权威政府站点搜索最新政策
- **带来源引用**：所有回答末尾附 `[REF.01] [REF.02]` 终端日志风格的来源卡片，可直接跳转原文
- **流式输出**：DeepSeek `tool_calls` + SSE 双管道，回答逐字呈现
- **多轮对话**：完整保留对话上下文
- **赛博朋克 UI**：霓虹青/蓝/红三色体系 + 玻璃拟态 + 扫描线 + 六边形头像

## 📋 覆盖政策领域

生成式AI管理 · 数据安全与跨境 · 算力补贴 · 高新技术企业认定 · 专精特新认定 · AI伦理合规 · 自动驾驶测试 · 医疗AI审批

---

## 🚀 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量并填入密钥
cp .env.local.example .env.local
#   DEEPSEEK_API_KEY=...   从 https://platform.deepseek.com 获取
#   TAVILY_API_KEY=...     从 https://app.tavily.com 获取（免费 1000次/月）

# 3. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 🩺 健康检查

```bash
curl http://localhost:3000/api/health
# {"status":"ok","service":"policy-ai","version":"2.0.1",...}
```

---

## ☁️ 部署到 Vercel

1. 推送到 GitHub
   ```bash
   git init && git add . && git commit -m "feat: policy-ai v2.0.1"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```
2. 打开 [vercel.com](https://vercel.com) → Import Project
3. 在 **Environment Variables** 添加：
   - `DEEPSEEK_API_KEY`
   - `TAVILY_API_KEY`
4. 点击 Deploy

> ⚠️ `.env.local` 已在 `.gitignore` 中，密钥不会泄漏到 GitHub。

---

## 🛠️ 技术栈

| 层级 | 选型 |
|---|---|
| 框架 | Next.js 14（App Router） |
| 语言 | TypeScript |
| 模型 | DeepSeek `deepseek-chat`（OpenAI 兼容协议） |
| 检索 | Tavily Search API（含 `includeDomains` 政府站点过滤） |
| 样式 | Tailwind CSS + 自定义 CSS 变量 + 关键帧动画 |
| 字体 | Orbitron（标题）· JetBrains Mono（代码）· Noto Sans SC（正文） |
| 部署 | Vercel（`/api/chat` maxDuration = 30s） |

## 📁 目录

```
policy-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts     # 主对话 API（DeepSeek tool_call + Tavily + SSE）
│   │   └── health/route.ts   # 健康检查
│   ├── globals.css           # 赛博朋克主题 + 关键帧动画
│   ├── layout.tsx            # 字体引入 + 元数据
│   ├── not-found.tsx         # 404 页（也是赛博风）
│   └── page.tsx              # 主页：Header + 网格背景 + 光晕
├── components/
│   ├── ChatWindow.tsx        # 对话主容器 + 欢迎屏 + 输入框 + 扫描进度条
│   ├── MessageBubble.tsx     # 用户/AI 双气泡 + 六边形头像
│   └── SourceCard.tsx        # 终端日志样式来源卡
├── lib/
│   └── tools.ts              # Tavily tool 定义 + System Prompt
├── public/
│   └── favicon.svg           # 自定义六边形 SVG 图标
├── vercel.json               # /api/chat maxDuration = 30
├── next.config.js
└── package.json
```

---

## 📝 License

仅供学习与大创比赛使用，政策内容以官方文件为准。
