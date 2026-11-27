---
title: 24 发出去之前先变短
prev:
  text: 23 工具是一份说明加一个函数
  link: /model/one-tool
next:
  text: 25 别人跑，我们观察
  link: /runtime/contract
---

# 24 发出去之前先变短

> 这一课只加一件事：上下文快满时，把较早的模型消息收成一段摘要，最近几轮保持原文。窗口上的旧气泡可以还在。

## 问题

课 15 说过，发给模型的历史和画在屏幕上的消息不是同一份。屏幕上可以无限往上翻。模型能读的长度有上限。把几十轮搜索结果全塞回去，请求会被拒绝。

## 最小做法

压缩函数吃的是模型消息，吐的也是模型消息。没有变化时返回原数组，调用方因此知道不用落库。

```ts
async function compact(messages: ModelMessage[], summarize: (old: ModelMessage[]) => Promise<string>) {
  if (tokenCount(messages) < LIMIT) return messages
  const head = messages.slice(0, -6)
  const tail = messages.slice(-6)
  const summary = await summarize(head)
  return [{ role: 'user', content: `Earlier conversation:\n${summary}` }, ...tail]
}
```

摘要被放成一条 user 消息。尾巴如果也以 user 开头，数组里会有连续两条 user。各家适配器会处理：有的把同角色合并，有的接受这种排列。窗口不读这份数组，所以用户仍能看见原来的气泡。界面上最多放一个标记：「上面的内容已摘要」。

什么时候调用 `compact`，是调度台的决定。算法在这里，时机在课 14 的发布者旁边。

## 在 Cherry Studio 里

函数名是 `compactModelMessages`。它把消息转成内部表示，调用 `compactHistory`，没有变化时用引用相等跳过落库。摘要风格和上面一样，是一条 user。界面块叫 `CompactBlock`。

## 接下来

到这里，自己跑的那条循环闭合了。编码助手自己有循环。下一课开始只观察它们：[25 别人跑，我们观察](/runtime/contract)。
