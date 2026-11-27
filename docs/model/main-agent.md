---
title: 22 产品规则包在循环外
prev:
  text: 21 一个循环就够了
  link: /model/create-agent
next:
  text: 23 工具是一份说明加一个函数
  link: /model/one-tool
---

# 22 产品规则包在循环外

> 这一课只加一件事：系统提示、温度、每轮开始前的整理，放在创建循环的参数里，不写进循环。

## 问题

上一课的 `while` 对所有产品都一样。Cherry 还要：用这篇助手的系统提示、把温度传进去、工具结果里如果有图片就换成当前模型能看的格式。把这些写进 `while`，循环就不再是课 21 那一个。

## 最小做法

循环保持不变。变化的是交给它的设置，以及每一步之前的一个钩子。

```ts
function createAgent(options: {
  model: string
  system: string
  temperature: number
  tools: Record<string, Tool>
  prepareStep?: (messages: unknown[]) => unknown[]
}) {
  return {
    async run(messages: unknown[]) {
      while (true) {
        const prepared = options.prepareStep?.(messages) ?? messages
        const reply = await streamText({
          model: options.model,
          temperature: options.temperature,
          system: options.system,
          messages: prepared,
          tools: options.tools
        })
        // 和上一课相同：有工具就执行并继续，没有就停
        if (!reply.hasToolCall) return reply
        messages = appendToolResults(prepared, reply)
      }
    }
  }
}
```

`prepareStep` 在每一轮请求前跑，所以它能看见刚刚追加的工具结果。课 20 的插件默认只在创建时跑一次，干不了这件事。图片、音频这类「这一轮的消息要改写」的活，放在 `prepareStep`。

有的调用方想自己控制循环，只要模型走一步。那就不要 `createAgent`，直接 `streamText`，并规定最多一步。普通聊天走上面的 `run`。

## 在 Cherry Studio 里

主进程的 `Agent.buildExecution` 调用 `createAgent`，把 `instructions`（系统提示）、`temperature`、`toolsWithHooks`、`prepareStep` 放进 `agentSettings`。`toolsWithHooks` 是工具外面加的执行钩子，用来接日志和审批。`contextOwner === 'caller'` 时不建循环，改为 `stopWhen: stepCountIs(1)`。

## 接下来

`tools` 里的一项到底是什么？[23 工具是一份说明加一个函数](/model/one-tool) 用网页搜索写全。
