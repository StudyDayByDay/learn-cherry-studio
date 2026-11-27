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

预计 12 分钟。这一课只认门。

## 这一坐要看懂什么

模型能读的历史有长度上限。对话变长以后，Cherry 会把较早的消息压成一段摘要，留下最近几轮原文，再继续请求。这件事叫 compaction。实现放在 `packages/aiCore/src/core/context/`，主进程的流调度也会在自己的 `context/compaction.ts` 里决定这一轮要不要压。

界面上对应的块是 `blocks/CompactBlock.tsx` 和 `CompactionAnchorBlock.tsx`。用户能看见「这里曾经压缩过」，压缩算法不必在这一坐读完。

## 先打开哪个文件

`packages/aiCore/src/core/context/compaction.ts` 里 `compactModelMessages` 的签名和它上面的注释。

## 关键代码

```ts
// agent/cherry-studio/packages/aiCore/src/core/context/compaction.ts
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

输入输出都是 `ModelMessage[]`，也就是发给模型的那一份，不是界面上的 `UIMessage`。摘要被插成一条 `user` 消息。注释说明这是 Claude Code 的风格，后面的 provider 层会自己处理连续两条 user。

没有变化时函数返回原来的数组引用，调用方可以用 `result === messages` 决定要不要落库。

## 记住这一点

上下文压缩发生在「发给模型之前」。界面只是事后把这个事实画出来。

## 先不要展开的目录

- `context/truncator.ts`、`offloader.ts`、`janitor.ts`。它们是压缩旁边的裁剪和卸载策略。
- `src/main/ai/streamManager/context/compaction.ts` 和它的测试。那是「这一轮聊天线要不要触发压缩」。
