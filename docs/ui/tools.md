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

预计 15 分钟。

## 这一坐要看懂什么

工具调用先被收成一组，再按工具名选一张卡片。搜索、知识库、画图、MCP、向用户提问，卡片不同，数据都来自同一种工具响应。

## 先打开哪个文件

`src/renderer/components/chat/messages/tools/chooseTool.tsx`。它是分发函数，每个具体卡片在子目录里。

## 关键代码

```tsx
// agent/cherry-studio/src/renderer/components/chat/messages/tools/chooseTool.tsx
if (toolName.startsWith(builtinToolsPrefix)) {
  const suffix = toolName.slice(builtinToolsPrefix.length)
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

带 `mcp__` 前缀或走 agent 时间线的工具，会进 `AgentExecutionTimeline`。卡片目录可以按名字认：`tools/webSearch`、`tools/knowledge`、`tools/mcp`、`tools/painting`。

## 记住这一点

这里只决定「画哪张卡片」。工具真正执行发生在主进程。界面拿到的是已经发生过的调用和结果。

## 先不要展开的目录

- `tools/agent/` 下面的各种 result 格式化。那是编码 agent 的展示细节。
- `tools/automation/`。电脑操作和 REPL 的卡片，产品能力课再认门。
