---
title: 23 工具是一份说明加一个函数
prev:
  text: 22 产品规则包在循环外
  link: /model/main-agent
next:
  text: 24 发出去之前先变短
  link: /model/context
---

# 23 工具是一份说明加一个函数

> 这一课只加一件事：工具给模型一段说明和一份参数格式，执行是主进程里的函数。

## 问题

模型不会上网。它只能在回复里写「调用 web_search，参数是这句话」。没有同名函数，循环就无事可做。函数如果搜失败就抛异常，循环分不清「没有结果」和「搜索坏了」，会一直重试。

## 最小做法

说明给模型看。函数给循环调用。失败返回一个对象。

```ts
const webSearch = {
  description: 'Search the web for current facts.',
  parameters: { query: 'string' },
  async run({ query }: { query: string }) {
    try {
      const hits = await search(query)
      return { hits }
    } catch (error) {
      return { error: String(error), retryable: true }
    }
  }
}
```

`description` 决定模型会不会在问天气时点它。`parameters` 对不上，调用在执行前就失败。`retryable: true` 表示可以再试一次。设置里根本没有搜索引擎时，应返回 `retryable: false`，并让模型告诉用户去设置里补，而不是无限循环。

用户点了取消，则要继续抛出，循环才停得下来。取消是唯一还往外抛的情况。

执行完，循环把返回值放进工具块的 `output`。课 09 的卡片按名字 `web_search` 把 `hits` 画出来。说明、参数、函数、卡片，名字对上，链就通了。

## 在 Cherry Studio 里

网页搜索的说明是 `WEB_SEARCH_DESCRIPTION`，失败形状是 `webLookupErrorSchema`。同一份查找函数给 AI SDK 的工具和 Claude Code 的桥共用。界面上 `chooseTool` 看到 `web_search` 画搜索卡。

## 接下来

搜回来的结果会把上下文越撑越长。[24 发出去之前先变短](/model/context) 在下一次请求前把旧消息收成摘要。
