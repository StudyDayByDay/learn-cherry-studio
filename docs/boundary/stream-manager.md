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

一次聊天在主进程里同时有好几件要做的事：问模型、把字推给窗口、写进数据库、记一笔用量。这些事如果都写在 React 里，或者都写在调用模型的那个函数里，任何一边改动都会扯到另一边。调度台把「这轮流的生命周期」单独拿出来。

## 它调度，不生成

`streamManager/index.ts` 导出的就是这些角色：

```ts
export { AiStreamManager } from './AiStreamManager'
export { WebContentsListener } from './listeners/WebContentsListener'
export { PersistenceListener } from './listeners/PersistenceListener'
export { startAgentSessionRun } from './api/startAgentSessionRun'
```

`AiStreamManager` 记住这一轮的状态：还在跑、暂停了、还是已经结束。模型吐出一个 chunk，它转给所有听众。

听众各干各的：

| 听众 | 收到 chunk 之后 |
| --- | --- |
| `WebContentsListener` | 合并后推给窗口 |
| `PersistenceListener` | 把助手消息写进存储 |
| 追踪听众 | 把这一轮交给观测系统 |

普通聊天的历史从 `PersistentChatContextProvider` 来。Agent 会话从 `AgentChatContextProvider` 来。两者都是「把数据库里的消息整理成这一轮要带上的上下文」。调度台不关心消息存在哪张表。

`startAgentSessionRun` 是启动一次 Agent 会话的入口。它仍然把运行登记到这个调度台，这样窗口和落库不用为 Agent 再写一套。

`AiStreamManager.ts` 有两千多行，因为暂停、重连、多模型、错误分类都在里面。读主线时把它当成一个发布者：上游是即将讲到的 `Agent`，下游是上面这些听众。它不选择 OpenAI 还是 Anthropic，也不执行工具。

## 接下来

窗口上看到的一块块内容，在协议里叫什么，从 [UIMessage 与 parts](/model/ui-message) 开始。这是从前端数据走进模型数据的一步。

源码：`src/main/ai/streamManager/`。调度台本体是 `AiStreamManager.ts`。
