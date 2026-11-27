import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const base = process.env.BASE_PATH || '/'

export default withMermaid(defineConfig({
  lang: 'zh-CN',
  title: '学 Cherry Studio',
  description: '给前端开发者的 Cherry Studio 知识导航',
  base,
  lastUpdated: false,
  themeConfig: {
    search: { provider: 'local' },
    outline: { label: '本课', level: [2, 3] },
    docFooter: { prev: '上一课', next: '下一课' },
    nav: [
      { text: '从这里开始', link: '/start/how-to-read' },
      { text: '一条消息', link: '/map/one-message' },
      { text: '模型调用', link: '/model/why-aicore' }
    ],
    sidebar: [
      {
        text: '怎么用',
        items: [{ text: '怎么读这份导航', link: '/start/how-to-read' }]
      },
      {
        text: '地图',
        items: [
          { text: '三块代码', link: '/map/three-parts' },
          { text: '一条消息的全程', link: '/map/one-message' }
        ]
      },
      {
        text: '界面',
        items: [
          { text: '一个 Tab 一份路由', link: '/ui/router' },
          { text: '列表契约', link: '/ui/contract' },
          { text: 'MessageList 画什么', link: '/ui/message-list' },
          { text: '消息骨架', link: '/ui/frame' },
          { text: '内容块', link: '/ui/blocks' },
          { text: '工具在界面上', link: '/ui/tools' },
          { text: '流式文字', link: '/ui/stream' },
          { text: 'Home 适配器', link: '/ui/home-adapter' }
        ]
      },
      {
        text: '进程边界',
        items: [
          { text: 'preload 与 IPC', link: '/boundary/preload' },
          { text: '流推回窗口', link: '/boundary/webcontents' },
          { text: 'AiStreamManager', link: '/boundary/stream-manager' }
        ]
      },
      {
        text: '模型调用',
        items: [
          { text: 'UIMessage 与 parts', link: '/model/ui-message' },
          { text: 'streamText 与 generateText', link: '/model/stream-text' },
          { text: '为什么有 aiCore', link: '/model/why-aicore' },
          { text: '一次调用怎么发出去', link: '/model/executor' },
          { text: '换厂商不换调用方', link: '/model/provider' },
          { text: '插件管道', link: '/model/plugins' },
          { text: 'createAgent', link: '/model/create-agent' },
          { text: '主进程里的循环', link: '/model/main-agent' },
          { text: '一个小工具', link: '/model/one-tool' },
          { text: '上下文快满了', link: '/model/context' }
        ]
      },
      {
        text: 'Agent 运行时',
        items: [
          { text: '和 Electron 无关的契约', link: '/runtime/contract' },
          { text: '文本增量', link: '/runtime/text-delta' },
          { text: '工具审批认门', link: '/runtime/approval' },
          { text: '子 agent', link: '/runtime/subagent' },
          { text: 'Pi 与 Claude Code', link: '/runtime/adapters' }
        ]
      },
      {
        text: '先认门',
        items: [
          { text: 'MCP', link: '/later/mcp' },
          { text: '知识库', link: '/later/knowledge' },
          { text: '语音', link: '/later/voice' },
          { text: '定时', link: '/later/schedule' }
        ]
      }
    ]
  }
}))
