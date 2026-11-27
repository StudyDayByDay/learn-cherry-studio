---
title: 为什么有 aiCore
prev:
  text: streamText 与 generateText
  link: /model/stream-text
next:
  text: 一次调用怎么发出去
  link: /model/executor
---

# 为什么有 aiCore

预计 12 分钟。

## 这一坐要看懂什么

应用要同时接 OpenAI、Anthropic、Gemini、DeepSeek，以及一大批 OpenAI 兼容接口。如果每个页面自己 `import` 一家 SDK，厂商差异会漏进 React 组件。

`packages/aiCore` 把这件事收成两层：

- `models`：这家厂商的模型对象怎么创建
- `runtime`：一次 `streamText` / `generateText` 怎么带着插件跑起来

界面和主进程业务只跟 runtime 说话。包的 README 在 `packages/aiCore/README.md`。

## 先打开哪个文件

`packages/aiCore/src/index.ts` 的导出，以及 `packages/aiCore/src/core/agents/createAgent.ts` 的文件头注释。

## 关键代码

`createAgent.ts` 开头写着它的分工：复用执行器的厂商解析和插件管道，再装成一个 `ToolLoopAgent`。

```ts
import { ToolLoopAgent } from 'ai'
import { createExecutor } from '../runtime'
```

所以这个包做三件事：统一厂商、在请求前后插插件、把单次调用升级成会自己跑工具的 agent。第三件是后面 `createAgent` 那一课的内容。

## 记住这一点

页面里不应该出现某家厂商的客户端构造函数。看到 `@ai-sdk/openai` 这类 import，它应该在 `aiCore` 或主进程的 provider 配置里。

## 先不要展开的目录

- `packages/ai-sdk-provider`。那是 Cherry 自己的一家网关，属于「又一个 provider」，不是总开关。
- `packages/provider-registry`。模型目录和推理能力表，配置界面会用到，调用链先不依赖你读完它。
