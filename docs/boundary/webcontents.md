---
title: 13 十毫秒粘一次
prev:
  text: 12 一问一答和订阅
  link: /boundary/preload
next:
  text: 14 调度台不生成文字
  link: /boundary/stream-manager
---

# 13 十毫秒粘一次

> 这一课只加一件事：推给窗口之前，把十几毫秒里的增量拼成一条。

## 问题

模型一个 token 一条消息。每条都过 IPC，再触发一次 React 更新，长回答会卡。人眼并不需要每一毫秒都刷新。

## 最小做法

同一个块上的文本先放进缓冲，到点再发。

```ts
class WindowPush {
  private pending = ''
  private timer: ReturnType<typeof setTimeout> | null = null

  pushText(delta: string, send: (text: string) => void) {
    this.pending += delta
    if (this.timer) return
    this.timer = setTimeout(() => {
      send(this.pending)
      this.pending = ''
      this.timer = null
    }, 16)
  }
}
```

16 毫秒大约是一帧。用户仍觉得字是连续出现的，过桥的次数少很多。思考过程的增量和工具参数的增量可以用同一办法，只要别把两种增量粘进同一条字符串。

一个话题开在两个窗口里，就要两个推送器。窗口关了，缓冲丢掉，不再 send。

## 在 Cherry Studio 里

这个类叫 `WebContentsListener`。id 是 `wc:窗口号:话题号`。以 `wc:` 开头的才是给界面的，写数据库的是另一个听众。真正过桥时调用 `wc.send(IpcApi_Event, 'ai.stream.chunk', payload)`，也就是上一课 `on` 听到的那条通道。

## 接下来

谁持有这些听众、谁在结束时写数据库，是 [14 调度台不生成文字](/boundary/stream-manager)。
