---
title: createAgent
prev:
  text: 插件管道
  link: /model/plugins
next:
  text: 主进程里的循环
  link: /model/main-agent
---

# createAgent

单次 `streamText` 停在模型的第一段回复上。回复如果是「请调用网页搜索」，聊天还没完。必须有人执行搜索，把结果放回消息，再请求模型，直到它写出给用户的正文。这个循环在 AI SDK 里叫 `ToolLoopAgent`。Cherry 的 `createAgent` 只负责把模型和工具准备好，然后把它 new 出来。

## 五步，函数不长

```ts
export async function createAgent(options) {
  const { providerId, providerSettings, modelId, plugins, wrapModel, agentSettings } = options

  // 1. 执行器：厂商 + 插件
  const executor = await createExecutor(providerId, providerSettings, plugins)

  // 2. 把模型 id 解析成模型对象，中间件在这里已经套上
  const resolvedModel = await executor.resolveLanguageModel(modelId)

  // 3. 让插件改 agent 的设置
  const transformedSettings = await executor.pluginEngine.transformAgentSettings(resolvedModel, agentSettings)

  // 4. 最外层还可以再包一层，例如换 Key 重试
  const finalModel = wrapModel ? await wrapModel(resolvedModel) : resolvedModel

  // 5. 循环从这里开始，由 SDK 跑
  return new ToolLoopAgent({
    ...transformedSettings,
    model: finalModel
  })
}
```

第 3 步的注释是这个文件里最值得留下的一句：`ToolLoopAgent` 会拿着 settings 跑完整个循环，不会在每一轮再走进 `transformParams`。上一课那种「往 params 里塞工具」的插件，如果只在每轮请求时才运行，循环里的第二轮就看不见它。`transformAgentSettings` 是循环开始前的最后一次机会，把这些工具写进 agent 一直握着的设置。

`agentSettings` 里通常已经有业务传来的工具、系统提示、停止条件。插件是在此之上追加。`model` 不在 `agentSettings` 里，因为模型对象要等第 2 步才解析出来，第 5 步单独放进去。

返回值是 SDK 的 agent，不是一段字符串。调用方再对它 `stream`，才得到窗口要画的 chunk。

## 循环本身不在这个文件

`ToolLoopAgent` 的「有工具调用就执行并继续，没有就停」写在 `ai` 这个依赖里。Cherry 没有复制一份 while 循环。你要建立的直觉是：决策在模型，执行工具和把结果塞回消息在 SDK，厂商和插件在 `createAgent` 进入 SDK 之前准备好。

## 接下来

主进程还要加上系统提示、审批钩子和图片类工具结果的处理。那一层是 [主进程里的循环](/model/main-agent)。

源码：`packages/aiCore/src/core/agents/createAgent.ts`，全文就这些。
