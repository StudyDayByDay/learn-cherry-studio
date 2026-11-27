---
title: MessageList 画什么
prev:
  text: 列表契约
  link: /ui/contract
next:
  text: 消息骨架
  link: /ui/frame
---

# MessageList 画什么

`MessageList` 是滚动容器，不是聊天空。它从上一课的 Context 取出数据，决定哪些行挂载、滚到哪、多选时画框。它不调用模型，也没有输入框。

## 它一进来就做的事

组件开头只做取数：

```tsx
const MessageList = ({ enableSearch = false, scrollPositionKey }: MessageListProps) => {
  const data = useMessageListData()
  const actions = useMessageListActions()
  const meta = useMessageListMeta()
  const partsByMessageId = usePartsMap()
  const { topic, messages, hasOlder = false, messageNavigation } = data
  // ...
}
```

`data` 就是 `state`。`messages` 是行，`hasOlder` 决定滚到顶时还要不要再要一页历史。`actions.loadOlder` 由页面提供，列表滚到顶就调用它。`partsByMessageId` 另走一份 Context，因为 parts 更新很频繁，和头像、选中态拆开，避免整表一起变。

长对话不能把一万行都挂到 DOM 上。同目录的 `MessageVirtualList` 只挂载视口附近的行，滚出屏幕的行卸掉，高度用估算值撑住滚动条。这是前端里常见的虚拟列表，这里用在消息上。

`enableSearch` 和 `scrollPositionKey` 是列表自己的开关：要不要搜索框，滚动位置记在哪个 key 下。话题内容不从 props 钻进来，仍从 Context 来。这样首页和 Agent 页可以写 `<MessageList />`，差异留在适配器里。

## 输入框在旁边

消息目录明确不管输入框、顶栏和侧栏。输入框是聊天布局里的兄弟节点。两边对齐靠布局 Context 里的右侧留白：列表量出操作栏有多宽，输入框让出同样的宽度。发送逻辑在输入框里，成功之后新消息出现在 `messages` 里，列表才看得到。

## 接下来

每一行里面，头像、正文、底部按钮怎样拼，是 [消息骨架](/ui/frame)。

源码：`src/renderer/components/chat/messages/MessageList.tsx` 开头，虚拟列表在 `list/MessageVirtualList.tsx`。
