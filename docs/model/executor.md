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

预计 15 分钟。

## 这一坐要看懂什么

`RuntimeExecutor` 是一次模型调用的执行器。构造时它记住厂商 id、厂商实例和插件列表，并用 AI SDK 的 `createProviderRegistry` 登记这家厂商。`streamText` 被调用时，它先让插件改参数、解析模型，再把结果交给 SDK。

## 先打开哪个文件

`packages/aiCore/src/core/runtime/executor.ts` 的构造函数和 `streamText` 方法。

## 关键代码

```ts
// agent/cherry-studio/packages/aiCore/src/core/runtime/executor.ts
this.pluginEngine = new PluginEngine(config.providerId, config.plugins || [])
this.registry = createProviderRegistry({
  [config.providerId]: provider
})

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

`model` 参数如果是字符串，执行器会插入一个内部插件，把模型 id 解析成模型对象。调用方可以只写 `'gpt-4o-mini'` 这种 id。

## 记住这一点

业务代码拿到的是执行器。执行器内部才碰 SDK 的 `streamText`。插件要改的是进执行器的参数，不是去包一层新的 HTTP 客户端。

## 先不要展开的目录

- `pluginEngine.ts` 的钩子排序。下一课只看插件长什么样。
- 构造函数里给 embedding 打补丁的那几行。那是兼容某些 v3 provider 的特例。
