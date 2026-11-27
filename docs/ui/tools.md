---
title: 09 工具名决定卡片
prev:
  text: 08 一条回复是数组
  link: /ui/blocks
next:
  text: 10 只有活消息在变
  link: /ui/stream
---

# 09 工具名决定卡片

> 这一课只加一件事：工具卡片是一张名字到组件的表。表不执行工具。

## 问题

搜索、知识库、画图的结果都是工具块，外观不该一样。如果在渲染大 switch 里继续写每种工具的 JSX，那个文件会同时懂 Markdown 和每一种结果格式。

## 最小做法

先按 type 进到工具，再按 name 查表。

```tsx
const cards: Record<string, (output: unknown) => JSX.Element> = {
  web_search: (output) => <SearchCard hits={(output as Search).hits} />,
  knowledge_search: (output) => <KnowledgeCard chunks={(output as Chunks).chunks} />
}

function ToolCard({ name, output }: { name: string; output: unknown }) {
  const Card = cards[name]
  if (!Card) return <pre>{JSON.stringify(output, null, 2)}</pre>
  return <Card {...{ output }} />
}
```

没有专用卡片时退回 JSON，列表不会崩。加一种工具的外观，是往 `cards` 里加一行。这和后面模型课「加一个工具只加一个函数」是同一习惯：分发点保持不动。

卡片拿到的 `output` 已经是结果。搜索请求在主进程里结束了。卡片上的「允许」按钮也只是把选择送回去，真正执行仍在主进程。

## 在 Cherry Studio 里

`chooseTool.tsx` 看工具名。`builtin_web_search` 去掉前缀后画搜索卡，`knowledge_search` 画知识库卡，带 `mcp__` 的走另一张时间线。查不到就返回空。

## 接下来

打字时不能把历史气泡全部重画。[10 只有活消息在变](/ui/stream) 把正在写的消息单独标出来。
