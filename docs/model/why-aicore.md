---
title: 为什么有 aiCore
prev:
  text: streamText 与 generateText
  link: /model/stream-text
next:
  text: 一次调用怎么发出去
  link: /model/executor
---

# 为什么有 aiCore

设置页里可以选 OpenAI、Anthropic、Gemini、DeepSeek，也可以填一个兼容接口的地址。对聊天页来说，这些都应该是「一个模型 id」。如果每种厂商在 React 里各写一个客户端，换厂商就要改界面。

`packages/aiCore` 把这件事收成一个包。界面和主进程业务只依赖它的运行时，不依赖某一家的 SDK。

## 两层

包自己的说明把结构收成：

- `models`：给定厂商 id 和密钥，创建出 SDK 要的模型对象。
- `runtime`：拿着这个模型去跑 `streamText` / `generateText`，并允许插件在请求前后插手。

聊天代码写的是「用这个 providerId 和 modelId 跑一段流」。OpenAI 的 `baseURL`、Anthropic 的请求头，留在 models 层。你以后要加一家厂商，改的是注册，不是消息列表。

这个包还做第三件事：把单次调用升级成会自己跑工具的 agent。文件 `createAgent.ts` 的开头是：

```ts
import { ToolLoopAgent } from 'ai'
import { createExecutor } from '../runtime'
```

单次 `streamText` 在模型说出「我要调用搜索」时，结果里只有工具调用，没有最终回答。`ToolLoopAgent` 负责把工具结果送回去再问一次。`createAgent` 负责把 Cherry 的厂商解析和插件接到这个类上。那一课会把函数走完。现在先记住层次：厂商在下，一次调用在中，工具循环在上。

## 密钥不进这个包的界面侧

`aiCore` 接收 `providerSettings`，里面可以有 Key。调用它的是主进程。渲染进程只传模型 id，主进程再把设置填上。所以即使用了统一接口，Key 仍然不出现在 React 的打包结果里。

## 接下来

一次调用具体怎么从「模型 id 字符串」变成 SDK 的 `streamText`，看 [一次调用怎么发出去](/model/executor)。

源码：`packages/aiCore/README.md` 和 `packages/aiCore/src/core/agents/createAgent.ts` 的文件头。
