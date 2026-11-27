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

预计 10 分钟。认门，不往下读。

## 这一坐要看懂什么

语音是聊天旁边的一条能力：听写和朗读。模型目录里每个语音模型带一组操作，`execution.ts` 按操作去调。本地引擎（系统语音、FunASR、Qwen、Kokoro 等）在 `localAdapters/`。会话入口是 `src/main/ai/voice/VoiceSessionService.ts`。

它使用主进程甚至独立的 utility process 来解码音频，所以不在渲染进程里直接跑。

## 先打开哪个文件

`src/main/ai/voice/localAdapters/README.md` 的前 20 行。

## 关键代码

README 里的分工可以记成三句：

- 模型定义提供操作表，执行层按表选择。
- `voiceAudioProcess` 声明名为 `voice.audio` 的 utility process，由 `VoiceSessionService` 注册。
- Apple、FunASR、Qwen3-ASR、Windows 识别走规范的 WAV；WebM 才额外解码。

云端语音则回到 `aiCore` 的语音 runtime：`packages/aiCore/src/core/runtime/voice.ts`。那是「用厂商 API 做语音」的一条，和本地适配器并列。

## 记住这一点

语音有本地适配器和云端 API 两条。两条都由主进程的会话服务收口，界面只负责采集和播放。

## 先不要展开的目录

- `localAdapters/` 里每个引擎的实现和测试。
- `native/system-speech`。那是系统语音的原生模块。
