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

预计 12 分钟。

## 这一坐要看懂什么

一个 agent 可以再开一个子任务，子任务有自己的线程。契约里这不是另一套消息类型，而是一条关系：谁是父线程，子线程在不在，这次关系是哪一次工具调用创建的。

子 agent 的 id 在父线程范围内稳定。子任务后来又继续跑，这条关系的 id 不变，创建它的 `toolCallId` 也不被覆盖。

## 先打开哪个文件

`packages/agent-runtime/src/contracts.ts` 里的 `Subagent`。README 里 “Subagent” 那一段可以用同一段话对照。

## 关键代码

```ts
// agent/cherry-studio/packages/agent-runtime/src/contracts.ts
export interface Subagent {
  readonly id: SubagentId
  readonly parent: Thread
  readonly child?: Thread
  readonly origin?: { readonly toolCallId: string; readonly description?: string }
}
```

`child` 可以缺省。关系已经观察到了，但子上下文还打不开时，就只有父线程和 id。界面上的子任务卡片读取的是这条关系加上子线程自己的消息，不是把子任务的正文塞进父消息的同一个 part 里。

## 记住这一点

子 agent 是「父线程上的一条关系」，再指向可选的子线程。创建它的工具调用 id 留在 `origin` 里。

## 先不要展开的目录

- `packages/agent-runtime/src/nestedTool.ts`。嵌套工具的观察细节。
- 渲染进程 `blocks/SubagentStatusContext.tsx`。那是状态怎么进 React，关系本身以上面的类型为准。
