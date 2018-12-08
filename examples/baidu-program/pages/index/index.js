const app = getApp()
const Nats = require('../../utils/wx-nats')

Page({

  data: {
    nats: null,
    sid: ''
  },

  onLoad () {
    const nats = new Nats()
    nats.connect({url: 'wss://msg-ws.myun.tv'})
    this.nats = nats
    console.log('connect 成功')
    getApp().nats = nats
  },

  sub () {
    this.nats.subscribe('stream-event', (data) =>  {
      console.log('stream-event', data)
    }).then((sid) => {
      this.sid = sid
    })
  },

  unsub () {
    this.nats.unsubscribe(this.sid)
  },

  close () {
    this.nats.close()
  }
})