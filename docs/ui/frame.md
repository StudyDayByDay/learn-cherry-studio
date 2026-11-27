---
title: 07 气泡先有框
prev:
  text: 06 列表不负责发送
  link: /ui/message-list
next:
  text: 08 一条回复是数组
  link: /ui/blocks
---

# 07 气泡先有框

> 这一课只加一件事：框负责「谁说的、按钮在哪」，框里面再交给内容。

## 问题

改圆角时，你不想碰到工具卡片的逻辑。改搜索卡片时，你不想碰到头像。如果一个组件同时画头、正文、按钮和工具，两边的修改会互相踩。

## 最小做法

框只拼三块。正文是一个孩子，框不解析 Markdown。

```tsx
function MessageFrame({ message, actions }) {
  return (
    <article data-role={message.role}>
      <header>
        <Avatar name={message.author} />
        <span>{message.author}</span>
      </header>
      <MessageContent message={message} />
      <footer>
        {actions.regenerate && <button onClick={() => actions.regenerate(message.id)}>重新生成</button>}
      </footer>
    </article>
  )
}

function MessageContent({ message }) {
  return <Parts message={message} />
}
```

用户消息和助手消息的对齐不同，所以 `data-role` 交给样式。按钮仍来自上一课的 `actions`，没有函数就不画。

`MessageContent` 故意这么薄。它的存在是一条边界：框的文件里看不到 part 的类型。

## 在 Cherry Studio 里

`MessageFrame` 在两种布局里都会用 `MessageHeader` 和 `MessageContent`。`MessageContent` 画完 @模型 的提示之后，把消息交给 `MessagePartsRenderer`。复制、重试在 `MessageMenuBar`，调用的是 actions。

## 接下来

`Parts` 里面不是一段字符串。[08 一条回复是数组](/ui/blocks) 把数组画出来。
