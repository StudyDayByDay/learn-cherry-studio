---
title: 04 标签不丢状态
prev:
  text: 03 一句话的旅程
  link: /map/one-message
next:
  text: 05 列表只收一个对象
  link: /ui/contract
---

# 04 标签不丢状态

> 这一课只加一件事：每个标签自己拿着一份路由，切走时页面不卸载。

## 问题

窗口上面有一排标签。你在话题 A 看到一半，点开设置，再点回来，希望滚动位置还在。如果全窗口共用一个路由器，一切标签，上一页就卸载了。

## 最小做法

每个标签一个内存路由器。路由状态不写地址栏，组件树也不拆。

```tsx
function Tab({ path }: { path: string }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/chat/:topicId" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function Window() {
  const tabs = useTabs()
  return tabs.map((tab) => (
    <div key={tab.id} hidden={tab.id !== activeId}>
      <Tab path={tab.path} />
    </div>
  ))
}
```

`hidden` 只是不显示。`ChatPage` 还挂着，里面的滚动和输入草稿还在。这就是 KeepAlive：保活靠的是不卸载，不是把 state 抄进全局 store 再恢复。

聊天页从路径里拿话题 id：

```tsx
const { topicId } = useParams()
```

有了 `topicId`，才知道要哪一组消息。路由到此为止。它不保存模型正在吐的字。

## 在 Cherry Studio 里

用的是 TanStack Router 的 `createFileRoute('/chat/$topicId')`，每个标签一份 MemoryRouter。在 `src/renderer/routes/` 加一个文件，开发服务器会生成路由表。

## 接下来

同一个气泡列表要给首页和 Agent 会话共用。[05 列表只收一个对象](/ui/contract) 让组件不再写「这是不是首页」。
