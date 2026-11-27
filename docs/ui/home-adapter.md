---
title: 11 页面把对象填满
prev:
  text: 10 只有活消息在变
  link: /ui/stream
next:
  text: 12 一问一答和订阅
  link: /boundary/preload
---

# 11 页面把对象填满

> 这一课只加一件事：页面负责把上一课的对象填上，列表仍然不抓数据。

## 问题

列表已经不写 `isHome`。那首页的删除、重新生成、助手头像从哪来？如果列表自己发请求，Agent 页就会被首页的接口拖住。

## 最小做法

页面用一个函数，把已经查到的数据翻译成列表要的对象。

```tsx
function useHomeList(topic: Topic, messages: Message[]): MessageListValue {
  const write = useChatWrite()
  return {
    state: {
      messages,
      liveIds: messages.filter((message) => message.streaming).map((message) => message.id)
    },
    actions: {
      loadOlder: () => write.loadOlder(topic.id),
      regenerate: (id) => write.regenerate(id)
    },
    meta: {
      assistantName: topic.assistant.name,
      exportFileName: topic.name
    }
  }
}
```

调用方先按 `topic.id` 把消息查出来，再传进来。适配器不再发「把消息查出来」的请求。它做的是改名和接线。

Agent 页可以复用同一个列表，只是不传 `regenerate`。按钮于是不出现。两个页面的差别停在这个函数里。

## 在 Cherry Studio 里

首页的函数叫 `useHomeMessageListProviderValue`。参数里有 `messages`、`partsByMessageId`、`streamingLayers`、`loadOlder`。返回 `{ state, actions, meta }`。助手头像和导出文件名在 `meta`。文件很长，因为按钮多。形状就是上面这个函数。

## 接下来

界面这条线到这里接上了。下一课离开 React，看网页怎样把一句话送进主进程：[12 一问一答和订阅](/boundary/preload)。
