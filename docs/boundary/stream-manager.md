---
title: 14 调度台不生成文字
prev:
  text: 13 十毫秒粘一次
  link: /boundary/webcontents
next:
  text: 15 消息是一组块
  link: /model/ui-message
---

# 14 调度台不生成文字

> 这一课只加一件事：一轮对话有一个发布者。它把片段交给听众，自己不调用模型。

## 问题

一次聊天同时要做三件事：把字推给窗口、写进数据库、记下用量。如果这三件都写在「调用模型」的函数里，换一种存储就要改模型代码。如果写在 React 里，数据库逻辑就进了界面。

## 最小做法

模型侧只生产片段。调度台把它交给所有听众。

```ts
type Chunk = { topicId: string; text: string; done?: boolean }

type Listener = {
  onChunk(chunk: Chunk): void
  onDone(topicId: string): void
}

class StreamDesk {
  private listeners: Listener[] = []

  attach(listener: Listener) {
    this.listeners.push(listener)
  }

  publish(chunk: Chunk) {
    for (const listener of this.listeners) listener.onChunk(chunk)
    if (chunk.done) for (const listener of this.listeners) listener.onDone(chunk.topicId)
  }
}
```

窗口推送是一个听众，落库是另一个。模型函数只调用 `publish`。它不知道窗口和数据库的存在。

调度台还要记住这轮是在跑、暂停了，还是已经结束。那是状态，不是生成。

## 在 Cherry Studio 里

这个发布者叫 `AiStreamManager`。窗口听众是上一课的 `WebContentsListener`，落库是 `PersistenceListener`。普通聊天和 Agent 会话用不同的上下文提供者去取历史，调度台不关心消息存在哪张表。文件很长，因为暂停和错误也在里面。职责就是 `publish`。

## 接下来

听众收到的片段，在数据上是什么形状？[15 消息是一组块](/model/ui-message) 给它一个名字。
