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

预计 12 分钟。

## 这一坐要看懂什么

有些工具在执行前要人点允许。这件事有两端。主进程发出「要审批了」的事件，渲染进程的 hook 根据工具 part 的状态画出按钮。

AI SDK 里工具 part 自己带 `state`。界面 hook 的注释写明：MCP 和 Claude Agent 的工具在这一层不再各写一套，由桥决定怎么把用户的选择送回去。

## 先打开哪个文件

两个都很短，按这个顺序：

1. `src/main/ai/types/approval.ts`
2. `src/renderer/components/chat/messages/tools/hooks/useToolApproval.ts` 的文件头

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/types/approval.ts
export interface ApprovalRequestedEvent {
  topicId: string
  approvalId: string
  requestedAt: number
}
```

```ts
// agent/cherry-studio/src/renderer/components/chat/messages/tools/hooks/useToolApproval.ts
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

`approvalId` 把主进程里的那一次请求和界面上的那张卡片对上。`topicId` 保证批准不会串到别的话题。

## 记住这一点

审批是工具执行前的一道门。门的界面状态跟着 `ToolUIPart.state` 走，门的身份是 `approvalId`。

## 先不要展开的目录

- `src/main/ai/toolApproval/`，尤其是 `commandPolicy/`。那是哪些命令算危险，这一坐不读策略表。
- `tools/shared/ToolApprovalOutcome.tsx`。它只是批准结果的展示。
