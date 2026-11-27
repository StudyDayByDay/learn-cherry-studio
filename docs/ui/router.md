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

Cherry Studio 的窗口像浏览器：上面有一排标签，每个标签是一个页面。切走再切回来，原来的滚动位置和输入草稿还在。这不是把每个页面的 state 存进全局 store 再恢复，而是每个标签自己拿着一份路由器，页面组件一直挂着。

## 每个标签一份 MemoryRouter

TanStack Router 在这里按文件生成路由。聊天页的参数是话题 id。文档里的写法就是项目里的写法：

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$topicId')({
  component: ChatPage
})

function ChatPage() {
  const { topicId } = Route.useParams()
  return <div>Chat: {topicId}</div>
}
```

`/chat/$topicId` 的意思是：路径里有一段动态参数，组件里用 `Route.useParams()` 读出来。真实页面比这个例子大，但话题 id 的来源就是这一段。有了 `topicId`，页面才知道要哪一组消息。

每个标签用 MemoryRouter，路由状态放在内存里，不写进地址栏。标签 A 停在话题 1，标签 B 停在设置页，两份路由器互不覆盖。切标签只是显示另一棵已经挂着的树，所以滚动和草稿还在。这就是 README 里说的原生 KeepAlive。

开发时在 `src/renderer/routes/` 加一个文件，开发服务器会重新生成 `routeTree.gen.ts`。你不用手写整张路由表。

## 路由不负责说话

路由只回答「现在这个标签在看哪个话题」。它不保存流式文本，也不发起模型请求。消息从哪来、按钮点了做什么，是下一课的列表契约。页面把 `topicId` 交给数据层，数据层再把消息填进列表。

## 接下来

同一个消息列表要给首页和 Agent 会话用。[列表契约](/ui/contract) 说明页面怎样把数据交进去，而不把「这是不是首页」写进组件。

源码：`src/renderer/routes/README.md`，以及同目录下由文件生成的路由。
