---
title: UIMessage 与 parts
prev:
  text: AiStreamManager
  link: /boundary/stream-manager
next:
  text: streamText 与 generateText
  link: /model/stream-text
---

# UIMessage 与 parts

前面界面课里的「一条消息、里面有多块」，在 Vercel AI SDK 里有正式的名字。搞懂这两个类型，后面的流、工具、思考过程就都挂得上去。

## 画在屏幕上的那一份

SDK 把界面消息叫做 `UIMessage`。正文不在 `content: string` 里，而在有序的 `parts` 里。你在内容块那一课见过的数组，就是它：

```ts
{
  id: 'm2',
  role: 'assistant',
  parts: [
    { type: 'reasoning', text: '需要实时天气。', state: 'done' },
    { type: 'tool-web_search', toolCallId: 'call_1', state: 'output-available', input: { query: '北京天气' }, output: { /* ... */ } },
    { type: 'text', text: '今天北京多云，12°C。', state: 'done' }
  ]
}
```

`role` 仍是 `user` 或 `assistant`。`parts` 让一条助手消息同时带上思考、工具和正文。Cherry 在 SDK 的元数据上加了自己的字段，运行时包里写成：

```ts
export type RuntimeMessage = UIMessage<{
  completeness: Completeness
  inputId?: InputId
  error?: RuntimeError
}>
```

`completeness` 是 `'partial' | 'complete' | 'unknown'`。字还在吐的时候，这条消息可以是 partial。这和界面上 `state: 'streaming'` 是同一件事的两侧：一边是消息级的「还没写完」，一边是某个 part 自己的状态。

产品里的完整类型叫 `CherryUIMessage`，字段更多，例如引用和用量。读主线时先认 `role + parts`。

## 发给模型的是另一份

模型接口要的历史常常叫 `ModelMessage`。它更接近「user / assistant / tool 的对话记录」，不一定保留界面上的折叠状态和头像。主进程在真正请求前做转换，入口之一是 `toModelMessages`。

所以仓库里有两份消息：

- `UIMessage`：窗口正在画的，parts 齐全。
- `ModelMessage`：这一轮塞进模型上下文的。

流式 chunk 先更新 `UIMessage`。压缩上下文时动的是 `ModelMessage`。后面压缩那一课会再看到这个区别。把两者当成同一个对象，会在「为什么界面上还在、发给模型的历史却变短了」上卡住。

## 接下来

让模型产生这些 parts，有两个入口函数。[streamText 与 generateText](/model/stream-text) 说明聊天为什么用流。

源码：`packages/agent-runtime/src/contracts.ts` 的 `RuntimeMessage`。界面 parts 的类型来自依赖 `ai`。
