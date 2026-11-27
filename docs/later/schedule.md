---
title: 定时
prev:
  text: 语音
  link: /later/voice
next: false
---

# 定时

预计 10 分钟。认门，不往下读。

## 这一坐要看懂什么

仓库里有一层和业务无关的钟：`src/main/core/scheduler`。它只知道「到点调用某个回调」，支持 cron、间隔和一次性延迟。它不知道回调是在跑 agent 还是在清缓存。

到点要做的事，是上层拿着这个钟去注册的。定时任务的产品含义（让 agent 以后再跑一轮）因此不在 scheduler 文件里，而在注册回调的那一侧。界面上如果看到定时任务的工具卡片，那是结果展示，在 `messages/tools/agent/` 一类目录。

## 先打开哪个文件

`src/main/core/scheduler/README.md`。它很短，并且指向 `docs/dev/references/job-and-scheduler/`。这一坐读 README 即可。

## 关键代码

```ts
// 概念上的用法，完整示例在 scheduler/README.md
import { application } from '@application'

// SchedulerService：registerSchedule / pause / resume / unregister / triggerNow
```

README 强调它是无状态的时间调度。和 `registerInterval`、原始 `setInterval` 的选择，写在它链接的那份 usage 文档里。

## 记住这一点

看到「定时」先分清两层：钟在 `src/main/core/scheduler`，到点之后跑什么是注册者的事。不要在钟的实现里找提示词。

## 先不要展开的目录

- `src/main/core/job/`。任务队列在钟的上面，另一份文档。
- `docs/dev/references/job-and-scheduler/` 的全文。等你真的要加一种定时任务再打开。

到这里，主线课结束。之后遇到具体文件，从侧边栏回到对应的那一课，再沿着那一课点名的路径往下读。
