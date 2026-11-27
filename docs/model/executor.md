---
title: 一次调用怎么发出去
prev:
  text: 为什么有 aiCore
  link: /model/why-aicore
next:
  text: 换厂商不换调用方
  link: /model/provider
---

# 一次调用怎么发出去

`RuntimeExecutor` 是「调用一次模型」的对象。业务代码拿到它，调用 `streamText`。厂商实例、插件、模型 id 的解析都关在里面。

## 构造时记住是谁

```ts
this.pluginEngine = new PluginEngine(config.providerId, config.plugins || [])
this.registry = createProviderRegistry({
  [config.providerId]: provider
})
```

`providerId` 是 `'openai'` 或 `'anthropic'` 这样的名字。`provider` 是已经配好密钥和地址的客户端。AI SDK 的 `createProviderRegistry` 把名字和客户端登记在一起。之后只要说「openai 的某个模型」，注册表能找到客户端。

插件引擎同时建好。这一次调用要挂哪些插件，在构造时定下来，而不是散落在每次 `streamText` 的参数里。

## 调用时先改参数，再进 SDK

`streamText` 的参数里，`model` 可以是模型对象，也可以是字符串 id。是字符串时，执行器临时加一个内部插件 `_internal_resolveModel`，把 id 换成对象。调用方因此可以写 `model: 'gpt-4o-mini'`。

然后：

```ts
return this.pluginEngine.executeStreamWithPlugins(
  'streamText',
  params,
  (resolvedModel, transformedParams, streamTransforms) => {
    const experimental_transform =
      params?.experimental_transform ?? (streamTransforms.length > 0 ? streamTransforms : undefined)

    return _streamText({
      ...transformedParams,
      model: this.wrapModel(resolvedModel, wrapModel),
      experimental_transform
    })
  }
)
```

读这个回调的顺序：

1. `transformedParams` 是插件改过的参数。比如塞进了厂商自带的搜索工具。
2. `resolvedModel` 是解析后的模型对象。`wrapModel` 还可以再包一层，用来做重试或换 Key。
3. `_streamText` 才真正打开到厂商的 HTTP 流。

业务侧看不到 `fetch`。它看到的是执行器方法返回的流，这个流后面会被调度台交给窗口听众。

## 接下来

换一家厂商时，调用方要改哪几行？[换厂商不换调用方](/model/provider) 说明答案是「几乎不改调用，只改登记」。

源码：`packages/aiCore/src/core/runtime/executor.ts`。
