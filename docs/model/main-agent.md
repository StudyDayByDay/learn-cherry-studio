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

预计 18 分钟。

## 这一坐要看懂什么

`packages/aiCore` 不知道话题、数据库和窗口。主进程的 `Agent` 类补上这些：温度和停止条件、工具执行前后的钩子、把图片类工具结果路由成模型能看的内容，然后调用 `createAgent`。文件头写着：AI SDK 的执行和流的生命周期。

同目录还有一条更窄的路。当 `contextOwner === 'caller'` 时，它不建 `ToolLoopAgent`，而是 `createExecutor` 后直接 `streamText`，并且 `stopWhen: stepCountIs(1)`，只跑一步。那是调用方自己管上下文的场景。普通会调工具的聊天走 `createAgent`。

## 先打开哪个文件

`src/main/ai/runtime/aiSdk/Agent.ts`。先读 import 和 `buildExecution` 末尾的 `return createAgent`。文件大约 500 行，钩子组装可以第二遍再看。

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/runtime/aiSdk/Agent.ts
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
    prepareStep
  }
})
```

`prepareStep` 在每一轮模型调用前改消息，例如处理工具结果里的媒体。`toolsWithHooks` 是原工具加上执行期钩子，用来记日志、做审批衔接。系统提示在这里叫 `instructions`。

## 记住这一点

读到 `createAgent` 的那个 return，这条产品循环就接到了上一课。再往上是 `AiStreamManager` 何时 new 这个 Agent，再往下是 SDK 的 `ToolLoopAgent`。

## 先不要展开的目录

- `runtime/aiSdk/loop/` 里的终止条件和钩子包装。出了「工具失败却停不下来」再进。
- `runtime/aiSdk/retry/`。换 key、换模型重试是产品策略，循环本身不依赖你先读懂它。
