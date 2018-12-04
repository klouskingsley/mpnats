import * as config from './config'
import {encode_utf8, substr_utf8_bytes} from './bytes'

class Core {

    constructor () {
        this.connectUrl = ''
        this.socket = null
        this.subMsgMap = {}
        this.uid = 0
        this.pendingMsg = ''
    }

    connect ({url}) {
        if (this.socket) {
            throw new Error('Please close it when you want to connect')
        }

        this.connectUrl = url
        this.socket = new Core.Socket({url})
        this.socket.onmessage = this._onMessage.bind(this)
        this.socket.onerror = this._onError.bind(this)
        this.socket.onclose = this._onClose.bind(this)
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
            socket.close()
        }
    }

    subscribe (topic, callback) {
        const sid = ++this.uid
        this.subMsgMap[sid] = {
            sid,
            topic,
            callback
        }
        const msg = [
            config.SUB, topic, sid + config.CR_LF
        ].join(config.SPC)
        this.socket.send(msg)
        return sid
    }

    unsubscribe (sid) {
        if (this.subMsgMap[sid]) {
            this.subMsgMap[sid] = null
            const msg = [
                config.UNSUB, sid + config.CR_LF
            ].join(config.SPC)
            this.socket.send(msg)
        }
    }

    publish (topic, message) {

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
        var nextMsg
        
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
            // 多个消息在一条
            nextMsg = m.input.substr(m[0].length + msg.length + config.CR_LF.length)
            if (nextMsg !== '') {
                this._onMessage.call(this, nextMsg)
            }
        } else if ((m = config.OK.exec(data)) !== null) {
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
    }

    _onClose () {}

    _onError () {}

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