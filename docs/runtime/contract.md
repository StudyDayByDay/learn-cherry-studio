---
title: 25 别人跑，我们观察
prev:
  text: 24 发出去之前先变短
  link: /model/context
next:
  text: 26 只追加几个字
  link: /runtime/text-delta
---

# 25 别人跑，我们观察

> 这一课只加一件事：外部 agent 自己跑循环。我们规定它的事件最后必须变成课 15 的那条消息。

## 问题

Pi 和 Claude Code 已经会调用工具、压缩上下文。如果再套一层课 21 的 `while`，就有两个循环在抢同一段对话。界面如果为每家写一套气泡，课 08 的 switch 会分裂。

## 最小做法

不启动它们的模型。只规定观察结果的形状。

```ts
type Thread = { backend: 'pi' | 'claude'; id: string }

type RuntimeMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: Part[]
  partial: boolean
}

type Observer = {
  thread: Thread
  onMessage(message: RuntimeMessage): void
}
```

`backend` 区分是谁在跑。`id` 在那个后端里稳定，不必等于界面上的话题 id。产品自己记一张对照表。`partial` 为真时，界面把它当成还在流，和课 10 的活消息是同一信号。

这个类型里没有窗口，没有数据库，也没有 HTTP。谁把 Pi 的原生事件收成 `RuntimeMessage`，是适配器的工作，课 29 再对名字。

## 在 Cherry Studio 里

包是 `packages/agent-runtime`。`Thread` 用 `backendId` 和 `ThreadId`。`RuntimeMessage` 就是 AI SDK 的 `UIMessage`，外加完整度、输入 id 和错误。README 写明它不依赖 Electron，也不负责把 agent 跑起来。

## 接下来

原生事件通常是几个新字，不是整条消息换掉。[26 只追加几个字](/runtime/text-delta) 规定编辑只有三种。
