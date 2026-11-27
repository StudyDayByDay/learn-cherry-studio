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

网页前端里，React 页面和接口通常是两台机器上的两份程序。Cherry Studio 是 Electron 桌面应用，这两份程序在同一台电脑上，仍然分成两个进程。

## 为什么要拆开

渲染进程就是窗口里的 Chromium，跑你熟悉的 React。用户能在开发者工具里看到它。如果模型的 API Key 放在这里，打开调试工具就能读走。文件、数据库、子进程也不该由网页随意碰。

主进程是 Node。它创建窗口，保管密钥，连接模型，读写 SQLite。窗口里的页面要做事，必须请主进程代劳。

中间还有一层 preload。它跑在窗口里，但能使用少量 Electron API，负责把「网页可以调用的函数」交到 `window` 上。页面不直接 `import` 主进程的代码。

可以把它想成：

```text
渲染进程   React 界面          看得见的气泡、输入框
preload    一条窄桥            页面发出的请求和订到的事件
主进程     Node                密钥、数据库、模型请求
packages   被主进程引用的库    模型调用和 agent 契约，本身不画按钮
```

仓库入口也写在主进程上。根目录 `package.json` 里是：

```json
{
  "main": "./out/main/main.js"
}
```

`electron .` 先启动这个文件，再由它打开窗口，窗口加载渲染进程打出来的页面。

## 和这门课的关系

界面课只待在 `src/renderer`。进程边界课看 preload 怎样把流送回来。模型课看 `packages/aiCore`，以及主进程里把这个包用起来的 `Agent`。`packages` 可以单独读，因为它不依赖窗口。

你在设置页填的 Key 留在主进程。React 组件拿到的是「当前选中的模型 id」，不是密钥本身。

## 接下来

知道三块各自干什么之后，用一句话把它们串起来。[一条消息的全程](/map/one-message) 跟着「今天北京天气怎么样」走一遍，仍然不展开实现细节。

源码位置：仓库根目录 `package.json` 的 `main` 字段。目录就是 `src/renderer`、`src/preload`、`src/main`、`packages`。
