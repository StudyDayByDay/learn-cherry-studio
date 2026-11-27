---
title: 16 边出字和一次拿全
prev:
  text: 15 消息是一组块
  link: /model/ui-message
next:
  text: 17 调用点和厂商分开
  link: /model/why-aicore
---

# 16 边出字和一次拿全

> 这一课只加一件事：聊天用流，不需要边看边出的调用用一次拿全。参数几乎一样。

## 问题

给话题起标题只要六个字，没有人盯着它逐个蹦出来。如果标题也走聊天那条流，就要为它接听众、处理半截字符串。聊天如果等整段结束再画，用户会以为卡住了。

## 最小做法

两个函数，参数相同，返回不同。

```ts
type Ask = {
  model: string
  messages: { role: string; content: string }[]
}

async function streamText(ask: Ask, onDelta: (text: string) => void) {
  const res = await fetch(modelUrl, { body: JSON.stringify(ask) })
  for await (const delta of readSse(res)) onDelta(delta)
}

async function generateText(ask: Ask) {
  let text = ''
  await streamText(ask, (delta) => {
    text += delta
  })
  return text
}
```

聊天把 `onDelta` 接到课 14 的 `publish`。标题写 `const title = await generateText(...)`。

真实 SDK 里 `generateText` 不是用 `streamText` 拼出来的，但用法就是这样：一个边吐边交，一个等结束。Cherry 没有重写它们，执行器在插件跑完后调用 SDK 原函数。

## 在 Cherry Studio 里

函数名就是 `streamText` 和 `generateText`，从 `ai` 包引进来。执行器里写成 `_streamText`，表示这是原函数。主进程的 `Agent.generate` 用 `'generate' | 'stream'` 在两种模式间切换。用户看得见的聊天走 stream。

## 接下来

如果每个页面自己 import 这两函数，厂商差异会漏进组件。[17 调用点和厂商分开](/model/why-aicore) 中间加一层。
