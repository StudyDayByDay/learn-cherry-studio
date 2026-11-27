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

预计 15 分钟。

## 这一坐要看懂什么

外部运行时不会按 Cherry 的组件来吐字。适配器把原生事件收成对某一个 part 的编辑。文本和推理过程用三种编辑：

| 编辑 | 含义 |
| --- | --- |
| `open` | 开始一块新的正文或推理 |
| `append` | 往这块上追加字符串 |
| `finish` | 这块写完了 |

`correct` 是整块替换，`put` 用来放文件或工具 part。纯文本的 open/append/finish 可以拆成更细的事件再推给观察者。

## 先打开哪个文件

`packages/agent-runtime/src/textPartUpdates.ts`。全文大约 50 行。对照 README 里 `message.parts` 那一段。

## 关键代码

```ts
// agent/cherry-studio/packages/agent-runtime/src/textPartUpdates.ts
switch (edit.type) {
  case 'open':
    updates.push({ type: 'message.text-open', ref, part, kind: edit.kind })
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

`ref` 指向哪一条消息的哪一个 part。界面上的流式正文，就是这些 append 叠出来的。`correct` 和 `put` 不走这条纯文本捷径，调用方保留原来的整批 `message.parts`。

## 记住这一点

流式协议在契约层是「对已知 part 位置的有序编辑」，不是把整段回复反复覆盖成一个新字符串。

## 先不要展开的目录

- `messageStream.ts` 和 `observation.ts`。它们处理观察者排队和溢出，等你要改「丢更新」时再读。
- `immutable.ts`。它保证发出去的对象被冻结，避免一个听众改数据影响到另一个。
