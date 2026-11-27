---
title: preload 与 IPC
prev:
  text: Home 适配器
  link: /ui/home-adapter
next:
  text: 流推回窗口
  link: /boundary/webcontents
---

# preload 与 IPC

React 里发请求，你习惯 `fetch('/api/chat')`。在 Electron 里，窗口和主进程不是 HTTP 的两端，它们用 IPC。preload 把这条通道收成两个函数，页面只碰这两个函数。

## 一条桥，两种方向

`src/preload/ipc.ts` 全文不到五十行：

```ts
const subscribers = new Map<string, Set<(payload: unknown) => void>>()
let listening = false

function dispatch(_e: IpcRendererEvent, name: string, payload: unknown) {
  for (const callback of [...(subscribers.get(name) ?? [])]) callback(payload)
}

export const ipcApi = {
  request: (route: string, input?: unknown, meta?: unknown): Promise<unknown> =>
    ipcRenderer.invoke(IpcChannel.IpcApi_Request, route, input, meta),

  on: (event: string, callback: (payload: unknown) => void): (() => void) => {
    if (!listening) {
      ipcRenderer.on(IpcChannel.IpcApi_Event, dispatch)
      listening = true
    }
    const callbacks = subscribers.get(event) ?? new Set()
    subscribers.set(event, callbacks)
    const subscription = (payload: unknown) => callback(payload)
    callbacks.add(subscription)
    return () => {
      callbacks.delete(subscription)
      if (callbacks.size === 0 && subscribers.get(event) === callbacks) subscribers.delete(event)
    }
  }
}
```

`request` 是一问一答。渲染进程 `invoke`，主进程处理完 `return`，Promise 才结束。适合「把这条用户消息交出去」「把设置存上」。它不适合模型逐字回复，因为回复要等几秒，而且中间有很多片段。

`on` 是订阅。所有事件共用一个 Electron 频道 `IpcApi_Event`，再用事件名分发。页面写 `on('ai.stream.chunk', handler)`，这个名字下的回调集合就多一个。返回的函数用来取消订阅，组件卸载时调用，避免窗口关了还在 setState。

只监听一次 Electron 的 `on`，是因为同一个 `ipcRenderer` 上挂太多同名监听器会触发 MaxListeners 警告。业务上的多个订阅者放在 Map 里，由 `dispatch` 自己转发。

文件头写着：新增一种请求或一种事件，这个文件不用改。路由名和参数类型在共享的 schema 里。渲染进程另外有一层带类型的封装，把 `unknown` 收成具体类型。preload 只负责过桥。

## 和发送的关系

输入框发送时走 `request`，主进程答应「这轮已经开始」。随后的文字不走这个 Promise 的返回值，而走 `on` 收到的一串 `ai.stream.chunk`。下一课就是主进程里发出这些 chunk 的类。

## 接下来

[流推回窗口](/boundary/webcontents) 看主进程怎样把 token 合并后再 `send` 给这个窗口。

源码：`src/preload/ipc.ts`。类型化的调用封装在 `src/renderer/ipc`。
