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

预计 10 分钟。认门，不往下读。

## 这一坐要看懂什么

知识库把文件、网址和笔记变成可搜索的资料。流水线是：接入来源，转成 Markdown，切块并做向量，写进每个库自己的 `index.sqlite`。agent 通过 `kb_search`、`kb_read`、`kb_tree`、`kb_manage` 这些工具去用它。

界面卡片在 `messages/tools/knowledge/`。工具实现的入口可以先记 `src/main/ai/tools/knowledgeLookup.ts`，真正的入库和查询在功能目录里。

## 先打开哪个文件

`src/main/features/knowledge/README.md` 的 Pipeline 图和目录表。读完 README 就停。

## 关键代码

README 里的阶段顺序：

```text
sources  ->  readers  ->  indexing  ->  vectorstore
接入来源     转成文本      切块嵌入       index.sqlite
```

`KnowledgeService.ts` 是生命周期门面。`query/` 负责把检索结果交回给工具。`pipeline/` 自己不负责把任务推进队列。

## 记住这一点

知识库是「先建索引，再当成工具被模型调用」。它不在 `streamText` 的主路径上，除非这轮对话真的选了库。

## 先不要展开的目录

- `src/main/features/knowledge/pipeline/` 的具体 reader。PDF、Word 的解析是一条独立技术线。
- 向量库的 sqlite 实现。要改检索质量时再进 `vectorstore/`。
