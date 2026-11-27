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

模型能用的工具不一定写在 Cherry 的仓库里。MCP 是一种协议：外部进程声明「我有这些工具」，客户端连上之后，把它们并进这一轮的工具列表。对模型来说，它们仍是「名字、参数、调用结果」。多出来的是调用要跨进程。

## 放回这条链上

主进程的 `McpRuntimeService` 使用 `@modelcontextprotocol/client`。它维持连接，列出工具，在循环执行到某个 MCP 工具时转发 `CallTool`，再把结果写成工具 part。

工具名在界面上常带 `mcp__` 前缀。`chooseTool` 看到这个前缀，就走 MCP 卡片或通用的执行时间线，而不是网页搜索那张卡。卡片显示的参数和输出，来源是外部服务器，形状仍是工具 part。

同目录可以这样认：

- `McpRuntimeService.ts`：连接和调用。
- `McpCatalogService.ts`：用户配置了哪些服务器。
- `createMcpBridgeServer.ts`：把 Cherry 自己的一些能力也桥成 MCP，给外部运行时用。
- `servers/`：随应用带上的服务器，例如文件系统。

浏览器控制是另一条。`src/main/features/browser/mcp/` 让 agent 操作应用自己打开的页面。它也说 MCP 的语言，但是应用内的服务器，不是用户随手加的第三方进程。

审批同样适用。外部工具能不能直接跑，仍走上一课那道门。协议没有让外部进程绕过用户的允许。

## 接下来

知识库看起来也像工具，但它先要建索引。[知识库](/later/knowledge) 说明索引和调用是两段。

源码：`src/main/ai/mcp/McpRuntimeService.ts`。
