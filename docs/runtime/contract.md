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

预计 15 分钟。

## 这一坐要看懂什么

聊天循环是 `aiCore` 加上主进程的 `Agent`。编码 agent 还有另一条路：Pi、Claude Code 这些外部运行时自己有循环和工具。Cherry 要把它们的事件收成同一种观察结果，界面才不用为每家写一套气泡。

`packages/agent-runtime` 就是这套契约。README 写明它不依赖 Pi、Claude SDK 或 Electron，也不负责真正去跑 agent。它规定：线程是什么、怎么提交输入、怎么观察标准化的事实、怎么中断。

## 先打开哪个文件

`packages/agent-runtime/README.md` 的前两段，然后 `packages/agent-runtime/src/contracts.ts` 里的 `Thread` 和 `RuntimeMessage`。

## 关键代码

```ts
// agent/cherry-studio/packages/agent-runtime/src/contracts.ts
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

`Thread` 是某个后端里的稳定会话。`RuntimeMessage` 仍然是 AI SDK 的 `UIMessage`，所以界面课学的 parts 在这里继续有效。

包里十来个源文件，都是类型、观察流和不可变更新。没有窗口，没有数据库。

## 记住这一点

`aiCore` 负责「我们自己把模型跑起来」。`agent-runtime` 负责「不管谁跑，观察结果长成同一张脸」。

## 先不要展开的目录

- `contracts.ts` 后半的上下文占用分类。那是 token 统计的形状。
- `packages/agent-runtime-pi*` 和 `agent-runtime-claude-code`。最后一课再认它们是适配器。
