---
title: 工具在界面上
prev:
  text: 内容块
  link: /ui/blocks
next:
  text: 流式文字
  link: /ui/stream
---

# 工具在界面上

模型调用了网页搜索，气泡里应该出现一张搜索卡片，而不是把 JSON 糊在正文后面。选哪张卡片是纯界面逻辑。搜索请求早就在主进程里发出去了，这里拿到的是结果。

## 按名字挑卡片

`chooseTool` 接收工具响应，看 `toolName`：

```tsx
if (toolName.startsWith('builtin_')) {
  const suffix = toolName.slice('builtin_'.length)
  switch (suffix) {
    case 'web_search':
    case 'web_search_preview':
      return <MessageWebSearchToolTitle toolResponse={toolResponse} />
    case 'knowledge_search':
      return <MessageKnowledgeSearchToolTitle toolResponse={toolResponse} />
    default:
      return null
  }
}
```

`builtin_web_search` 去掉前缀后是 `web_search`，渲染搜索标题卡。知识库搜索同理。画图在 `tools/painting`，MCP 工具常常带 `mcp__` 前缀，走 `tools/mcp` 或更通用的时间线卡片 `AgentExecutionTimeline`。

这是一张分发表，和 React Router 的路由表类似：名字决定组件，组件再读 `toolResponse` 里的参数和输出。找不到专用卡片时返回 `null` 或退回通用卡片，列表不会因此崩溃。

卡片上的「允许执行」也是界面。按钮把用户的选择送回主进程，真正跑工具的仍是主进程。那道门在后面的审批课。这里只要看出：展示和执行是分开的。

## 和正文的关系

工具卡片和正文是相邻的 parts。搜索卡片在上，总结文字在下，因为模型先调用工具，再根据结果写 `text` part。界面不重新排序，只按数组顺序画。

## 接下来

正文还在增长时，列表怎样避免把历史消息全部重画，看 [流式文字](/ui/stream)。

源码：`messages/tools/chooseTool.tsx`，各张卡片在 `tools/webSearch`、`tools/knowledge`、`tools/mcp`。
