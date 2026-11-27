---
title: 流推回窗口
prev:
  text: preload 与 IPC
  link: /boundary/preload
next:
  text: AiStreamManager
  link: /boundary/stream-manager
---

# 流推回窗口

模型一个 token 一个 token地吐。如果每个 token 都做一次 IPC，窗口会被消息淹没，React 也会跟着抖。推给界面的听众先把十几个毫秒里的增量粘在一起，再发。

## 一个窗口、一个话题、一个听众

```ts
const COALESCE_WINDOW_MS = 16

export class WebContentsListener implements StreamListener {
  constructor(
    private readonly wc: Electron.WebContents,
    private readonly topicId: string
  ) {
    this.id = `wc:${wc.id}:${topicId}`
  }

  private emit<E extends IpcEventName>(event: E, payload: EventPayload<E>): void {
    this.wc.send(IpcChannel.IpcApi_Event, event, payload)
  }
}
```

`WebContents` 是 Electron 里「这个窗口的网页」。`id` 写成 `wc:窗口号:话题号`，所以同一个话题在两个窗口打开时，各有一个听众，互不影响。id 以 `wc:` 开头的才是给界面的。写数据库、打追踪是别的听众，它们不走这条 `send`。

`emit` 用的频道和 preload 里 `on` 听的是同一个 `IpcApi_Event`。事件名是 `ai.stream.chunk`，载荷里有 `topicId` 和这一小段 chunk。渲染进程的订阅者按话题过滤，只把属于当前页的增量合进消息。

## 16 毫秒里粘住什么

文本增量的类型是 `text-delta`，思考是 `reasoning-delta`，工具参数还在生成时是 `tool-input-delta`。同一类、同一块上的增量可以拼成一条更长的字符串。窗口关了，`wc.isDestroyed()` 为真，未发出的缓冲丢掉，不再 `send`。

16 毫秒大约是一帧。人眼看到的仍是连续出字，IPC 次数少了一个数量级。

## 接下来

谁创建这个听众、谁在流结束时写数据库，是调度台 [AiStreamManager](/boundary/stream-manager)。

源码：`src/main/ai/streamManager/listeners/WebContentsListener.ts`。
