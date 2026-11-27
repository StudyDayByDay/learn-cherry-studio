---
title: 08 一条回复是数组
prev:
  text: 07 气泡先有框
  link: /ui/frame
next:
  text: 09 工具名决定卡片
  link: /ui/tools
---

# 08 一条回复是数组

> 这一课只加一件事：助手的一条回复是按顺序排列的块，渲染器按 type 找组件。

## 问题

模型先想了想，再搜网页，再写答案。如果气泡只有一个 `content: string`，思考、搜索和答案会糊成一段文字，搜索结果也无法单独折叠。

## 最小做法

一条消息是数组。渲染就是一个 switch。

```tsx
type Part =
  | { type: 'reasoning'; text: string }
  | { type: 'tool'; name: string; output: unknown }
  | { type: 'text'; text: string; streaming: boolean }

function Parts({ parts }: { parts: Part[] }) {
  return parts.map((part, index) => {
    switch (part.type) {
      case 'reasoning':
        return <Thinking key={index} text={part.text} />
      case 'tool':
        return <ToolCard key={index} name={part.name} output={part.output} />
      case 'text':
        return <Markdown key={index} text={part.text} streaming={part.streaming} />
    }
  })
}
```

「今天北京天气怎么样」的回复可以是：

```ts
const parts: Part[] = [
  { type: 'reasoning', text: '这要实时信息，先搜索。' },
  { type: 'tool', name: 'web_search', output: { hits: ['多云 12°C'] } },
  { type: 'text', text: '今天北京多云，12°C。', streaming: false }
]
```

顺序就是数组顺序。界面不重新排列。`streaming: true` 时 Markdown 先别解析未闭合的语法，光标留在末尾。下一个片段来了，只是 `text` 变长。

连续的工具可以先收成一组再画，这是体验优化。主线是：类型决定组件。

## 在 Cherry Studio 里

类型名来自 AI SDK：`text`、`reasoning`、`tool-*`。`MessagePartsRenderer` 的 `case 'text'` 把 `part.text` 交给 `MainTextBlock`，并把 `isStreaming` 传下去。文件很长，因为折叠和引用也在里面。形状就是上面这个 switch。

## 接下来

工具块还要按名字选卡片。[09 工具名决定卡片](/ui/tools) 只加一张分发表。
