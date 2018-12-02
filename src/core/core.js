class Core {

    constructor () {
        this.connectUrl = ''
    }

    connect ({url}) {}
    close () {}
    subscribe () {}
    unsubscribe () {}
    publish () {}

    request () {}
    flush () {}
    timeout () {}
}

Core.Socket = null
Core.setSocket (Socket) {
    Core.Socket = Socket
}

export default Core