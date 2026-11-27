---
title: 插件管道
prev:
  text: 换厂商不换调用方
  link: /model/provider
next:
  text: createAgent
  link: /model/create-agent
---

# 插件管道

网页搜索、把厂商原生工具塞进请求、改写温度，这些如果都写进 `streamText` 的调用点，每个调用点都要记得做一遍。插件把「请求发出去之前改参数」收成可插拔的一步。执行器自己的 `PluginEngine` 按顺序调用它们。

## 一个插件就是若干钩子

内置的厂商工具插件很短，适合看清形状：

```ts
export const providerToolPlugin = (capability: ToolCapability, config: Record<string, any> = {}) =>
  definePlugin({
    name: capability,
    enforce: 'pre',
    transformParams: async (params: any, context) => {
      const { providerId } = context
      const modelProvider =
        context.model && typeof context.model !== 'string' && 'provider' in context.model
          ? context.model.provider
          : undefined
      const resolved = await extensionRegistry.resolveToolCapability(providerId, capability, modelProvider)
      if (!resolved) return params

      const userConfig = config[providerId] ?? {}
      const patch = resolved.factory(resolved.provider)(userConfig)

      if (patch.tools) {
        params.tools = { ...params.tools, ...patch.tools }
      }
      if (patch.providerOptions) {
        params.providerOptions = mergeProviderOptions(params.providerOptions, patch.providerOptions)
      }
      return params
    }
  })
```

`definePlugin` 登记名字和钩子。`enforce: 'pre'` 表示它排在管道前段。`transformParams` 拿到这次请求的参数和上下文。

它问扩展注册表：这个厂商支不支持某种能力，比如原生的网页搜索。不支持就原样返回参数，调用继续。支持就把工厂函数产生的工具合并进 `params.tools`。原来的工具还在，新工具加上去。`providerOptions` 是这家厂商特有的额外字段，用合并而不是覆盖，避免冲掉温度之类已经设好的项。

解析模型 id 也是一个插件，名字是 `_internal_resolveModel`，在执行器构造时塞进去，`enforce` 为 `post`，排在这些业务插件之后。所以业务插件看到的 `context.model` 有时还是字符串，代码里才要判断 `'provider' in context.model`。

## 和循环的关系

插件改的是一次请求的参数。模型调用工具之后还要再请求一次，那是下一课的循环。有一个坑要先知道：循环一旦开始，并不会每一轮都重新跑这套 `transformParams`。所以只靠 `transformParams` 注入的工具，必须在循环开始前写进 agent 的设置。`createAgent` 里有专门的一步做这件事。

## 接下来

[createAgent](/model/create-agent) 把执行器交出去，换成一个会自己跑工具的 `ToolLoopAgent`。

源码：`packages/aiCore/src/core/plugins/built-in/providerToolPlugin.ts`。
