---
title: 一个 Tab 一份路由
prev:
  text: 一条消息的全程
  link: /map/one-message
next:
  text: 列表契约
  link: /ui/contract
---

# 一个 Tab 一份路由

预计 12 分钟。

## 这一坐要看懂什么

窗口里有多标签。每个标签持有自己的 TanStack Router 实例，用的是 MemoryRouter，所以切走标签时页面状态还在，相当于原生的 KeepAlive。聊天页是这些路由里的一个页面，消息列表是页面里的一块。

## 先打开哪个文件

`src/renderer/routes/README.md` 的前 40 行。新页面是在 `src/renderer/routes/` 里加一个文件，开发服务器会生成 `routeTree.gen.ts`。

## 关键代码

文档里的写法就是项目约定：

```tsx
// agent/cherry-studio/src/renderer/routes/README.md
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$topicId')({
  component: ChatPage
})

function ChatPage() {
  const { topicId } = Route.useParams()
  return <div>Chat: {topicId}</div>
}
```

真实聊天页比这个例子大得多。这一坐只要确认：`topicId` 从路由来，消息数据稍后由页面适配器填进列表。

## 记住这一点

路由负责「现在看哪一个话题」。它不负责流式协议，也不负责调用模型。

## 先不要展开的目录

- `src/renderer/routes` 里除了 README 以外的具体页面。等你跟完一条消息，再按文件名回去找 `/chat`。
- `src/renderer/windows`：选择助手、划词等独立窗口，是另一套壳。
