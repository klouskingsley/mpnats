import * as config from './config'
import {encode_utf8, substr_utf8_bytes, bytes_size} from './bytes'
import EventEmitter from './event-emitter'

class Core extends EventEmitter {

    constructor (option) {
        super()
        this.option = option
        this.connectUrl = ''
        this.socket = null
        this.subMsgMap = {}
        this.uid = 0
        this.pendingMsg = ''
        this._onMessage = this._onMessage.bind(this)
        this._onClose = this._onClose.bind(this)
        this._onError = this._onError.bind(this)
    }

    connect ({url}) {
        if (this.socket) {
            throw new Error('Please close it when you want to connect')
        }

        this.connectUrl = url
        this.socket = new Core.Socket({url})
        this.socket.on('message', this._onMessage)
        this.socket.on('error', this._onError)
        this.socket.on('close', this._onClose)
        return this.socket.connect()
    }

    close () {
        const socket = this.socket
        if (socket) {
            this.subMsgMap = {}
            this.connectUrl = ''
            this.uid = 0
            this.socket = null
            this.pendingMsg = ''
            return socket.close()
        }
        return Promise.resolve()
    }

    subscribe (topic, callback) {
        if (!this.socket) {
            throw new Error('subscribe: please excute connect before subscribe')
        }
        const sid = ++this.uid
        this.subMsgMap[sid] = {
            sid,
            topic,
            callback
        }
        const msg = [
            config.SUB, topic, sid + config.CR_LF
        ].join(config.SPC)
        return this.socket.send(msg).then(() => sid)
    }

    unsubscribe (sid) {
        if (this.subMsgMap[sid]) {
            this.subMsgMap[sid] = null
            const msg = [
                config.UNSUB, sid + config.CR_LF
            ].join(config.SPC)
            return this.socket.send(msg)
        }
        return Promise.resolve()
    }

    publish (topic, message = '') {
        if (typeof message != 'string') throw new TypeError('publish(topic, message): message must be string type')
        const msg = [
            config.PUB,
            topic,
            bytes_size(message) + config.CR_LF + message + config.CR_LF
        ].join(config.SPC)
        this.socket.send(msg)
    }

    request () {}
    flush () {}
    timeout () {}

    _onMessage (data) {
        // console.log('on msg', data)
        var msg
        var m
        var topic
        var sid
        var nextMsg = ''
        
        if (
            (m = config.MSG.exec(data)) !== null || 
            (m = config.MSG.exec(this.pendingMsg + data)) !== null
        ) {
            topic = m[1]
            sid = m[2]
            msg = substr_utf8_bytes(m.input, m[0].length, +m[5])

            if (encode_utf8(msg).length !== +m[5]) {
                this.pendingMsg += data
                return
            }

            if (m.input === (this.pendingMsg + data)) {
                this.pendingMsg = ''
            }
            this._msgArrived(sid, msg)
            nextMsg = m.input.substr(m[0].length + msg.length + config.CR_LF.length)
        } else if ((m = config.OK.exec(data)) !== null) {
            console.log(m)
            // verbose ok
        } else if ((m = config.ERR.exec(data)) !== null) {
            // error 
        } else if ((m = config.PONG.exec(data)) !== null) {
            // PONG
        } else if ((m = config.PING.exec(data)) !== null) {
            // PING, response PONG
            this.socket.send(config.PONG_RESPONSE)
        } else if ((m = config.INFO.exec(data)) !== null) {
            // INFO, server info
        }
        if (nextMsg !== '') {
            this._onMessage.call(this, nextMsg)
        }
    }

    _onClose () {
        this.emit('close')
    }

    _onError () {
        this.emit('error')
    }

    _msgArrived (sid, msg) {
        const callback = this.subMsgMap[sid] && this.subMsgMap[sid].callback
        if (typeof callback === 'function') callback(msg)
    }
}

Core.Socket = null
Core.setSocket = function (Socket) {
    Core.Socket = Socket
}

export default Core