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

共享列表不抓数据。首页用一个 hook，把话题、消息、按钮收成上一课的那个 `{ state, actions, meta }`，再交给 Provider。Agent 会话有自己的 hook，返回的形状相同，里面的按钮可以少一截。

## 页面数据从参数进来

```tsx
export function useHomeMessageListProviderValue({
  topic,
  assistant,
  messages,
  partsByMessageId,
  streamingLayers,
  isInitialLoading = false,
  hasOlder = false,
  loadOlder
}: HomeMessageListParams): MessageListProviderValue {
  // ...
  return useMemo(() => ({ state, actions, meta }), [actions, meta, state])
}
```

调用方已经按 `topic.id` 拿到了消息。适配器不再发一次「把消息查出来」的请求。它做的是翻译：把首页特有的能力装进 `actions`。

`meta` 用助手资料和话题名：

```tsx
const meta = useMemo<MessageListMeta>(
  () => ({
    selectionLayer: true,
    userProfile: headerCapabilities.userProfile,
    assistantProfile: assistant
      ? { name: assistant.name, avatar: assistant.avatarSrc ?? assistant.emoji }
      : undefined,
    assistantAvatarSources,
    imageExportFileName: topic.name
  }),
  [assistant, assistantAvatarSources, headerCapabilities.userProfile, topic.name]
)
```

导出图片时的文件名用话题标题。头像用助手的图片或 emoji。这些不影响消息正文，所以在 `meta`。

`actions` 里是首页允许的操作：向上翻页用参数里的 `loadOlder`，编辑、删除、换分支、重新生成，各自转到聊天写入接口。某个操作在捕获图片的模式下不该出现，适配器就传 `undefined`。列表看到没有这个函数，就不渲染按钮。

hook 有九百多行，因为首页按钮多。主线只看三件事：参数是页面数据，返回值是契约，按钮是函数而不是布尔开关。

## 接下来

界面这条线到这里接上了。下一课离开 React，看渲染进程怎样把请求送进主进程：[preload 与 IPC](/boundary/preload)。

源码：`src/renderer/pages/home/messages/homeMessageListAdapter.tsx` 的 `useHomeMessageListProviderValue`。
