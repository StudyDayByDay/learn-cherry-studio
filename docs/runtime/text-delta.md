---
title: 26 只追加几个字
prev:
  text: 25 别人跑，我们观察
  link: /runtime/contract
next:
  text: 27 执行前先问一句
  link: /runtime/approval
---

# 26 只追加几个字

> 这一课只加一件事：文本的变化是对某一块的 open、append、finish，不是把整段回复再发一遍。

## 问题

如果每次都把整条助手消息推给界面，界面要比对全文才知道多了哪几个字。历史一长，观察流比模型本身还重。

## 最小做法

三种编辑。接收方只改那一块。

```ts
type Edit =
  | { type: 'open'; messageId: string; partIndex: number; kind: 'text' | 'reasoning' }
  | { type: 'append'; messageId: string; partIndex: number; text: string }
  | { type: 'finish'; messageId: string; partIndex: number }

function apply(parts: Part[], edit: Edit): Part[] {
  if (edit.type === 'open') {
    return [...parts, { type: edit.kind, text: '', streaming: true }]
  }
  if (edit.type === 'append') {
    return parts.map((part, index) =>
      index === edit.partIndex && 'text' in part ? { ...part, text: part.text + edit.text } : part
    )
  }
  return parts.map((part, index) => (index === edit.partIndex ? { ...part, streaming: false } : part))
}
```

`open` 开始一块新的正文或思考。`append` 往已知位置加几个字。`finish` 把 `streaming` 关掉，Markdown 可以按完整文本解析。

整块替换，或者放进一个工具块，不走这三种。那种变化直接给一整块新的 part。纯追加才拆细，是为了让课 10 的活消息只收到增量。

这和聊天流里的 `text-delta` 是同一件事。聊天用 SDK 的 chunk 表达，外部 agent 用这三种编辑表达。窗口最后都是某个 text 变长了。

## 在 Cherry Studio 里

`textPartUpdates` 把 `open`、`append`、`finish` 收成 `message.text-open` 这类事件。遇到 `correct` 或 `put` 就返回空，调用方改用整批 parts。

## 接下来

有的工具不能马上 `run`。[27 执行前先问一句](/runtime/approval) 在执行前加一道门。
