---
title: 流式文字
prev:
  text: 工具在界面上
  link: /ui/tools
next:
  text: Home 适配器
  link: /ui/home-adapter
---

# 流式文字

消息目录的说明里写过一个 `stream/` 文件夹。当前代码里没有这个目录。流式显示不靠单独的一套组件，靠两处已有的数据。

## 历史和正在写的消息分开

列表 state 里：

```ts
export interface MessageStreamingLayers {
  historyPartsByMessageId: MessagePartRows
  liveMessageIds: readonly string[]
}
```

已经结束的消息放在 `historyPartsByMessageId`。这一轮还在吐字的消息 id 放在 `liveMessageIds`。React 更新时，历史那一层的引用可以保持不变，只有活着的消息收到新 parts。长对话里上面几十条气泡因此不用跟着每个 token 重渲染。

## 一块正文自己的状态

单个 part 也有状态。流式中的正文是：

```ts
{ type: 'text', text: '今天北京', state: 'streaming' }
```

渲染器把 `isStreaming` 和这个 part 交给 `MainTextBlock`。下一个增量到达后，`text` 变成 `'今天北京多云'`，组件用新字符串再画。结束后 `state` 变成完成，光标消失，Markdown 按完整文本解析。

所以界面并不拼接原始的字节流。主进程把增量合成「到目前为止的 part」，再推给窗口。渲染进程渲染的是一份越来越长的文本，外加一个还没写完的标记。增量怎样跨过进程，是后面 IPC 课的内容。现在只要把「逐字出现」理解成：活消息的 text part 在变长。

## 接下来

这些 state 是谁填进列表的？首页的填法在 [Home 适配器](/ui/home-adapter)。

源码：`messages/types.ts` 的 `MessageStreamingLayers`，以及 `MessagePartsRenderer` 里把 `isStreaming` 传给 `MainTextBlock` 的那一支。
