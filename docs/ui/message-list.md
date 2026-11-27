---
title: 06 列表不负责发送
prev:
  text: 05 列表只收一个对象
  link: /ui/contract
next:
  text: 07 气泡先有框
  link: /ui/frame
---

# 06 列表不负责发送

> 这一课只加一件事：列表是滚动容器。发送在旁边的输入框里。

## 问题

一个聊天页容易长成一个巨大组件：输入、消息、侧栏、模型选择都在里面。流式更新一来，整个页面跟着渲染。发送失败和滚动位置也缠在一起。

## 最小做法

列表只从上下文取已经准备好的消息，并且只挂载看得到的行。

```tsx
function MessageList() {
  const { state, actions } = useMessageList()
  return (
    <VirtualList
      items={state.messages}
      hasOlder={state.hasOlder}
      onReachTop={actions.loadOlder}
      renderItem={(message) => <MessageFrame message={message} />}
    />
  )
}

function ChatPage() {
  return (
    <>
      <MessageList />
      <Composer onSend={sendToMain} />
    </>
  )
}
```

`VirtualList` 用估算高度撑住滚动条，屏幕外的行不创建 DOM。一万条历史也不会把窗口卡死。

`Composer` 是兄弟，不是列表的子组件。它调用 `sendToMain`。成功之后，新消息出现在 `state.messages` 里，列表才看得到。列表没有「发送」这个动作。

## 在 Cherry Studio 里

`MessageList` 开头就是 `useMessageListData()`、`useMessageListActions()`。虚拟列表在 `list/MessageVirtualList.tsx`。输入框在另一个目录，消息目录的说明写明它不管 composer。

## 接下来

一行里面，头像和正文怎样分开，是 [07 气泡先有框](/ui/frame)。
