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

预计 12 分钟。

## 这一坐要看懂什么

消息目录的 README 提到 `stream/`，当前仓库里没有这个目录。流式显示靠两件事：列表 state 里的 `streamingLayers` 把正在生成的消息和历史 parts 分开；某个 text part 的 `state === 'streaming'` 时，正文块按未完成的文本来画。

## 先打开哪个文件

`src/renderer/components/chat/messages/types.ts` 里的 `MessageStreamingLayers`。然后在 `MessagePartsRenderer.tsx` 里搜 `state === 'streaming'`。

## 关键代码

```ts
// agent/cherry-studio/src/renderer/components/chat/messages/types.ts
export interface MessageStreamingLayers {
  historyPartsByMessageId: MessagePartRows
  liveMessageIds: readonly string[]
}
```

渲染器里，流式中的正文和推理部分会带着这个状态往下传。增量文本从哪来，这一课不追。下一组课会看到主进程把 `text-delta` 推回窗口。

## 记住这一点

界面不拼接模型的原始字节流。它渲染的是已经按消息 id 放好的 parts。流式只是其中一些 part 还没写完。

## 先不要展开的目录

- `blocks/livePartRanges.ts`。它处理流式过程中相邻块怎么合并，算法很密。
- `src/renderer/services/aiTransport`。那是渲染进程接收投影更新的服务，等 IPC 课之后再打开。
