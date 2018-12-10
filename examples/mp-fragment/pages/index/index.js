const app = getApp()
const Nats = require('../../utils/nats')

Page({

  data: {
    nats: null,
    sid: ''
  },

  onLoad () {
    const nats = new Nats()
    nats.connect({url: 'wss://msg-ws.myun.tv'}).then(() => {
      console.log('connect 成功')
    })
    this.nats = nats
  },

  sub () {
    this.nats.subscribe('stream-event', (data) =>  {
      console.log('stream-event', data)
    }).then(sid => {
      this.sid = sid
    })
  },

  unsub () {
    this.nats.unsubscribe(this.sid)
  },

  async close () {
    this.nats.close()
  }
})