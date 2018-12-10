import Socket from './base'

class AlipaySocket extends Socket {
    constructor (opt) {
        super(opt)
        this.socketTask = null
        this.isConnected = false
        this.isConnecting = false

        this._onClose = this._onClose.bind(this)
        this._onOpen = this._onOpen.bind(this)
        this._onError = this._onError.bind(this)
        this._onMessage = this._onMessage.bind(this)
    }

    connect () {
        return new Promise((resolve, reject) => {
            this.isConnecting = true
            this.socketTask = my.connectSocket({
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
            my.onSocketError(this._onError)
            my.onSocketClose(this._onClose)
            my.onSocketOpen(this._onOpen)
            my.onSocketMessage(this._onMessage)
        })
    }

    _onOpen (header) {
        // console.log('on open')
        this.emit('open', header)
        this.isConnected = true
    }

    _onClose () {
        // console.log('on close')
        this.emit('close')
        this.isConnected = false
    }

    _onMessage (res) {
        // console.log('on message')
        const data = res.data
        this.emit('message', data, res)
    }

    _onError () {
        // console.log('on error')
        this.emit('error')
    }

    send (msg) {
        return new Promise((resolve, reject) => {
            my.sendSocketMessage({data: msg, success: resolve, fail: reject})
        })
    }

    close () {
        if (this.isConnected) {
            return new Promise((resolve, reject) => {
                my.closeSocket()
                this.once('close', function () {
                    resolve()
                    this._removeMyListener()
                })
            })
        }
        if (this.isConnecting) {
            return new Promise((resolve, reject) => {
                this.once('open', () => {
                    my.closeSocket()
                })
                this.once('close', function () {
                    resolve()
                    this._removeMyListener()
                })
            })
        }
    }

    _removeMyListener () {
        my.offSocketError(this._onError)
        my.offSocketClose(this._onClose)
        my.offSocketOpen(this._onOpen)
        my.offSocketMessage(this._onMessage)
    }

}

export default AlipaySocket
