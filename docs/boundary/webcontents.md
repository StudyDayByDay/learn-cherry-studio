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

预计 15 分钟。

## 这一坐要看懂什么

主进程里可以同时有好几种流的听众：写数据库的、打追踪的、推给窗口的。推给窗口的那个叫 `WebContentsListener`。一个话题、一个窗口，一个实例。它把模型的小增量先合并大约 16 毫秒，再发给这个窗口，避免每个 token 都打一次 IPC。

## 先打开哪个文件

`src/main/ai/streamManager/listeners/WebContentsListener.ts`。先看类声明和 `emit`，再看文件顶部的三个常量。

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/streamManager/listeners/WebContentsListener.ts
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

文本增量会先收成 `text-delta`，和推理增量、工具参数增量一起排队。真正过桥的事件名是 `ai.stream.chunk`。渲染进程用上一课的 `on` 接住它。

## 记住这一点

听众 id 以 `wc:` 开头的，才是窗口。持久化和追踪是别的 listener，它们不负责画字。

## 先不要展开的目录

- 同文件后半的合并细节，除非你在查「字跳得太碎或太顿」。
- `listeners/` 里的 `PersistenceListener.ts`、`TraceFlushListener.ts`、`SseListener.ts`。知道它们是并列听众即可。
