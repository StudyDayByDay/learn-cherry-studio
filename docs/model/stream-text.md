---
title: streamText 与 generateText
prev:
  text: UIMessage 与 parts
  link: /model/ui-message
next:
  text: 为什么有 aiCore
  link: /model/why-aicore
---

# streamText 与 generateText

调用模型只有两种等法。聊天要第一种，因为用户在等字出现。给话题起标题可以用第二种，因为没有人盯着那几个字逐个蹦出来。

## 流，和一次拿全

`streamText` 立刻返回一个流。文本增量、工具调用、结束原因陆续到达。Cherry 的窗口听众消费的就是这个流里的 chunk。第一个字到了就可以画，不用等整段结束。

`generateText` 把连接拿住，直到模型说结束，然后把整段文本、用量、结束原因一起返回。适合标题、摘要、压缩上下文时那一次内部调用。调用方写成 `const { text } = await generateText(...)`。

两边的参数很像：哪个模型、消息数组、有哪些工具、温度是多少。差别是返回值。流式返回的对象要继续读，非流式返回的是最终结果。

Cherry 没有重写这两个函数。执行器在插件跑完之后原样调用 SDK：

```ts
return this.pluginEngine.executeStreamWithPlugins(
  'streamText',
  params,
  (resolvedModel, transformedParams, streamTransforms) => {
    const experimental_transform =
      params?.experimental_transform ?? (streamTransforms.length > 0 ? streamTransforms : undefined)

    return _streamText({
      ...transformedParams,
      model: this.wrapModel(resolvedModel, wrapModel),
      experimental_transform
    })
  }
)
```

`_streamText` 就是 `import { streamText as _streamText } from 'ai'`。`executeStreamWithPlugins` 先让插件改参数、解析模型，回调里才是真正的 SDK 调用。`experimental_transform` 是流上的变换，比如把厂商特有的思考字段收成统一的 reasoning part。没有插件提供变换时，它是 `undefined`，SDK 按原始流输出。

`generateText` 的包装一样，最后调用 `_generateText`，只是没有流变换这一步。

主进程的 `Agent.generate` 用一个参数在两种模式间切换：`mode: 'generate' | 'stream'`。用户看得见的聊天走 stream。

## 接下来

页面如果自己 `import { streamText } from 'ai'`，每家厂商的客户端都会漏进组件。[为什么有 aiCore](/model/why-aicore) 说明这层包装存在的原因。

源码：`packages/aiCore/src/core/runtime/executor.ts` 的 `streamText` 与 `generateText`。
