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

预计 15 分钟。这是转型主线上最短、也最值得背下来的文件。

## 这一坐要看懂什么

单次 `streamText` 在模型要求调用工具时就结束了。聊天产品需要一个循环：模型说要调工具，执行工具，把结果送回去，再问模型，直到它不再调工具。

AI SDK 把这个循环做成 `ToolLoopAgent`。`createAgent` 负责把 Cherry 的执行器接到这个类上：解析模型、让插件改 agent 设置、可选地再包一层重试，然后 `new ToolLoopAgent`。

## 先打开哪个文件

`packages/aiCore/src/core/agents/createAgent.ts`。全文大约 60 行，建议读完。

## 关键代码

```ts
// agent/cherry-studio/packages/aiCore/src/core/agents/createAgent.ts
export async function createAgent(options) {
  const executor = await createExecutor(providerId, providerSettings, plugins)
  const resolvedModel = await executor.resolveLanguageModel(modelId)
  const transformedSettings = await executor.pluginEngine.transformAgentSettings(
    resolvedModel,
    agentSettings
  )
  const finalModel = wrapModel ? await wrapModel(resolvedModel) : resolvedModel

  return new ToolLoopAgent({
    ...transformedSettings,
    model: finalModel
  })
}
```

注释里有一句很重要：`ToolLoopAgent` 会拿着 settings 跑完整个循环，不会在每一轮再走进插件管道。所以依赖 `transformParams` 的插件，要在这里通过 `transformAgentSettings` 先写进 settings。

## 记住这一点

agent 循环的「while」在 `ToolLoopAgent` 里。Cherry 的代码负责把模型和工具准备好，交给它。

## 先不要展开的目录

- `node_modules/ai` 里 `ToolLoopAgent` 的实现。先记住它会看工具调用并继续，就够用。
- `createAgent` 的测试 `packages/aiCore/src/core/agents/__tests__/createAgent.test.ts`。想确认某个插件有没有进 settings 时再打开。
