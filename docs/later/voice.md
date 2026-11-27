---
title: 32 语音只换出入口
prev:
  text: 31 先建索引再当工具查
  link: /later/knowledge
next:
  text: 33 钟不知道要问模型
  link: /later/schedule
---

# 32 语音只换出入口

> 这一课只认一件事：语音把声音变成文本，或把文本读出来。变成文本之后，走的仍是课 12 的发送。

## 问题

如果识别和模型循环写在一起，换一个本地语音引擎就要改聊天循环。

## 最小做法

语音停在循环外面。

```ts
const text = await speechToText(audio)
await ipc.request('chat.send', { topicId, text })

const reply = await waitUntilAssistantDone(topicId)
await textToSpeech(reply)
```

本地引擎和云端 API 可以并列。本地的负责系统语音或开源模型，云端的仍走课 19 的厂商登记。密钥留在主进程。界面只采集和播放。

WebM 和 WAV 的转换也停在这一层。循环看见的永远是字符串。

## 在 Cherry Studio 里

会话入口是 `VoiceSessionService`。本地适配器在 `src/main/ai/voice/localAdapters/`，解码放在单独的 utility process。云端语音在 `packages/aiCore` 的 `runtime/voice.ts`。

## 接下来

最后一件事容易和「让 agent 过一会儿再跑」混在一起。[33 钟不知道要问模型](/later/schedule) 把定时器和对模型的调用拆开。
