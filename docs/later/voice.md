---
title: 语音
prev:
  text: 知识库
  link: /later/knowledge
next:
  text: 定时
  link: /later/schedule
---

# 语音

语音是同一条对话的另一种出入口。麦克风把话说成文本，文本仍走输入框那条发送链。回复除了画在气泡里，还可以读出来。模型和工具循环不用知道音频从哪来。

## 两条实现，一个会话入口

本地引擎和云端 API 是并列的。

本地适配器在 `src/main/ai/voice/localAdapters/`。模型定义带一组操作，`execution.ts` 按操作选择。系统语音、FunASR、Qwen、Kokoro 各自一份适配器。音频解码放在名为 `voice.audio` 的 utility process 里，由 `VoiceSessionService` 注册。网页里录到的常常是 WebM，这些引擎要的是 WAV，所以只有 WebM 才额外解码。取消用 AbortSignal 传进整个解码过程，避免用户松手之后进程还在转码。

云端语音回到 `aiCore` 的 `runtime/voice.ts`，本质仍是「一个配好的 provider 调用语音接口」。密钥留在主进程，和聊天模型同一套设置。

界面负责采集和播放。识别出的文本交回输入框或直接成为一条用户消息。之后的路径就是这门课前半段已经走过的：IPC、调度台、模型、parts。

## 接下来

最后一页是定时。它容易和「让 agent 过一会儿再跑」混在一起。[定时](/later/schedule) 把钟和到点之后的事情分开。

源码：`src/main/ai/voice/localAdapters/README.md`，会话服务是 `VoiceSessionService.ts`。
