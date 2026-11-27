---
title: 知识库
prev:
  text: MCP
  link: /later/mcp
next:
  text: 语音
  link: /later/voice
---

# 知识库

知识库不是另一套聊天。它是一批提前处理好的资料。模型通过工具去查，查到的片段再写进工具 part，和网页搜索同一条回路。

## 先索引，再被调用

资料进库的顺序是：

```text
sources  ->  readers  ->  indexing  ->  vectorstore
接入来源     转成文本      切块并嵌入     每个库一个 index.sqlite
```

文件、目录、网址、笔记先变成 Markdown。再切成块，算出向量，写进这个库自己的 SQLite。查询时同时走向量和关键词，把相关块找回来。

这些阶段在入库时发生，不在用户按发送的那一瞬间现做。`pipeline/` 只负责变换。把任务放进队列、更新每条资料的状态，是 `ingestion/` 和 `tasks/` 的事。`KnowledgeService.ts` 是门面：启动时恢复任务，对外的方法都从这里进。

模型侧的工具是 `kb_search`、`kb_read`、`kb_tree`、`kb_manage`。搜索返回片段，阅读按 id 取原文，树是目录，管理用来删除或刷新。界面卡片在 `messages/tools/knowledge/`。没有选中任何库时，这些工具不会出现在这一轮的工具列表里，普通闲聊不付索引的成本。

## 接下来

语音是聊天旁边的输入输出，不改变消息 parts 的主路径。[语音](/later/voice) 说明它在主进程的哪一层。

源码：`src/main/features/knowledge/README.md`。工具入口可以记 `src/main/ai/tools/knowledgeLookup.ts`。
