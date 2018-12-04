import Socket from './base'
import EventEmitter from '../core/event-emitter'

class WxSocket extends Socket {
    constructor (opt) {
        super(opt)
        this.socketTask = null
        this._eventEmitter = new EventEmitter()
    }

    connect () {
        return new Promise((resolve, reject) => {
            this.socketTask = wx.connectSocket({
                url: this.url,
                success: () => {
                    this._eventEmitter.once('open', resolve)
                },
                fail: (err) => {
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
        this._eventEmitter.emit('open', header)
    }

    _onClose () {
        this._eventEmitter.emit('close')
    }

    _onMessage (res) {
        const data = res.data
        this.onmessage && this.onmessage(data)
    }

    _onError () {

    }

    send (msg) {
        this.socketTask.send({
            data: msg
        })
    }

}

export default WxSocket
