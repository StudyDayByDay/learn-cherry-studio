---
title: 05 列表只收一个对象
prev:
  text: 04 标签不丢状态
  link: /ui/router
next:
  text: 06 列表不负责发送
  link: /ui/message-list
---

# 05 列表只收一个对象

> 这一课只加一件事：列表不知道自己在哪个页面，它只渲染一份 state、actions、meta。

## 问题

首页有删除和重新生成，Agent 会话没有。如果列表里写 `if (isHome)`，每加一个页面就加一个分支，流式更新也会复制一份。

## 最小做法

页面把数据装进一个对象。组件只读这个对象。某个按钮没有，就不要传那个函数。

```tsx
type MessageListValue = {
  state: {
    messages: { id: string; parts: Part[] }[]
    liveIds: string[]
  }
  actions: {
    loadOlder?: () => void
    regenerate?: (id: string) => void
  }
  meta: {
    assistantName?: string
  }
}

function MessageList() {
  const { state, actions } = useContext(MessageListContext)
  return state.messages.map((message) => (
    <Bubble
      key={message.id}
      parts={message.parts}
      onRegenerate={actions.regenerate && (() => actions.regenerate!(message.id))}
    />
  ))
}
```

`onRegenerate` 没有函数时，气泡不画那个按钮。组件里没有页面名字。

`liveIds` 把「还在写的消息」和历史分开。历史那几条的引用不变，打字时不必把上面几十条一起重渲染。这个字段下一课还会用到，这里先看见它在 state 里。

## 在 Cherry Studio 里

这个对象叫 `MessageListProviderValue`，三块名字就是 `state`、`actions`、`meta`。正在写的消息放在 `streamingLayers.liveMessageIds`。首页和 Agent 页各有一个适配器来填它，列表组件只有一份。

## 接下来

[06 列表不负责发送](/ui/message-list) 说明这个组件拿到对象之后做什么，以及输入框为什么不在里面。
