---
title: 29 两套循环
prev:
  text: 28 子任务是一条关系
  link: /runtime/subagent
next:
  text: 30 工具可以来自外部进程
  link: /later/mcp
---

# 29 两套循环

> 这一课只加一件事：看清谁在跑循环。普通聊天是我们跑的，编码助手是它们跑的，气泡是同一套。

## 问题

仓库里既有 `createAgent`，又有 Pi 和 Claude Code。如果把它们看成三份循环实现，会在错误的文件里找 `while`。

## 最小做法

两条路，最后都变成 `parts`。

```text
普通聊天
  主进程准备系统提示和工具
  ToolLoopAgent 执行「有工具就继续」
  片段交给调度台

编码助手
  Pi 或 Claude Code 自己执行循环和压缩
  适配器把原生事件收成 open / append / finish 和子任务关系
  同一套气泡把 parts 画出来
```

适配器不做的事，和它做的事一样重要：它不打开窗口，不写产品数据库，也不决定危险命令要不要问人。那些仍是课 22 和课 27 的产品外壳。

所以学「循环怎么写」时停留在课 21。学「怎样接入一个已经会跑的 agent」时，读适配器怎样实现课 25 的观察接口。

## 在 Cherry Studio 里

| 包 | 做哪一段 |
| --- | --- |
| `agent-runtime` | 课 25 的类型 |
| `agent-runtime-pi` | Pi 的事件收成类型 |
| `agent-runtime-pi-durable` | 重启后还能对上一次输入 |
| `agent-runtime-claude-code` | Claude Agent SDK 收成类型 |
| `agent-runtime-acp` | 另一条协议 |

桌面端在 `src/main/ai/runtime/pi` 和 `runtime/claudeCode` 把这些包接到窗口。那一层相当于普通聊天的 `Agent.ts`。

## 接下来

主线可以在这里停。后面四课各自只认一件事，不展开实现。先看外部工具：[30 工具可以来自外部进程](/later/mcp)。
