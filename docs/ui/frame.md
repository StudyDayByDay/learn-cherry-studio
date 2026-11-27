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

一条消息在界面上先有框，再有内容。框负责「这是谁说的、操作栏在哪」。内容负责「里面那些块怎么排」。改气泡圆角去框，改工具卡片去内容。

## 框把正文交给下一块

`MessageContent` 很短。它处理 @某个模型的那一行提示，然后把整条消息交给 parts 渲染器：

```tsx
const MessageContent: React.FC<Props> = ({ message, hoistAttachments }) => {
  return (
    <>
      {!isEmpty(message.mentions) && (
        <Flex className="mb-2.5 flex-wrap gap-2">
          {message.mentions?.map((model) => (
            <span key={createUniqueModelId(model.provider, model.id)} className="text-primary">
              {'@' + model.name}
            </span>
          ))}
        </Flex>
      )}
      <MessagePartsRenderer message={message} hoistAttachments={hoistAttachments} />
    </>
  )
}
```

`mentions` 是用户在输入框里点名的模型，画成 `@模型名`。`hoistAttachments` 为真时，附件从正文流里提出去，放到框的另一块区域，避免图片夹在文字中间把操作栏顶乱。

`MessageFrame` 在用户消息和助手消息两种布局里都会用到 `MessageHeader` 和 `MessageContent`。头里是头像、模型名、时间。用户消息和助手消息的对齐不同，所以框有分支。分支分的是布局，不是「要不要调用模型」。

底部的复制、重试、翻译是 `MessageMenuBar`。那些按钮调用的是列表契约里的 `actions`。骨架知道按钮长什么样，不知道重新生成时主进程会做什么。

## 接下来

`MessagePartsRenderer` 拿到消息之后，按 part 的类型分发。这是 [内容块](/ui/blocks)。

源码：`frame/MessageContent.tsx`、`frame/MessageFrame.tsx`。
