---
title: 31 先建索引再当工具查
prev:
  text: 30 工具可以来自外部进程
  link: /later/mcp
next:
  text: 32 语音只换出入口
  link: /later/voice
---

# 31 先建索引再当工具查

> 这一课只认一件事：知识库在发送之前就把资料切好、嵌入好。模型用工具去查，查到的片段再进工具块。

## 问题

把一整本 PDF 放进课 24 的上下文，一轮对话就满了。每次发送时现读 PDF，又太慢。

## 最小做法

入库和提问分开。

```text
入库：文件 → 文本 → 切块 → 向量 → 这个库自己的数据库
提问：模型调用 kb_search → 取出相关块 → 写进工具结果 → 模型据此回答
```

没选中任何库时，不要把 `kb_search` 放进这一轮的 `tools`。普通闲聊就不付查询的成本。界面卡片只是课 09 的又一行：名字是 `knowledge_search`，组件把片段画出来。

## 在 Cherry Studio 里

流水线在 `src/main/features/knowledge/`：来源、转文本、切块嵌入、每个库一个 `index.sqlite`。模型侧的工具是 `kb_search`、`kb_read`、`kb_tree`、`kb_manage`。门面是 `KnowledgeService.ts`。

## 接下来

语音不改变这条工具链。[32 语音只换出入口](/later/voice) 说明它停在输入和播放。
