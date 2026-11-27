---
title: 上下文快满了
prev:
  text: 一个小工具
  link: /model/one-tool
next:
  text: 和 Electron 无关的契约
  link: /runtime/contract
---

# 上下文快满了

模型能读的历史有上限。聊了几十轮，再把全部网页搜索结果塞回去，请求会被拒绝，或者默默丢掉前面的内容。压缩做的事是：把较早的消息收成一段摘要，留下最近几轮原文，然后继续。

## 压缩的是发给模型的那一份

```ts
export async function compactModelMessages(
  messages: ModelMessage[],
  model: LanguageModel,
  options: PlanCompactionOptions & SummarizeMessagesOptions
): Promise<ModelMessage[]> {
  const ir = fromModelMessages(messages)
  const result = await compactHistory(ir, createCompressionAdapter(model, maxOutputTokens), compactOptions)
  return result === ir ? messages : toModelMessages(result)
}
```

参数和返回值都是 `ModelMessage[]`，也就是上一课说的「即将发给模型的历史」，不是窗口上那份带折叠状态的 `UIMessage`。窗口里的旧气泡可以还在，用户往上翻仍看得到。变短的是下一次请求带上的副本。

`compactHistory` 先决定保留尾巴的哪几轮，再请一个模型把丢掉的部分写成摘要。摘要被插成一条 `user` 消息，这是 Claude Code 的习惯。尾巴如果也以 user 开头，数组里会连续两条 user。AI SDK 的各家适配器会自己处理：Anthropic 把同角色合并，OpenAI 接受这种排列。注释把这件事写明了，避免你看到两条 user 以为是 bug。

没有东西需要压时，`compactHistory` 返回原来的内部表示。函数就返回当初传进来的数组引用。调用方用 `result === messages` 判断要不要写数据库。引用没变，就跳过一次落库。

界面上对应的是 `CompactBlock`。它只标记「上面的历史被摘要过」。摘要的正文在发给模型的那条消息里，不一定原样铺在气泡上。

主进程的流调度另有一个 `context/compaction.ts`，决定这一轮聊天线要不要调用上面的函数。算法在 `aiCore`，时机在调度台。这一课把位置认清即可，截断、卸载的邻近文件可以以后再读。

## 接下来

普通聊天的循环到这里就闭合了。编码助手不走这套 `ToolLoopAgent`，它们有自己的循环。Cherry 用一份契约把它们收成同样的消息：[和 Electron 无关的契约](/runtime/contract)。

源码：`packages/aiCore/src/core/context/compaction.ts` 的 `compactModelMessages`。
