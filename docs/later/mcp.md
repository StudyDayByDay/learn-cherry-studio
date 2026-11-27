---
title: MCP
prev:
  text: Pi 与 Claude Code
  link: /runtime/adapters
next:
  text: 知识库
  link: /later/knowledge
---

# MCP

预计 10 分钟。认门，不往下读。

## 这一坐要看懂什么

MCP 是一套让外部进程把自己的工具暴露给 agent 的协议。Cherry 作为客户端去连接这些服务器，把它们的工具并进模型能调用的工具列表。界面上，工具名常带 `mcp__` 前缀，卡片在 `messages/tools/mcp/`。

## 先打开哪个文件

`src/main/ai/mcp/McpRuntimeService.ts` 的 import 区。类本身有一千多行，这一坐看到它依赖 `@modelcontextprotocol/client` 即可。

## 关键代码

```ts
// agent/cherry-studio/src/main/ai/mcp/McpRuntimeService.ts
import {
  type CallToolResult,
  type Tool
} from '@modelcontextprotocol/client'
```

同目录的入口分工：

| 文件 | 做什么 |
| --- | --- |
| `McpRuntimeService.ts` | 连接、调用、运行状态 |
| `McpCatalogService.ts` | 有哪些服务器 |
| `createMcpBridgeServer.ts` | 把内部能力也桥成 MCP |
| `servers/` | 随应用带上的服务器，例如文件系统 |

浏览器控制是另一条 MCP：`src/main/features/browser/mcp/README.md`。那是应用自己开的浏览器工具，不是用户随便加的第三方服务器。

## 记住这一点

MCP 工具对模型来说仍是工具。多出来的是「工具定义来自外部进程，调用要跨进程」。

## 先不要展开的目录

- `src/main/ai/mcp/` 除了上面点名的文件。
- `src/renderer` 里 MCP 设置页。配置界面可以等你要加服务器时再看。
