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

预计 15 分钟。

## 这一坐要看懂什么

仓库里有两套「谁来跑循环」。

普通聊天：主进程 `Agent` 调用 `aiCore` 的 `createAgent`，循环是 AI SDK 的 `ToolLoopAgent`。

编码助手：Pi 或 Claude Code 自己拥有循环、工具和上下文压缩。Cherry 的对应包只做适配，把它们的事件收成上一课的契约。适配器包的 README 都写了自己不含 Electron，也不含产品数据库。

| 包 | 接到哪 |
| --- | --- |
| `packages/agent-runtime` | 契约，不跑模型 |
| `packages/agent-runtime-pi` | Pi 会话 |
| `packages/agent-runtime-pi-durable` | 可恢复的 Pi 会话 |
| `packages/agent-runtime-claude-code` | Claude Agent SDK |
| `packages/agent-runtime-acp` | ACP 这一路的接入 |

桌面端在 `src/main/ai/runtime/pi` 和 `src/main/ai/runtime/claudeCode` 把这些包接到窗口和数据库上。那一层又是产品外壳，和 `runtime/aiSdk/Agent.ts` 是并列的外壳。

## 先打开哪个文件

两个 README 的开头各读一屏：

- `packages/agent-runtime-pi/README.md`
- `packages/agent-runtime-claude-code/README.md`

## 关键代码

Pi 的 README 写明：调用方提供模型，Pi 拥有执行循环、工具、上下文记账和压缩。

Claude Code 的 README 写明：`createClaudeCodeRuntime` 把 Claude Agent SDK 适配到同一份契约。一个 runtime 拥有一个配置好的后端。打开和观察不会立刻跑模型，第一次提交输入才开始。

两边观察结果都回到 `RuntimeMessage` 和 part 编辑。所以消息列表不用知道现在背后是 Pi 还是 Claude。

## 记住这一点

学「模型循环怎么写」时看 `createAgent` 和 `ToolLoopAgent`。学「别人的 agent 怎么接进同一个界面」时看这些适配器，而且先只读 README。

## 先不要展开的目录

- 任何一个 `agent-runtime-*` 的 `runtime.ts`。它们很长，认门之后按你在用的那一家再读。
- `src/main/ai/runtime/fork`。会话分叉是产品行为。
