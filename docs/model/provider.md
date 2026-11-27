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

预计 15 分钟。

## 这一坐要看懂什么

执行器构造时已经把「哪家厂商」收成 `providerId` 加一个 provider 实例。聊天代码传入 id 和设置，不自己 `new OpenAI()`。换一家厂商，是换注册表里的那一项，以及对应的 base URL 和密钥。

内置厂商在 `aiCore` 的 provider 层。产品里用户在设置页添加的模型，会变成主进程拿得到的 `providerSettings`，再传给同一个执行器。

## 先打开哪个文件

`packages/aiCore/src/core/providers/index.ts` 的导出列表，以及 `packages/aiCore/README.md` 里「支持的 Providers」一节。

## 关键代码

README 列出的核心厂商包括 OpenAI、Anthropic、Google、OpenAI 兼容接口、xAI、Azure OpenAI、DeepSeek。扩展厂商通过注册 API 加进去。

执行器侧只依赖这个登记结果：

```ts
this.registry = createProviderRegistry({
  [config.providerId]: provider
})
```

调用 `streamText` 的人继续传 `model` id。解析 id 的插件按当前 `providerId` 去注册表里找。

## 记住这一点

兼容接口是一等公民。很多国产模型和中转站走 OpenAI 兼容协议，它们在这条链上就是另一个 `providerId`，不是另一套聊天代码。

## 先不要展开的目录

- `providers/core/ExtensionRegistry.ts`。等你要加一家新厂商时再读。
- 根 `package.json` 里每一个 `@ai-sdk/*`。那是可选依赖清单，不是调用顺序。
