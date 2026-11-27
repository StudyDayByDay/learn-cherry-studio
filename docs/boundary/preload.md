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

预计 15 分钟。

## 这一坐要看懂什么

渲染进程是网页，主进程是 Node。网页不能直接读密钥、开数据库或持有模型连接。preload 在中间暴露一个很小的桥：`request` 发一次调用，`on` 订一种事件。具体有哪些路由，不写死在这个文件里。

## 先打开哪个文件

`src/preload/ipc.ts`。全文不到 50 行，可以读完。

## 关键代码

```ts
// agent/cherry-studio/src/preload/ipc.ts
export const ipcApi = {
  request: (route: string, input?: unknown, meta?: unknown): Promise<unknown> =>
    ipcRenderer.invoke(IpcChannel.IpcApi_Request, route, input, meta),

  on: (event: string, callback: (payload: unknown) => void): (() => void) => {
    // 所有事件共用 IpcApi_Event，再用事件名分发
  }
}
```

文件头写着：加一条请求或一种事件，这里零改动。类型化的封装在 `src/renderer/ipc`，这一层只做搬运。

渲染进程里你会看到 `window.api` 或对 IPC 的封装。顺着 `ipcApi.request` 就能回到主进程的路由表，这一坐先停在桥上。

## 记住这一点

界面发消息，走的是 `invoke`。模型往外吐字，走的是主进程向这个窗口 `send` 事件。下一课就是发送的那一端。

## 先不要展开的目录

- `src/preload` 里的 webview、小程序桥、标注控制器。
- `src/shared/ipc` 的全部 schema。需要某条路由的参数类型时再搜路由名。
