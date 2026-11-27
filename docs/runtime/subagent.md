---
title: 28 子任务是一条关系
prev:
  text: 27 执行前先问一句
  link: /runtime/approval
next:
  text: 29 两套循环
  link: /runtime/adapters
---

# 28 子任务是一条关系

> 这一课只加一件事：子任务是父线程上的一条记录，指向可选的子线程。子线程自己仍是一组普通消息。

## 问题

父会话调用工具，工具再开一段对话去干子任务。如果把子任务的正文全部塞进父气泡的一个 part，课 08 的数组会糊掉，子任务继续跑时父消息还要整段替换。

## 最小做法

父消息里只留创建它的那次工具调用。关系单独记。

```ts
type Subagent = {
  id: string
  parentId: string
  childId?: string
  originToolCallId: string
}

function onChildText(sub: Subagent, text: string) {
  if (!sub.childId) return
  appendText(sub.childId, text) // 写在子线程上，不写进父消息
}
```

`id` 在父线程里稳定。子任务后来又跑了一轮，这个 id 不变，`originToolCallId` 也不改。`childId` 可以先空着：关系已经有了，子上下文还打不开。父气泡上的工具卡片用 `originToolCallId` 挂一个「打开子会话」。点进去看到的是另一串课 15 的消息。

更新时只推这一条关系，不把父线程的全部消息重发。这和课 26 只追加几个字是同一个原则。

## 在 Cherry Studio 里

类型就叫 `Subagent`，字段是 `id`、`parent`、`child?`、`origin.toolCallId`。快照里带当前的关系列表，单条变化用 upsert。

## 接下来

谁把 Pi、Claude Code 收成这些消息和关系？[29 两套循环](/runtime/adapters) 把两条路并排看完。
