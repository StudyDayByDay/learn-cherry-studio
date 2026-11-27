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

预计 15 分钟。

## 这一坐要看懂什么

`MessageList` 是列表编排：虚拟滚动、向上翻历史、多选、搜索、把每一行交给分组组件。它从 Provider 取 `state / actions / meta`，自己不发请求。

输入框不在这个目录。消息目录的 README 写明了它不拥有 composer、导航和侧栏。

## 先打开哪个文件

`src/renderer/components/chat/messages/MessageList.tsx` 里组件开头那几十行。文件后半是滚动和导出，这一坐跳过。

## 关键代码

```tsx
// agent/cherry-studio/src/renderer/components/chat/messages/MessageList.tsx
const MessageList = ({ enableSearch = false, scrollPositionKey }: MessageListProps) => {
  const data = useMessageListData()
  const actions = useMessageListActions()
  const meta = useMessageListMeta()
  const partsByMessageId = usePartsMap()
  const { topic, messages, hasOlder = false, messageNavigation } = data
  // ...
}
```

列表行的虚拟滚动在同目录的 `list/MessageVirtualList.tsx`。长对话靠它只挂载可见行。

## 记住这一点

打开 `MessageList.tsx` 时，先看它从哪些 hook 取数据。数据从哪来是适配器的事，下一课的 Home 适配器会接上。

## 先不要展开的目录

- 同文件 200 行之后的滚动恢复、导出图片、多选框。
- `list/` 里除了 `MessageVirtualList.tsx` 以外的选区和锚点。
