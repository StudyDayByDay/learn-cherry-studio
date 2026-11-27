---
title: 一个小工具
prev:
  text: 主进程里的循环
  link: /model/main-agent
next:
  text: 上下文快满了
  link: /model/context
---

# 一个小工具

预计 15 分钟。

## 这一坐要看懂什么

工具是给模型的一个函数：一段说明、一份参数 schema、一次执行。模型按说明决定要不要调用。执行发生在主进程。结果写回消息的工具 part，界面课里的卡片再把它画出来。

联网搜索是一个够小、又完整的例子。核心函数在 `webLookup.ts`，注释写明它同时被 AI SDK 内置工具和 Claude Code 的桥使用。两套运行时只是格式不同，查找逻辑这一份。

## 先打开哪个文件

`src/main/ai/tools/webLookup.ts` 的文件头、描述常量和错误形状。先不要追 `WebSearchService`。

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/tools/webLookup.ts
export const WEB_SEARCH_DESCRIPTION =
  'Search the web for current or uncertain facts. Retry in the likely source language; cite with [cite:id].'

export const webLookupErrorSchema = z.object({
  error: z.string(),
  retryable: z.boolean().optional(),
  terminal: z.literal(true).optional()
})
```

失败不抛异常，而是返回 `{ error }`。这样模型能分清「搜了但没有结果」和「搜索本身失败了」。取消信号是例外，取消要继续抛出去。

描述字符串会进工具定义，模型读的是它。schema 同时约束参数和错误。执行函数向用户配置的搜索服务发请求，再把结果收成工具输出。

界面那一侧，`chooseTool.tsx` 看到 `web_search` 就渲染 `MessageWebSearchToolTitle`。名字对得上，链就合拢了。

## 记住这一点

一个工具三件套：给模型看的 description、zod schema、主进程里的 execute。展示卡片是第四件，而且在渲染进程。

## 先不要展开的目录

- `src/main/services/webSearch`。各家搜索引擎的适配。
- `tools/computerUse.ts`、`tools/automationRepl.ts`。它们权限和界面都更重。
