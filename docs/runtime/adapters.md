---
title: Pi 与 Claude Code
prev:
  text: 子 agent
  link: /runtime/subagent
next:
  text: MCP
  link: /later/mcp
---

# Pi 与 Claude Code

到这里，仓库里有两套「谁来跑循环」。分清它们，后面看到 `runtime/pi` 或 `runtime/claudeCode` 才不会以为又是一份 `ToolLoopAgent`。

## 我们跑，和他们跑

普通聊天：主进程 `Agent` 调用 `createAgent`，循环是 AI SDK 的 `ToolLoopAgent`。工具实现在 `src/main/ai/tools`。上下文压缩在 `aiCore`。

编码助手：Pi 或 Claude Code 进程自己拥有循环、工具和压缩。Cherry 的包只做翻译。Pi 的说明写着：调用方提供模型，Pi 拥有执行循环、工具、上下文记账和压缩。Claude Code 的说明写着：`createClaudeCodeRuntime` 把 Claude Agent SDK 适配到同一份契约。打开和观察不会立刻跑模型，第一次提交输入才开始。

| 包 | 角色 |
| --- | --- |
| `agent-runtime` | 契约。线程、消息、增量、子 agent |
| `agent-runtime-pi` | 把 Pi 会话收成契约 |
| `agent-runtime-pi-durable` | 可恢复的 Pi 会话，重启后还能对上输入 |
| `agent-runtime-claude-code` | 把 Claude Agent SDK 收成契约 |
| `agent-runtime-acp` | 另一条代理协议的适配 |

这些包的 README 都声明自己不含 Electron，也不含产品数据库。桌面端在 `src/main/ai/runtime/pi` 和 `runtime/claudeCode` 里把它们接到窗口和存储上。那一层相当于普通聊天里的 `Agent.ts`：产品外壳，不是循环本身。

观察结果回到 `RuntimeMessage` 和 part 编辑，所以 `MessageList` 不用知道背后是哪一家。父会话里的子任务，就是上一课的 `Subagent` 关系。

学「循环怎么写」时停留在 `createAgent`。学「怎样接入一个已经会跑的 agent」时读适配器的 README，再按你正在用的那一家打开 `runtime.ts`。

## 接下来

主线到这里可以停。后面四页是认门：MCP、知识库、语音、定时。每页把能力放回这条链上，不展开实现。先看 [MCP](/later/mcp)。

源码：`packages/agent-runtime-pi/README.md` 与 `packages/agent-runtime-claude-code/README.md` 的开头。
