---
title: 子 agent
prev:
  text: 工具审批认门
  link: /runtime/approval
next:
  text: Pi 与 Claude Code
  link: /runtime/adapters
---

# 子 agent

大任务常常被拆开。父会话调用一个工具，工具再启动一段独立的对话去干子任务。子任务有自己的消息列表。界面如果把子任务的正文全部塞进父气泡，父会话的 parts 会糊成一锅。契约用一条关系把两边连上。

## 关系，不是第二套消息

```ts
export interface Subagent {
  readonly id: SubagentId
  readonly parent: Thread
  readonly child?: Thread
  readonly origin?: { readonly toolCallId: string; readonly description?: string }
}
```

`id` 在父线程的观察范围内稳定。子任务后来又被继续跑了一轮，这条关系的 id 不变。`parent` 是谁发起的。`child` 是子线程，子上下文还打不开时可以没有它：关系已经存在，只是暂时不能跟着去读子消息。

`origin.toolCallId` 是父线程里创建这次关系的那次工具调用。后续的继续运行不改这个来源。界面因此可以在父消息的那张工具卡片上挂「打开子会话」，而子会话自己的正文仍是一串普通的 `RuntimeMessage`。

快照里会带上当前看到的 `subagents`。某条关系更新时，观察流发出一次 upsert，而不是把父线程的全部消息重发一遍。这和文本增量是同一个原则：只推变化。

## 接下来

谁把 Pi、Claude Code 的原生事件收成这些关系和消息？[Pi 与 Claude Code](/runtime/adapters) 说明它们是适配器，循环不在 Cherry 这边。

源码：`packages/agent-runtime/src/contracts.ts` 的 `Subagent`。
