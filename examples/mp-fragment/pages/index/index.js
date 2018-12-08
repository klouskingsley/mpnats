const app = getApp()
const Nats = require('../../utils/wx-nats')

Page({

  data: {
    nats: null,
    sid: ''
  },

  async onLoad () {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')

    const nats = new Nats()
    await nats.connect({url: 'wss://msg-ws.myun.tv'})
    this.nats = nats
    console.log('connect 成功')
    getApp().nats = nats
  },

  async sub () {
    this.sid = await this.nats.subscribe('stream-event', (data) =>  {
      console.log('stream-event', data)
    })
  },

  async unsub () {
    await this.nats.unsubscribe(this.sid)
  },

  async close () {
    await this.nats.close()
  }
})