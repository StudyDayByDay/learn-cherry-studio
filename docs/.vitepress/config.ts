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
        items: [{ text: '01 怎么读', link: '/start/how-to-read' }]
      },
      {
        text: '地图',
        items: [
          { text: '02 两个进程', link: '/map/three-parts' },
          { text: '03 一句话的旅程', link: '/map/one-message' }
        ]
      },
      {
        text: '界面',
        items: [
          { text: '04 标签不丢状态', link: '/ui/router' },
          { text: '05 列表只收一个对象', link: '/ui/contract' },
          { text: '06 列表不负责发送', link: '/ui/message-list' },
          { text: '07 气泡先有框', link: '/ui/frame' },
          { text: '08 一条回复是数组', link: '/ui/blocks' },
          { text: '09 工具名决定卡片', link: '/ui/tools' },
          { text: '10 只有活消息在变', link: '/ui/stream' },
          { text: '11 页面把对象填满', link: '/ui/home-adapter' }
        ]
      },
      {
        text: '进程边界',
        items: [
          { text: '12 一问一答和订阅', link: '/boundary/preload' },
          { text: '13 十毫秒粘一次', link: '/boundary/webcontents' },
          { text: '14 调度台不生成文字', link: '/boundary/stream-manager' }
        ]
      },
      {
        text: '模型调用',
        items: [
          { text: '15 消息是一组块', link: '/model/ui-message' },
          { text: '16 边出字和一次拿全', link: '/model/stream-text' },
          { text: '17 调用点和厂商分开', link: '/model/why-aicore' },
          { text: '18 先改参数再请求', link: '/model/executor' },
          { text: '19 换厂商只换登记', link: '/model/provider' },
          { text: '20 加能力只加一个函数', link: '/model/plugins' },
          { text: '21 一个循环就够了', link: '/model/create-agent' },
          { text: '22 产品规则包在循环外', link: '/model/main-agent' },
          { text: '23 工具是一份说明加一个函数', link: '/model/one-tool' },
          { text: '24 发出去之前先变短', link: '/model/context' }
        ]
      },
      {
        text: 'Agent 运行时',
        items: [
          { text: '25 别人跑，我们观察', link: '/runtime/contract' },
          { text: '26 只追加几个字', link: '/runtime/text-delta' },
          { text: '27 执行前先问一句', link: '/runtime/approval' },
          { text: '28 子任务是一条关系', link: '/runtime/subagent' },
          { text: '29 两套循环', link: '/runtime/adapters' }
        ]
      },
      {
        text: '先认门',
        items: [
          { text: '30 工具可以来自外部进程', link: '/later/mcp' },
          { text: '31 先建索引再当工具查', link: '/later/knowledge' },
          { text: '32 语音只换出入口', link: '/later/voice' },
          { text: '33 钟不知道要问模型', link: '/later/schedule' }
        ]
      }
    ]
  }
}))
