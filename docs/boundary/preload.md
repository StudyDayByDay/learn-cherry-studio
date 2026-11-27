---
title: 12 一问一答和订阅
prev:
  text: 11 页面把对象填满
  link: /ui/home-adapter
next:
  text: 13 十毫秒粘一次
  link: /boundary/webcontents
---

# 12 一问一答和订阅

> 这一课只加一件事：过桥只有两种方向。发送用一次调用，出字用订阅。

## 问题

模型要好几秒，中间不断出字。如果发送的那个 Promise 要等整段回答才 resolve，气泡会一直空着。如果每个字都是一次新的请求，又没有「这一轮」的概念。

## 最小做法

桥上两个函数就够。所有订阅共用一条通道，再用事件名分发。

```ts
const listeners = new Map<string, Set<(data: unknown) => void>>()

export const ipc = {
  request(route: string, input: unknown) {
    return ipcRenderer.invoke('request', route, input)
  },
  on(event: string, callback: (data: unknown) => void) {
    const set = listeners.get(event) ?? new Set()
    set.add(callback)
    listeners.set(event, set)
    ipcRenderer.on('event', (_e, name, data) => {
      if (name === event) callback(data)
    })
    return () => set.delete(callback)
  }
}

// 发送：Promise 只表示「主进程答应开始了」
await ipc.request('chat.send', { topicId, text })

// 出字：持续进来
ipc.on('ai.stream.chunk', (chunk) => appendToLiveMessage(chunk))
```

组件卸载时调用 `on` 返回的函数，避免窗口关了还在改 state。

发送和出字是两条路。把它们塞进同一个 Promise，界面就没法边收边画。

## 在 Cherry Studio 里

`src/preload/ipc.ts` 就是这两个函数，名字是 `request` 和 `on`。所有事件共用 `IpcApi_Event`，由一个 `dispatch` 按名字转发。新增一种请求不用改这个文件，路由名写在共享 schema 里。

## 接下来

一个字一次 `send` 会把窗口打满。[13 十毫秒粘一次](/boundary/webcontents) 在主进程里把增量粘起来。
