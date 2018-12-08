import Socket from './base'
import EventEmitter from '../core/event-emitter'

class WxSocket extends Socket {
    constructor (opt) {
        super(opt)
        this.socketTask = null
        this.isConnected = false
        this.isConnecting = false
    }

    connect () {
        return new Promise((resolve, reject) => {
            this.isConnecting = true
            this.socketTask = wx.connectSocket({
                url: this.url,
                success: () => {
                    this.isConnecting = false
                    this.once('open', resolve)
                },
                fail: (err) => {
                    this.isConnected = false
                    this.isConnecting = false
                    this.emit('fail')
                    reject(err)
                }
            })
            this.socketTask.onOpen(this._onOpen.bind(this))
            this.socketTask.onMessage(this._onMessage.bind(this))
            this.socketTask.onClose(this._onClose.bind(this))
            this.socketTask.onError(this._onError.bind(this))
        })
    }

    _onOpen (header) {
        this.emit('open', header)
        this.isConnected = true
    }

    _onClose () {
        this.emit('close')
        this.isConnected = false
    }

    _onMessage (res) {
        const data = res.data
        this.emit('message', data, res)
    }

    _onError () {
        this.emit('error')
    }

    send (msg) {
        return new Promise((resolve, reject) => {
            this.socketTask.send({data: msg, success: resolve, fail: reject})
        })
    }

    close () {
        if (this.isConnected) {
            return new Promise((resolve, reject) => {
                this.socketTask.close()
                this.once('close', resolve)
            })
        }
        if (this.isConnecting) {
            return new Promise((resolve, reject) => {
                this.once('open', () => {
                    this.socketTask.close()
                })
                this.once('close', resolve)
            })
        }
    }

}

export default WxSocket
