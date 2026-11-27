---
title: 17 调用点和厂商分开
prev:
  text: 16 边出字和一次拿全
  link: /model/stream-text
next:
  text: 18 先改参数再请求
  link: /model/executor
---

# 17 调用点和厂商分开

> 这一课只加一件事：聊天代码只说模型 id。哪家厂商、密钥是什么，留在单独的一层。

## 问题

设置里可以选 OpenAI、Anthropic，或者一个兼容地址。如果气泡组件里写着 `new OpenAI({ apiKey })`，每加一家厂商就要改界面，Key 也会靠近渲染进程。

## 最小做法

调用点只留三样东西。厂商表在别处。

```ts
type Provider = {
  id: string
  stream(modelId: string, messages: unknown[]): AsyncIterable<string>
}

const providers: Record<string, Provider> = {}

function register(provider: Provider) {
  providers[provider.id] = provider
}

function chat(providerId: string, modelId: string, messages: unknown[]) {
  return providers[providerId].stream(modelId, messages)
}
```

`chat('openai', 'gpt-4o-mini', messages)` 和 `chat('deepseek', 'deepseek-chat', messages)` 是同一行代码，换的是第一个参数。兼容接口也是一个 `id`，它的 `stream` 内部把地址设成用户填的 baseURL。

密钥放在 `register` 时的闭包里，不出现在 `chat` 的参数里。渲染进程最多传 `providerId` 和 `modelId`，主进程再去表里找。

这层还有一件以后要做的事：把「调用一次」升级成「模型要工具就继续」。那是课 21。这一课先把调用点和厂商拆开。

## 在 Cherry Studio 里

这层是 `packages/aiCore`。`models` 负责创建某家的模型对象，`runtime` 负责拿着它去跑 `streamText`。界面不 import `@ai-sdk/openai`。

## 接下来

注册之后，一次调用内部还要先改参数。[18 先改参数再请求](/model/executor) 把这个顺序写出来。
