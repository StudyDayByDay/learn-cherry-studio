---
title: streamText 与 generateText
prev:
  text: UIMessage 与 parts
  link: /model/ui-message
next:
  text: 为什么有 aiCore
  link: /model/why-aicore
---

# streamText 与 generateText

预计 12 分钟。

## 这一坐要看懂什么

AI SDK 对「让模型说话」提供两个入口。

`streamText` 马上返回一个流。文字、工具调用、结束原因随着生成陆续到达。聊天窗口用它。

`generateText` 等到整段结果结束，一次给你全文。标题生成、摘要、不需要逐字显示的内部步骤用它。

两者的参数很像：模型、消息、工具、温度。差别在等待方式。Cherry Studio 没有改写这两个函数，它在外面套了一层执行器，最后仍调用 SDK 的原函数。

## 先打开哪个文件

`packages/aiCore/src/core/runtime/executor.ts`，搜 `async streamText` 和 `async generateText`。

## 关键代码

```ts
// agent/cherry-studio/packages/aiCore/src/core/runtime/executor.ts
return _streamText({
  ...transformedParams,
  model: this.wrapModel(resolvedModel, wrapModel),
  experimental_transform
})
```

`generateText` 的结构相同，最后调用 `_generateText`。下划线前缀表示这是从 `ai` 包引进来的原函数。

主进程的 `Agent.generate` 同时支持两种模式：`'generate' | 'stream'`。聊天主路径走 stream。

## 记住这一点

用户能看见字一个个出来，背后就是 `streamText`。一次返回全文，背后就是 `generateText`。

## 先不要展开的目录

- `executor.ts` 里的 embedding、图片、rerank。那是别的模态，调用形状类似，主线先跳过。
- SDK 自己的 `node_modules/ai`。官方文档够用，不必在依赖里翻实现。
