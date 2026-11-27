---
title: 主进程里的循环
prev:
  text: createAgent
  link: /model/create-agent
next:
  text: 一个小工具
  link: /model/one-tool
---

# 主进程里的循环

`createAgent` 不知道当前是哪个话题，也不知道工具执行前要不要人点允许。这些是产品规则，放在主进程的 `Agent` 类里。这个类把规则收成 `agentSettings`，然后调用上一课的函数。

## 交给 createAgent 的那一份

```ts
return createAgent({
  providerId: params.providerId,
  providerSettings: params.providerSettings,
  modelId: params.modelId,
  plugins: params.plugins,
  wrapModel: params.wrapModel,
  agentSettings: {
    ...settings,
    tools: toolsWithHooks,
    instructions: params.system,
    stopWhen: opts.stopWhen,
    experimental_repairToolCall: opts.repairToolCall,
    prepareStep
  }
})
```

`settings` 里是温度、topP、最大输出长度、请求头。这些是一次生成的采样参数。`instructions` 是系统提示，SDK 的 agent 用这个字段，不叫 `system`。`stopWhen` 决定循环什么时候停，例如达到步数上限，避免工具来回调用停不下来。

`toolsWithHooks` 是业务工具加上执行期钩子。工具真正 `execute` 的前后可以记日志、接审批。工具的名字和参数 schema 没变，包了一层。

`prepareStep` 在每一轮模型调用之前跑。它查看即将送出的消息，把工具结果里的图片、音频整理成当前模型能接受的形状。有的模型能看图，有的只能看文字。这一步在循环的每一轮都发生，和插件的 `transformParams` 不同：后者默认只在创建 agent 时走一遍。

## 还有一条只跑一步的路

当上下文的主人是调用方自己（`contextOwner === 'caller'`）时，这个类不建 `ToolLoopAgent`。它 `createExecutor` 之后直接 `streamText`，并且 `stopWhen: stepCountIs(1)`。模型最多产出一步。调用方要自己把工具结果拼回历史再来一次。普通会搜网页、会连续调用工具的聊天，走上面的 `createAgent`。

`generate` 方法在此之上再分 `'generate' | 'stream'`。流式时还可以传 `onTextDelta`，在整段结束之前就把文本增量交出去。窗口路径不依赖这个回调，它消费的是调度台转出去的 chunk。这个回调给的是「不经过聊天气泡、但也想边生成边拿字」的内部调用。

## 接下来

工具在 `toolsWithHooks` 里被循环调用。看一个具体的工具长什么样：[一个小工具](/model/one-tool)。

源码：`src/main/ai/runtime/aiSdk/Agent.ts` 的 `buildExecution`。
