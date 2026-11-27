---
title: 10 只有活消息在变
prev:
  text: 09 工具名决定卡片
  link: /ui/tools
next:
  text: 11 页面把对象填满
  link: /ui/home-adapter
---

# 10 只有活消息在变

> 这一课只加一件事：历史消息和正在写的消息分成两层，更新只打在活的那一层。

## 问题

模型每来十几个字，如果替换整段 `messages` 数组，上面已经完成的几十条气泡都会重新渲染。聊天越长，出字越卡。

## 最小做法

历史放一份稳定的表。正在写的 id 另记一份。

```tsx
type StreamState = {
  history: Record<string, Part[]>
  liveIds: string[]
}

function appendText(state: StreamState, id: string, more: string): StreamState {
  if (!state.liveIds.includes(id)) return state
  const parts = state.history[id] ?? []
  const next = parts.map((part) =>
    part.type === 'text' && part.streaming ? { ...part, text: part.text + more } : part
  )
  return { ...state, history: { ...state.history, [id]: next } }
}
```

`liveIds` 里没有的 id，函数直接返回原 state。React 看到历史层的那些消息引用没变，就跳过它们。

一块正文自己也有 `streaming`。它为真时，Markdown 组件知道语法可能还没闭合。模型说结束之后，把 `streaming` 改成 false，光标消失。

界面并不拼接原始字节。主进程推来的已经是「到目前为止的文本」或「这一小段增量」。这一课只要求界面把增量加到活消息上。增量怎样跨进程，是课 12。

## 在 Cherry Studio 里

`streamingLayers` 有两份字段：`historyPartsByMessageId` 和 `liveMessageIds`。正文 part 的 `state === 'streaming'` 就是上面的 `streaming`。说明文档里写过 `stream/` 目录，当前仓库没有这个文件夹，流式就靠这两份数据。

## 接下来

这些 state 谁来填？[11 页面把对象填满](/ui/home-adapter) 是首页的适配器。
