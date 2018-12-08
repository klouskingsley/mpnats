import Socket from './base'
import * as config from '../core/config'

class TestSocket extends Socket {
    connect () {
        return Promise.resolve()
    }

    close () {
        this.emit('close')
        return Promise.resolve()
    }

    send (msg) {
        var m

        if ((m = config.MSG.exec(msg)) != null) {
            console.log(m)
        }
        if ((m = config.PUB)) {

        }
        if (msg.indexOf('UNSUB') === 0) {}

        this.emit('message')
        return Promise.resolve()
    }
}