---
title: 消息骨架
prev:
  text: MessageList 画什么
  link: /ui/message-list
next:
  text: 内容块
  link: /ui/blocks
---

# 消息骨架

预计 12 分钟。

## 这一坐要看懂什么

一条消息在界面上先有骨架，再有内容。骨架在 `frame/`：头像和模型名、正文容器、底部操作、附件、token 统计。正文容器不解析 Markdown，它把消息交给内容块渲染器。

## 先打开哪个文件

`src/renderer/components/chat/messages/frame/MessageContent.tsx`，全文大约 30 行。然后在 `MessageFrame.tsx` 里搜 `MessageHeader` 和 `MessageContent`，看它们怎么拼在一起。

## 关键代码

```tsx
// agent/cherry-studio/src/renderer/components/chat/messages/frame/MessageContent.tsx
const MessageContent: React.FC<Props> = ({ message, hoistAttachments }) => {
  return (
    <>
      {/* @某个模型时的提示 */}
      <MessagePartsRenderer message={message} hoistAttachments={hoistAttachments} />
    </>
  )
}
```

`MessageFrame.tsx` 在用户消息和助手消息两种布局里都会用到 `MessageHeader` 与 `MessageContent`。头在 `frame/`，块在 `blocks/`。

## 记住这一点

改气泡外观、操作栏、头像，去 `frame/`。改「文字、思考、工具卡片怎么排」，去 `blocks/`。

## 先不要展开的目录

- `frame/MessageMenuBar.tsx` 和一串 toolbar 文件。那是复制、重试、翻译按钮的产品菜单。
- `frame/MessageTokens.tsx`。用量展示，和协议课可以分开看。
