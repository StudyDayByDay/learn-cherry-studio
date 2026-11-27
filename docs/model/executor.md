---
title: 18 先改参数再请求
prev:
  text: 17 调用点和厂商分开
  link: /model/why-aicore
next:
  text: 19 换厂商只换登记
  link: /model/provider
---

# 18 先改参数再请求

> 这一课只加一件事：执行器先把模型 id 变成模型对象，再把参数交给真正的请求。

## 问题

调用方希望写 `model: 'gpt-4o-mini'`。SDK 要的是一个模型对象。如果每个调用点自己做这个转换，字符串和对象会混在业务代码里。

## 最小做法

执行器记住厂商和一组「改参数」的函数。`stream` 时按顺序改，最后才请求。

```ts
type Params = { model: string | Model; messages: unknown[] }

class Executor {
  constructor(
    private providerId: string,
    private plugins: Array<(params: Params) => Promise<Params>>
  ) {}

  async stream(params: Params) {
    let next = params
    if (typeof next.model === 'string') {
      next = { ...next, model: resolve(this.providerId, next.model) }
    }
    for (const plugin of this.plugins) next = await plugin(next)
    return streamText(next)
  }
}
```

`resolve` 问上一课的注册表。插件看到的有时还是字符串，有时已经是对象，所以插件里要判断。业务代码只跟 `Executor.stream` 说话，看不到 `fetch`。

## 在 Cherry Studio 里

这个类叫 `RuntimeExecutor`。构造时 `new PluginEngine(providerId, plugins)`，并用 `createProviderRegistry` 登记厂商。模型 id 的解析本身也是一个插件，名字是 `_internal_resolveModel`。`streamText` 方法把改完的参数交给从 `ai` 引进来的 `_streamText`。

## 接下来

换一家厂商时，`stream` 的调用要不要改？[19 换厂商只换登记](/model/provider) 的答案是不改调用。
