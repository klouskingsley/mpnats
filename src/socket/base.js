import EventEmitter from '../core/event-emitter'

class Websocket extends EventEmitter {
    constructor ({url}) {
        super()
        this.connected = false
        this.url = url
    }

    connect () {}

    close () {}

    send () {}
}

export default Websocket
