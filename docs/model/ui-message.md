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

预计 15 分钟。

## 这一坐要看懂什么

界面上的一条消息，在 Vercel AI SDK 里叫 `UIMessage`。它的正文不是一个字符串，而是有序的 parts。常见的有：

| part | 界面上是什么 |
| --- | --- |
| `text` | 正文 |
| `reasoning` | 思考过程 |
| `tool-*` 或动态工具 part | 一次工具调用和它的结果 |
| `file` | 附件 |

Cherry Studio 在这个类型上又加了自己的元数据，例如完整度、输入 id、错误。产品类型名叫 `CherryUIMessage`，定义在共享数据类型里。运行时包里的 `RuntimeMessage` 是同一套 `UIMessage` 的一个特化。

## 先打开哪个文件

`packages/agent-runtime/src/contracts.ts` 里 `RuntimeMessage` 那几行。再回想界面课的 `case 'text'`。

## 关键代码

```ts
// agent/cherry-studio/packages/agent-runtime/src/contracts.ts
export type RuntimeMessage = UIMessage<{
  completeness: Completeness
  inputId?: InputId
  error?: RuntimeError
}>
```

`Completeness` 是 `'partial' | 'complete' | 'unknown'`。流还在吐的时候，这条消息可以是 partial。这和界面上 `state === 'streaming'` 是同一件事的两侧。

发给模型的历史有时会转成另一种结构 `ModelMessage`。那是模型接口要的格式，和画在屏幕上的 `UIMessage` 不是同一个类型。转换发生在主进程，例如 `src/main/ai/messages/messageRules.ts` 的 `toModelMessages`。这一坐知道有这一步即可。

## 记住这一点

先记 `UIMessage` 和 parts。看到 `ModelMessage`，把它当成「即将发给模型的那一份」，不要和气泡里的数据混成一个类型。

## 先不要展开的目录

- `src/shared/data/types/message`。`CherryUIMessage` 的完整字段在这里，很长。
- `packages/agent-runtime/src/contracts.ts` 里上下文占用、输入状态的后半。运行时课会拆开。
