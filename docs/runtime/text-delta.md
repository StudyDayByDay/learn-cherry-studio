---
title: 文本增量
prev:
  text: 和 Electron 无关的契约
  link: /runtime/contract
next:
  text: 工具审批认门
  link: /runtime/approval
---

# 文本增量

如果每次增量都把整条助手消息重新发一遍，观察者和界面要比对全文才能知道多了哪几个字。契约改成对「已知的某一块」做编辑。文本和思考只用三种编辑。

## open、append、finish

```ts
switch (edit.type) {
  case 'open':
    updates.push({
      type: 'message.text-open',
      ref,
      part,
      kind: edit.kind
    })
    break
  case 'append':
    updates.push({ type: 'message.text-append', ref, part, text: edit.text })
    break
  case 'finish':
    updates.push({ type: 'message.text-finish', ref, part })
    break
  case 'correct':
  case 'put':
    return undefined
}
```

`ref` 指向哪一条消息。`part` 是这块在消息里的位置。`open` 开始一块新的正文或推理，`kind` 区分两者。`append` 带上这一小段 `text`，接收方把它接到那一块的末尾。`finish` 表示这块写完，界面可以收起光标、按完整 Markdown 渲染。

一组编辑如果全是这三种，函数返回细粒度事件，观察者可以逐条应用。一旦出现 `correct` 或 `put`，函数返回 `undefined`。`correct` 是整块替换，发生在原生源修订了已经写过的文本时。`put` 用来放文件或工具 part。这两种不适合拆成「追加字符串」，调用方保留原来的整批 `message.parts`，按一批来应用。

这和聊天流里的 `text-delta` 是同一类想法。聊天那边的 delta 由 AI SDK 的 chunk 表达，编码助手这边由契约里的 append 表达。窗口最后看到的都是某个 text part 的 `text` 变长了。

## 接下来

工具 part 有时不能马上执行，要等用户点允许。[工具审批认门](/runtime/approval) 把这道门的两端对上。

源码：`packages/agent-runtime/src/textPartUpdates.ts`。
