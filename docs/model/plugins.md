---
title: 20 加能力只加一个函数
prev:
  text: 19 换厂商只换登记
  link: /model/provider
next:
  text: 21 一个循环就够了
  link: /model/create-agent
---

# 20 加能力只加一个函数

> 这一课只加一件事：请求发出去之前，跑一组函数。加一种能力，就是往数组里加一个函数。

## 问题

聊天、起标题、压缩上下文，三处都在调模型。产品要给 OpenAI 的请求加上原生网页搜索。你在三个调用点各写一次。下周 Anthropic 的字段不叫这个名字，三处再改一遍。

## 最小做法

调用前先过一遍插件。插件拿到参数，返回改过的参数。不支持就原样返回。

```ts
type Params = { model: string; tools?: Record<string, unknown> }

type Plugin = {
  name: string
  transform(params: Params): Params | Promise<Params>
}

async function run(params: Params, plugins: Plugin[]) {
  let next = params
  for (const plugin of plugins) next = await plugin.transform(next)
  return streamText(next)
}

const webSearch: Plugin = {
  name: 'web-search',
  async transform(params) {
    if (!params.model.startsWith('gpt')) return params
    return {
      ...params,
      tools: { ...params.tools, web_search: { description: 'Search the web' } }
    }
  }
}

run(params, [webSearch])
```

`...params.tools` 是合并。参数里可能已经有别的工具，不能整个换成搜索。三个调用点都写 `run(params, plugins)`。加一种能力，三个调用点不动。

插件有时看见的 `model` 还是字符串，因为「把字符串换成模型对象」的那一步排在后面。所以要先判断，再决定改不改。

还有一个限制，下一课会碰上：工具循环开始之后，不会每一轮都重跑这些函数。只在 `transform` 里塞进去的工具，必须在循环开始前写进设置。

## 在 Cherry Studio 里

生产代码的名字是 `definePlugin` 和 `transformParams`。`providerToolPlugin` 先问这家厂商有没有这种能力，有就把 `patch.tools` 合并进 `params.tools`，没有就 `return params`。执行器上的 `PluginEngine` 负责按顺序调用。

## 接下来

单次 `run` 在模型说「我要搜索」时就结束了。[21 一个循环就够了](/model/create-agent) 让它执行工具再问一次。
