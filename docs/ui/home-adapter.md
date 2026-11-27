---
title: Home 适配器
prev:
  text: 流式文字
  link: /ui/stream
next:
  text: preload 与 IPC
  link: /boundary/preload
---

# Home 适配器

预计 15 分钟。

## 这一坐要看懂什么

共享列表不自己抓数据。首页用一个 hook 把话题、消息、parts、翻页和按钮收成 `MessageListProviderValue`，再交给 `MessageList`。Agent 会话有自己的适配器，形状相同，数据来源不同。

## 先打开哪个文件

`src/renderer/pages/home/messages/homeMessageListAdapter.tsx` 里的 `useHomeMessageListProviderValue`。只看函数签名和它返回对象的 `state` 字段，函数体后半是各种按钮。

## 关键代码

```tsx
// agent/cherry-studio/src/renderer/pages/home/messages/homeMessageListAdapter.tsx
export function useHomeMessageListProviderValue({
  topic,
  assistant,
  messages,
  partsByMessageId,
  streamingLayers,
  isInitialLoading = false,
  hasOlder = false,
  loadOlder
  // ...
}: HomeMessageListParams): MessageListProviderValue {
  // 返回 { state, actions, meta }
}
```

参数里的 `messages`、`partsByMessageId`、`streamingLayers` 就是列表契约里的那三样。适配器是页面数据和共享组件之间的边界。

## 记住这一点

换一个聊天页面时，优先找它的 adapter，而不是改 `MessageList.tsx`。

## 先不要展开的目录

- 这个文件 130 行之后的 mutation、翻译语言、图片操作。
- `src/renderer/pages/home` 的其他布局文件。
