---
title: 27 执行前先问一句
prev:
  text: 26 只追加几个字
  link: /runtime/text-delta
next:
  text: 28 子任务是一条关系
  link: /runtime/subagent
---

# 27 执行前先问一句

> 这一课只加一件事：危险工具先在气泡里等一个允许，允许带一个 id 回去，循环才执行。

## 问题

搜索网页可以直接跑。删除文件不应该。如果每种工具各写一套确认框，MCP 和本地工具的按钮会各长各的。

## 最小做法

执行前看一眼策略。要问人，就发出一个 id，然后停下。界面按这个 id 把选择送回来。

```ts
type Approval = { topicId: string; approvalId: string }

async function runMaybe(topicId: string, tool: Tool, input: unknown) {
  if (!tool.dangerous) return tool.run(input)
  const approvalId = crypto.randomUUID()
  publish({ type: 'approval', topicId, approvalId })
  const answer = await waitFor(approvalId)
  if (answer === 'cancel') return { error: 'cancelled', retryable: false }
  return tool.run(input)
}
```

`topicId` 保证按钮画在当前话题。`approvalId` 把这次等待和这次调用对上。界面不需要第二套状态机，工具块上已经有「正在等、正在执行」。按钮只是 `confirm(approvalId)` 或 `cancel(approvalId)`。

哪些命令算危险，是一张策略表。这一课不展开那张表。门的形状就是：先问，再跑。

## 在 Cherry Studio 里

事件类型是 `ApprovalRequestedEvent`，字段就是 `topicId`、`approvalId`、`requestedAt`。界面 hook 的状态是 `isWaiting`、`isExecuting`、`isSubmitting`，从工具 part 的 `state` 推出来。策略在 `src/main/ai/toolApproval/`。

## 接下来

一个工具还可以再开一段独立对话。[28 子任务是一条关系](/runtime/subagent) 不把子对话塞进父气泡。
