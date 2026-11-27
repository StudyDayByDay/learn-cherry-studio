---
title: 19 换厂商只换登记
prev:
  text: 18 先改参数再请求
  link: /model/executor
next:
  text: 20 加能力只加一个函数
  link: /model/plugins
---

# 19 换厂商只换登记

> 这一课只加一件事：换 OpenAI、Anthropic 或一个兼容地址，动的是注册表，不是聊天代码。

## 问题

用户在设置里新增一个中转站，填地址和 Key，选一个模型名。如果这要求改消息列表，桌面应用就没法让用户自己加模型。

## 最小做法

调用永远这三行。新厂商是表里的新一行。

```ts
register({
  id: 'proxy',
  stream(modelId, messages) {
    return streamText({
      baseURL: 'https://proxy.example/v1',
      apiKey: secretFromMain,
      model: modelId,
      messages
    })
  }
})

await chat('proxy', 'some-model', messages)
```

`chat` 是课 17 的那个函数。`'proxy'` 只是 id。很多国产模型提供的就是「看起来像 OpenAI」的地址，所以兼容接口是正常的一家，不是例外分支。

解析失败应该在发 HTTP 之前抛出。窗口收到错误，而不是一个永远不结束的流。

## 在 Cherry Studio 里

执行器构造时 `createProviderRegistry({ [providerId]: provider })`。用户在设置页保存的地址和 Key 变成 `providerSettings`，由主进程传进执行器。`MessageList` 只显示模型名字。核心厂商包括 OpenAI、Anthropic、Google、DeepSeek 和 OpenAI 兼容接口。

## 接下来

网页搜索不想写进每一个 `chat()`。[20 加能力只加一个函数](/model/plugins) 把它挂到执行器上。
