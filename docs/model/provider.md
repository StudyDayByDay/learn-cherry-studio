---
title: 换厂商不换调用方
prev:
  text: 一次调用怎么发出去
  link: /model/executor
next:
  text: 插件管道
  link: /model/plugins
---

# 换厂商不换调用方

上一课的执行器只认 `providerId` 和注册表里的客户端。聊天代码不写 `new OpenAI()`。换厂商是换注册的那一项。

## 调用方保持这三样

一次聊天请求在业务层始终是：

```ts
streamText({
  model: modelId,
  messages,
  tools
})
```

`modelId` 是字符串。执行器按当前的 `providerId` 去注册表里找谁能解析这个 id。同一句调用，`providerId` 从 `openai` 换成 `anthropic`，走的就是另一家的 HTTP。温度、消息、工具这些参数名字保持 SDK 的统一形状，各家请求体的差异在 provider 适配器内部消化。

包文档里列出的核心厂商包括 OpenAI、Anthropic、Google、xAI、Azure OpenAI、DeepSeek，以及 OpenAI 兼容接口。兼容接口是一等公民：很多国产模型和中转站提供的就是「看起来像 OpenAI」的地址。对 Cherry 来说，那是另一个 `providerId`，外加用户填写的 `baseURL` 和 Key，不是另一套聊天气泡。

用户在设置页添加模型时，主进程把这些设置收成 `providerSettings`，构造执行器时传进去。YAML 或界面上的模型列表变了，`MessageList` 不用改。

## 解析发生在内部插件

执行器里那个 `_internal_resolveModel` 插件做的就是：拿着字符串，问注册表要模型对象。解析失败会在进 HTTP 之前抛出，窗口收到的是错误 chunk，而不是一个挂起的流。

所以「换厂商」的代码审查点在 provider 注册和设置，不在 `components/chat`。界面只显示模型名字。

## 接下来

网页搜索、厂商自带工具不想写进每一次 `streamText`。[插件管道](/model/plugins) 把这些横切能力挂到执行器上。

源码：`packages/aiCore/src/core/providers/index.ts`，以及执行器构造函数里的 `createProviderRegistry`。
