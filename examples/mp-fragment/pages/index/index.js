const app = getApp()
const Nats = require('../../utils/wx-nats')

Page({

  data: {
    nats: null,
    sid: ''
  },

  async onLoad () {
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