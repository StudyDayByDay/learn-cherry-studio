---
title: 和 Electron 无关的契约
prev:
  text: 上下文快满了
  link: /model/context
next:
  text: 文本增量
  link: /runtime/text-delta
---

# 和 Electron 无关的契约

普通聊天的循环是 Cherry 自己用 `ToolLoopAgent` 跑的。编码助手是另一条路：Pi 或 Claude Code 自己拥有循环、工具和上下文压缩。窗口不能为每家写一套气泡。两边都要变成「一条 `UIMessage`，里面是 parts」。

`packages/agent-runtime` 规定这张脸。它不启动模型，也不知道 Electron。

## 线程和消息

```ts
export interface Thread {
  readonly backendId: BackendId
  readonly id: ThreadId
}

export type RuntimeMessage = UIMessage<{
  completeness: Completeness
  inputId?: InputId
  error?: RuntimeError
}>
```

`Thread` 是某个后端里的一次会话。`backendId` 区分这是 Pi 还是 Claude。`id` 在那个后端内部稳定。产品里的「话题 id」可以另外存，不要求等于这个原生 id。重启之后靠产品自己的表把两者对上。

`RuntimeMessage` 仍是 `UIMessage`。所以界面课学的 `text`、`reasoning`、工具 part，在这条路上继续有效。额外的元数据只有三样：完整度、这次输入的 id、消息级错误。完整度是 `partial` 时，界面可以把它当成还在流。

包里还有提交输入、中断、观察快照这些操作的类型。它们描述「能对一条线程做什么」，不包含「怎样去调一家厂商的 HTTP」。具体的 Pi 适配器实现这些操作，把原生事件翻译成契约里的事实。

这个包大约十个源文件，都是类型和观察流。读它的时候不会遇到窗口、数据库或 React。

## 和 aiCore 的分工

`aiCore` 回答：我们自己怎样把模型和工具循环跑起来。

`agent-runtime` 回答：别人已经跑起来了，我们怎样观察它，并得到同样的消息。

两条路在 `MessageList` 汇合。列表只认 parts。

## 接下来

原生事件通常是一小段增量，不是整条消息替换。契约怎样表示「往第 3 块上追加几个字」，看 [文本增量](/runtime/text-delta)。

源码：`packages/agent-runtime/README.md` 开头，以及 `src/contracts.ts` 的 `Thread` 与 `RuntimeMessage`。
