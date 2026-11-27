---
title: 三块代码
prev:
  text: 怎么读这份导航
  link: /start/how-to-read
next:
  text: 一条消息的全程
  link: /map/one-message
---

# 三块代码

预计 15 分钟。

## 这一坐要看懂什么

Cherry Studio 是 Electron 应用。和你熟悉的网页相比，多了一层「主进程」。代码按职责分成三块，聊天功能横跨这三块。

| 位置 | 跑在哪 | 你把它当成什么 |
| --- | --- | --- |
| `src/renderer` | 窗口里的 Chromium | 你已经会的 React 界面 |
| `src/preload` | 窗口和 Node 之间的桥 | 渲染进程能调用的那一层 API |
| `src/main` | Node 主进程 | 密钥、数据库、模型请求、文件系统 |
| `packages/*` | 被主进程引用的库 | 可以脱离界面单独读的 TypeScript 包 |

`packages/aiCore` 和 `packages/agent-runtime` 是转型主线。它们不画按钮。

## 先打开哪个文件

仓库根目录的 `package.json`，看 `"main": "./out/main/main.js"`。入口在主进程，界面是它打开的窗口。

## 关键代码

界面技术可以先认这几个依赖，都在根 `package.json` 里：

- `electron`、`electron-vite`：桌面壳和开发服务器
- `react`、`@tanstack/react-router`：窗口里的页面
- `ai`、`@ai-sdk/openai` 以及一批 `@ai-sdk/*`：模型调用
- `@cherrystudio/ai-core`、`@cherrystudio/agent-runtime`：仓库自己的包，用 `workspace:*` 连到 `packages/`

## 记住这一点

渲染进程负责画。主进程负责把话发给模型。`packages/` 里的包两边都能被引用，但模型密钥和工具执行留在主进程。

## 先不要展开的目录

- `src/main/data`：SQLite 和业务表。
- `src/main/core`：窗口、生命周期、定时器底座。下一课只用名字，不读实现。
