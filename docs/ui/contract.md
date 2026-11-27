---
title: 列表契约
prev:
  text: 一个 Tab 一份路由
  link: /ui/router
next:
  text: MessageList 画什么
  link: /ui/message-list
---

# 列表契约

首页、Agent 会话、历史记录都要画聊天气泡。如果每个页面复制一套列表，流式更新和虚拟滚动会修三遍。Cherry 把列表做成共享组件，页面只交一个对象进去。

## 三块，没有页面开关

这个对象的形状是固定的：

```ts
export interface MessageListProviderValue {
  state: MessageListState
  actions: MessageListActions
  meta: MessageListMeta
}
```

`state` 是画得出来的数据。一条话题、消息数组、每条消息的 parts。`actions` 是用户能做的事，比如向上加载更早的消息、删除、重新生成。某个页面没有删除，就不要传 `deleteMessage`，按钮自己不出现。组件内部不写 `if (isHome)`。

`meta` 是环境信息，不改变消息本身。助手头像、导出图片时用的文件名，放在这里。

和流式有关的字段在 `state` 里：

```ts
export interface MessageListState {
  topic: Topic
  messages: MessageListItem[]
  partsByMessageId: MessagePartRows
  streamingLayers?: MessageStreamingLayers
}

export interface MessageStreamingLayers {
  historyPartsByMessageId: MessagePartRows
  liveMessageIds: readonly string[]
}
```

`messages` 是有哪些气泡。`partsByMessageId` 是每个气泡里面的块：正文、思考、工具卡片。历史 parts 和「正在生成的那几条消息 id」分开，打字时只更新活着的那几条，不用把上面几十条历史消息的子树全部重渲染。

想象这一轮回复的 id 是 `m2`：

```text
historyPartsByMessageId: { m1: [已经写完的正文] }
liveMessageIds: ['m2']
```

`m2` 的正文还在变。`m1` 的 React 节点保持不动。

## 页面只负责填这个对象

共享组件从 Context 读这三块。首页有一个适配器把它填满，Agent 页有另一个。两边的按钮集合可以不同，列表组件是同一份。后面会看到首页适配器怎么填。

## 接下来

列表拿到这份数据之后画什么、不画什么，看 [MessageList 画什么](/ui/message-list)。

源码：`src/renderer/components/chat/messages/types.ts` 里的这三个接口。
