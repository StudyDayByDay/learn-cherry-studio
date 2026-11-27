---
title: 02 两个进程
prev:
  text: 01 怎么读
  link: /start/how-to-read
next:
  text: 03 一句话的旅程
  link: /map/one-message
---

# 02 两个进程

> 这一课只加一件事：画界面的进程，和拿着密钥调模型的进程，是分开的。

## 问题

普通网页里，React 可以 `fetch` 自己的后端。桌面应用如果也让 React 直接请求 OpenAI，API Key 会打进前端包，打开开发者工具就能看见。读本地文件、开子进程，也不该由网页随意做。

## 最小做法

同一台电脑上跑两个程序。窗口里是网页，后面是 Node。网页只能喊两个函数：

```ts
// 网页里能用的全部能力
const bridge = {
  ask(route: string, input: unknown) {
    return node.invoke(route, input) // 一问一答
  },
  listen(event: string, onData: (data: unknown) => void) {
    return node.subscribe(event, onData) // 持续推送
  }
}

// 密钥只活在 Node 里
node.handle('chat.send', async ({ text, apiKey }) => {
  return fetch(modelUrl, { headers: { Authorization: apiKey }, body: text })
})
```

网页传入的是「用户说了什么」和「选了哪个模型」。`apiKey` 出现在 Node 的处理函数里，不出现在 React 组件里。

## 在 Cherry Studio 里

窗口是渲染进程，`src/renderer` 里的 React。Node 是主进程，`src/main`。中间的桥叫 preload，下一组课会把 `ask` 和 `listen` 写成真实的 `request` 和 `on`。模型包在 `packages/`，由主进程引用。根目录 `package.json` 的 `"main"` 指向主进程入口，应用从那里启动，再打开窗口。

## 接下来

[03 一句话的旅程](/map/one-message) 用一句问天气，把这两个进程之间的来回走完。
