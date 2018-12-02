class Core {

    constructor () {
        this.connectUrl = ''
        this.socket = null
    }

    connect ({url}) {
        this.connectUrl = url
        this.socket = new Core.Socket({url})
        return this.socket.connect()
    }

    close () {
        
    }

    subscribe (topic, callback) {
        
    }

    unsubscribe (sid) {

    }

    publish (topic, message) {

    }

    request () {}
    flush () {}
    timeout () {}
}

Core.Socket = null
Core.setSocket (Socket) {
    Core.Socket = Socket
}

export default Core