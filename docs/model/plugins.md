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

预计 15 分钟。

## 这一坐要看懂什么

网页搜索、厂商自带工具、参数改写，不写进 `streamText` 的业务代码里。它们是插件。插件在请求发出前改参数，也可以在流上做转换。执行器的 `PluginEngine` 负责按顺序调用它们。

一个插件至少有名字，以及若干钩子。常见钩子是 `transformParams`：拿到这次请求的参数，返回改过的参数。

## 先打开哪个文件

`packages/aiCore/src/core/plugins/built-in/providerToolPlugin.ts`。这是「按厂商能力往参数里塞工具」的例子，全文很短。类型在 `packages/aiCore/src/core/plugins/types.ts`。

## 关键代码

```ts
// agent/cherry-studio/packages/aiCore/src/core/plugins/built-in/providerToolPlugin.ts
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
        // 合并进这次请求的 tools
      }
    }
  })
```

`enforce: 'pre'` 表示它在内部解析模型之前或管道前段运行。解析模型本身也是一个内部插件，名字叫 `_internal_resolveModel`，在执行器构造函数里。

## 记住这一点

新的横切能力优先做成插件，挂到执行器上。这样 `streamText` 的调用点保持「模型、消息、工具」三样东西。

## 先不要展开的目录

- `pluginEngine.ts` 的递归调用和深度限制。类型文件里的 `recursiveDepth` 是防栈溢出的，出问题时再看。
- `plugins/built-in` 以外、散落在主进程里的具体搜索实现。工具课会看一个例子。
