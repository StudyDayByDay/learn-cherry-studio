---
title: 内容块
prev:
  text: 消息骨架
  link: /ui/frame
next:
  text: 工具在界面上
  link: /ui/tools
---

# 内容块

预计 15 分钟。

## 这一坐要看懂什么

一条助手消息在数据上是一组 part，按顺序渲染。`MessagePartsRenderer` 按 `part.type` 分发：正文、推理、图片、视频、工具、错误、压缩标记各走各的组件。它不做「先转成另一种 block 再画」的中间层。

## 先打开哪个文件

`src/renderer/components/chat/messages/blocks/MessagePartsRenderer.tsx` 开头的注释，以及 `case 'text'` 那一支。文件有两千多行，用类型名搜索，不要从头读。

## 关键代码

文件头说明了分组规则：连续的图片合成一行，连续的工具调用合成 `ToolBlockGroup`，视频按同一文件路径合并。

正文这一支落到 `MainTextBlock`：

```tsx
// agent/cherry-studio/src/renderer/components/chat/messages/blocks/MessagePartsRenderer.tsx
case 'text': {
  return (
    <MainTextBlock
      key={partId}
      id={partId}
      // ...
    />
  )
}
```

同目录里和主线有关的叶子：`MainTextBlock.tsx`（正文）、`ThinkingBlock.tsx`（推理）、`ToolBlockGroup.tsx`（工具组）、`ErrorBlock.tsx`（错误）。

## 记住这一点

界面上的「一条回复」是 part 数组。模型多吐出一种 part，这里就多一个 `case`。

## 先不要展开的目录

- `blocks/` 里的翻译、时间线、导入状态、会话分叉。它们是产品块。
- `MessagePartsRenderer.tsx` 里布局合并的细节。`livePartRanges.ts` 只在你要改流式分组时再读。
