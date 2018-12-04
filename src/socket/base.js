class Websocket {
    constructor ({url}) {
        this.connected = false
        this.url = url

        this.onmessage = null
        this.offmessage = null
        this.onopen = null
        this.offopen = null
        this.onerror = null
        this.offerror = null
    }

    connect () {

    }

    close () {}

    send () {}
}

export default Websocket
