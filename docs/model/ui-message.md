---
title: 15 消息是一组块
prev:
  text: 14 调度台不生成文字
  link: /boundary/stream-manager
next:
  text: 16 边出字和一次拿全
  link: /model/stream-text
---

# 15 消息是一组块

> 这一课只加一件事：界面上的一条消息叫 UIMessage，正文在 parts 里。发给模型的是另一份。

## 问题

课 08 的数组如果只是前端自己发明的，主进程每推一次都要翻译。模型和界面各说一种结构，增量就对不齐。

## 最小做法

两边约定同一种界面消息。发给模型之前再转一份更瘦的历史。

```ts
type UIMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: Array<
    | { type: 'text'; text: string; state: 'streaming' | 'done' }
    | { type: 'reasoning'; text: string }
    | { type: 'tool'; name: string; input: unknown; output?: unknown }
  >
}

type ModelMessage = { role: 'user' | 'assistant' | 'tool'; content: unknown }

function toModelMessages(ui: UIMessage[]): ModelMessage[] {
  return ui.map((message) => ({
    role: message.role,
    content: message.parts
  }))
}
```

`UIMessage` 是窗口正在画的，带流式状态。`ModelMessage` 是这一轮塞进上下文的。压缩历史时改的是后者，窗口上的旧气泡可以还在。

流还没结束时，给界面消息加一个 `partial`。它和 part 上的 `state: 'streaming'` 是同一件事：一个在消息上，一个在块上。

## 在 Cherry Studio 里

Vercel AI SDK 的类型就叫 `UIMessage`，块的类型名是 `text`、`reasoning`、`tool-*`。Cherry 在元数据里加了完整度和错误，运行时包写成 `RuntimeMessage`。产品里的完整类型叫 `CherryUIMessage`。转成模型历史的函数之一是 `toModelMessages`。

## 接下来

怎样让模型产生这些块？[16 边出字和一次拿全](/model/stream-text) 区分两种等法。
