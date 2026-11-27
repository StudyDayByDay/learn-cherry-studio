---
title: 30 工具可以来自外部进程
prev:
  text: 29 两套循环
  link: /runtime/adapters
next:
  text: 31 先建索引再当工具查
  link: /later/knowledge
---

# 30 工具可以来自外部进程

> 这一课只认一件事：MCP 工具对模型来说仍是课 23 的说明加函数。函数的身体在另一个进程里。

## 问题

用户想让 agent 用一个你没写过的工具，比如他本机的笔记软件。你不可能把每个软件的 API 都做进仓库。

## 最小做法

启动时问外部进程要工具列表，把它们并进课 21 的 `tools`。执行时把参数转交出去，再把结果放进工具块。

```ts
const remote = await mcp.listTools()
const tools = Object.fromEntries(
  remote.map((tool) => [
    tool.name,
    {
      description: tool.description,
      parameters: tool.parameters,
      run: (input: unknown) => mcp.call(tool.name, input)
    }
  ])
)
```

模型看见的仍是名字和说明。`run` 里面是一次跨进程调用。界面按名字画卡片，名字常常带 `mcp__` 前缀，用来和内置搜索区分。

课 27 的审批仍然有效。外部进程不能因为协议不同就绕过「先问一句」。

## 在 Cherry Studio 里

连接和调用在 `McpRuntimeService`，用的是 `@modelcontextprotocol/client`。服务器清单在 `McpCatalogService`。浏览器控制是应用自己开的一条 MCP，在 `src/main/features/browser/mcp/`，和用户添加的第三方进程不是同一条。

## 接下来

知识库看起来也像工具，但它要先把资料处理好。[31 先建索引再当工具查](/later/knowledge)。
