---
title: AiStreamManager
prev:
  text: 流推回窗口
  link: /boundary/webcontents
next:
  text: UIMessage 与 parts
  link: /model/ui-message
---

# AiStreamManager

预计 15 分钟。

## 这一坐要看懂什么

`AiStreamManager` 是一次对话流的调度台。它记录这轮还在不在跑、把增量交给各个听众、在结束时落库。它不选择厂商，也不写工具循环。模型循环在 `runtime/aiSdk/Agent.ts`，由调度台启动。

目录 `streamManager/` 可以当成一张表来认，不用读完。

| 文件 | 职责 |
| --- | --- |
| `AiStreamManager.ts` | 调度台本体 |
| `listeners/WebContentsListener.ts` | 推给窗口 |
| `listeners/PersistenceListener.ts` | 把回复写进存储 |
| `context/PersistentChatContextProvider.ts` | 普通聊天的上下文从哪来 |
| `context/AgentChatContextProvider.ts` | Agent 会话的上下文从哪来 |
| `api/startAgentSessionRun.ts` | 启动一次 agent 会话运行 |

## 先打开哪个文件

`src/main/ai/streamManager/index.ts`，看它导出了谁。然后打开 `AiStreamManager.ts` 只读前 40 行的 import，确认它依赖投影、失败分类和消息服务，而不是直接 `fetch` 某个模型 API。

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/streamManager/index.ts
export { AiStreamManager } from './AiStreamManager'
export { WebContentsListener } from './listeners/WebContentsListener'
export { PersistenceListener } from './listeners/PersistenceListener'
export { startAgentSessionRun } from './api/startAgentSessionRun'
```

`AiStreamManager.ts` 有两千多行。这一坐把它当成「谁在听、这轮流何时结束」的服务。跟模型参数有关的代码在下一组课。

## 记住这一点

调度台搬的是 `UIMessageChunk` 和投影更新。厂商差异在它启动的 Agent 里面已经被抹平。

## 先不要展开的目录

- `persistence/` 和 `context/` 的测试。
- `pipeStreamLoop.ts`。那是把 SDK 流接到听众的管道，等你读完 `Agent.ts` 再回来。
