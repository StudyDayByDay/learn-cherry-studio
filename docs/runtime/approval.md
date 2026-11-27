---
title: 工具审批认门
prev:
  text: 文本增量
  link: /runtime/text-delta
next:
  text: 子 agent
  link: /runtime/subagent
---

# 工具审批认门

搜索网页通常可以直接跑。删除文件、在电脑上执行命令，应该先在气泡里问一句。审批是工具 `execute` 之前的一道门。门有两端：主进程发出「要人决定」，界面画出按钮并把选择送回去。

## 主进程只给一个身份

```ts
export interface ApprovalRequestedEvent {
  topicId: string
  approvalId: string
  requestedAt: number
}
```

`topicId` 保证这个请求属于当前话题，不会画到另一个标签上。`approvalId` 是这一次等待的 id。用户点了允许，界面把这个 id 和选择一起送回，主进程才放行对应的那次工具调用。`requestedAt` 用来排序和超时。事件里没有工具参数全文，参数在工具 part 上，界面已经拿得到。

## 界面跟着 part 的状态走

```ts
export interface ToolApprovalState {
  isWaiting: boolean
  isExecuting: boolean
  isSubmitting: boolean
  input?: Record<string, unknown>
}

export interface ToolApprovalActions {
  confirm: () => void | Promise<void>
  cancel: () => void | Promise<void>
  autoApprove?: () => void | Promise<void>
}
```

hook 的注释写明：这些字段由 AI SDK 的 `ToolUIPart.state` 驱动。MCP 工具和 Claude 的工具在 hook 这一层不再各写一套。是等用户、正在执行，还是正在把选择提交回去，都从 part 状态推出来。`confirm` 和 `cancel` 是按钮。`autoApprove` 可选，给「这一类以后都允许」。

真正的危险命令表在 `src/main/ai/toolApproval/`。那是策略：哪些命令要问、哪些直接拒绝。这一课把链路接上即可。策略表很长，等你要改「什么操作必须问人」时再读。

## 接下来

一个 agent 还可以再开一个子任务。契约里这不是另一套消息，而是一条关系：[子 agent](/runtime/subagent)。

源码：`src/main/ai/types/approval.ts`，界面 hook 在 `messages/tools/hooks/useToolApproval.ts`。
