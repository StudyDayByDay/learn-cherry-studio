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

模型不会自己上网。它只能在回复里说「我要调用名为 web_search 的工具，参数是这句话」。主进程里必须有一份同名实现：读参数，发出请求，把结果写成工具 part。网页搜索足够小，又能把这三件套看全。

## 给模型看的说明

```ts
export const WEB_SEARCH_DESCRIPTION =
  'Search the web for current or uncertain facts. Retry in the likely source language; cite with [cite:id].'
```

这段字符串进工具定义的 `description`。模型靠它决定「天气这种实时问题该不该搜」。写得含糊，模型就会少调用或者乱调用。参数用 zod 描述，SDK 会把它变成 JSON Schema 发给模型。模型返回的参数若对不上 schema，调用在执行前就失败。

失败也不要抛成一个让循环崩溃的异常。搜索挂了和「搜了但没有结果」必须能区分：

```ts
export const webLookupErrorSchema = z.object({
  error: z.string(),
  retryable: z.boolean().optional(),
  terminal: z.literal(true).optional()
})
```

成功返回结果数组。失败返回 `{ error, retryable }`。`retryable` 告诉模型这是网络抖动，可以再试一次。配置里根本没有搜索引擎时，错误是永久性的，说明文字会要求模型告诉用户去设置里补，而不是无限重试。用户取消是例外，取消要继续把异常抛出去，循环才停得下来。

同一份查找函数被两条运行时使用：AI SDK 的内置工具，以及 Claude Code 那条桥。两边的差别只是参数包装，查网页的逻辑在 `webLookup.ts`。

## 结果怎样回到气泡

执行完，SDK 把输出放进工具 part 的 `output`，`state` 变成 `output-available`。调度台把这个 part 推给窗口。界面课的 `chooseTool` 看到 `web_search`，画出搜索卡片。卡片读的就是这份 `output`。

四件事因此连在一起：description 给模型看，zod 约束参数，主进程函数执行，渲染进程按名字画卡片。缺了执行，卡片永远在加载。缺了卡片，用户只能看见一段 JSON。

## 接下来

对话变长以后，这些工具结果也会把上下文撑满。[上下文快满了](/model/context) 说明发出去之前会先压缩。

源码：`src/main/ai/tools/webLookup.ts`。界面卡片在 `messages/tools/chooseTool.tsx`。
