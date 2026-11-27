---
title: 21 一个循环就够了
prev:
  text: 20 加能力只加一个函数
  link: /model/plugins
next:
  text: 22 产品规则包在循环外
  link: /model/main-agent
---

# 21 一个循环就够了

> 这一课只加一件事：模型回复里还有工具调用，就执行，把结果送回去，再问一次。没有工具调用，就停。

## 问题

`streamText` 停在第一段回复上。模型说「请调用 web_search」，聊天还没完。必须有人去搜，把结果放回消息，再请求模型，直到它写出给用户的那句话。

## 最小做法

一个循环。判断条件只有一个：这段回复里有没有工具调用。

```ts
type Block =
  | { type: 'text'; text: string }
  | { type: 'tool'; id: string; name: string; input: unknown }

const messages: unknown[] = [{ role: 'user', content: '今天北京天气怎么样' }]

while (true) {
  const reply = await streamText({ model, messages, tools })
  messages.push({ role: 'assistant', content: reply.blocks })

  const calls = reply.blocks.filter((block) => block.type === 'tool')
  if (calls.length === 0) break

  const results = []
  for (const call of calls) {
    const output = await runTool(call.name, call.input)
    results.push({ type: 'tool-result', id: call.id, output })
  }
  messages.push({ role: 'tool', content: results })
}
```

模型决定要不要搜、搜什么。循环只负责执行和把结果追加进去。没有规划器，没有状态机。思维过程就是模型写在回复里的那些块。

课 20 的插件如果只在每一轮 `streamText` 前运行，这个 `while` 的第二轮会看不见它们。所以创建循环之前，先把插件要加的工具写进 `tools`。循环开始后，`tools` 不再变。

## 在 Cherry Studio 里

这个 `while` 在依赖 `ai` 的 `ToolLoopAgent` 里，Cherry 没有再写一份。`createAgent` 做的是循环开始前的准备：解析模型，调用 `transformAgentSettings` 让插件改设置，然后 `new ToolLoopAgent({ ...settings, model })`。文件大约六十行，五步都是准备，第五步才把循环交出去。

## 接下来

系统提示、温度、执行前的钩子是产品规则。[22 产品规则包在循环外](/model/main-agent) 把它们放进 `createAgent` 的参数。
