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

预计 15 分钟。

## 这一坐要看懂什么

首页、Agent 会话、历史记录共用同一套消息组件。页面差异通过一个对象注入，组件内部只读这个对象。形状固定为三块：`state` 是可渲染的数据，`actions` 是按钮能做的事，`meta` 是头像、导出文件名这类环境信息。

## 先打开哪个文件

`src/renderer/components/chat/messages/README.md`，然后看 `types.ts` 里这三个接口。

## 关键代码

```ts
// agent/cherry-studio/src/renderer/components/chat/messages/types.ts
export interface MessageListProviderValue {
  state: MessageListState
  actions: MessageListActions
  meta: MessageListMeta
}
```

`state` 里和主线相关的字段：

```ts
export interface MessageListState {
  topic: Topic
  messages: MessageListItem[]
  partsByMessageId: MessagePartRows
  streamingLayers?: MessageStreamingLayers
  // ...
}

export interface MessageStreamingLayers {
  historyPartsByMessageId: MessagePartRows
  liveMessageIds: readonly string[]
}
```

历史 parts 和正在流式的消息 id 分开。这样打字时不用把整段历史消息树重新渲染一遍。

## 记住这一点

共享组件里没有 `isHome`、`isAgent` 这种页面开关。某个按钮在这个页面不存在，就表现为 `actions` 里的那个函数缺失。

## 先不要展开的目录

- `types.ts` 剩下的四百多行。需要某个按钮时再搜函数名。
- `utils/` 下的分组、选区、诊断。它们服务列表行为，不服务模型协议。
