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

助手的一条回复在数据上不是一个字符串。它是按顺序排好的 parts。渲染器顺着这个数组走，每种类型找自己的组件。中间不再转成另一套 block 对象。

## 一条回复长什么样

「今天北京天气怎么样」如果模型先想了想、又搜了网页、再回答，parts 会像这样：

```ts
[
  { type: 'reasoning', text: '需要实时天气，先搜索。', state: 'done' },
  { type: 'tool-web_search', state: 'output-available', input: { query: '北京天气' }, output: { /* 结果 */ } },
  { type: 'text', text: '今天北京多云，12°C。', state: 'done' }
]
```

类型名来自 Vercel AI SDK 的 `UIMessage`。`text` 是正文，`reasoning` 是思考，工具 part 带着调用参数和结果。界面课先把它们当成可渲染的块，协议细节在后面的模型课。

## 分发

`MessagePartsRenderer` 的文件头写了分组规则：连续的图片合成一行，连续的工具调用放进 `ToolBlockGroup`，同一路径的视频合成一块。单个 part 再按类型进叶子组件。正文这一支是：

```tsx
case 'text': {
  return (
    <MainTextBlock
      key={partId}
      id={partId}
      content={part.text || ''}
      livePart={isStreaming && message.role === 'assistant' ? part : undefined}
      isStreaming={isStreaming}
    />
  )
}
```

`content` 是当前已经拿到的全文，不是单个 token。流式的时候这段字符串变长，`isStreaming` 为真，`MainTextBlock` 用 `livePart` 知道这块还没写完，可以显示光标或先不解析未闭合的 Markdown。

思考进 `ThinkingBlock`，一组工具进 `ToolBlockGroup`，出错进 `ErrorBlock`。新增一种 part，就是在这个分发里加一个分支，再写一个叶子组件。

这个文件有两千多行，因为分组、引用、折叠都在里面。主线只需要记住：顺序来自数组，外观来自 `type`。

## 接下来

工具 part 进了 `ToolBlockGroup` 之后，还要按工具名选卡片。[工具在界面上](/ui/tools) 就是这张分发表。

源码：`blocks/MessagePartsRenderer.tsx` 的 `case 'text'`，叶子组件在同目录的 `MainTextBlock.tsx`、`ThinkingBlock.tsx`、`ToolBlockGroup.tsx`。
