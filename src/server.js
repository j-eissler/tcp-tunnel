const net = require('net')
const dgram = require('dgram')
const log = require('./logging.js')

class Server {
    constructor(tcpListenPort, udpForwardPort) {
        this.tcpListenPort = tcpListenPort
        this.udpForwardPort = udpForwardPort

        log("Starting in server mode")
        this.setupTcpServer()
    }

    setupTcpServer() {
        let tcpServer = net.createServer((socket) => {
            const client = socket.address()
            log(`Client connected from ${client.address}:${client.port}`)

            this.tcpSocket = socket

            // Now that a client is connected, open a UDP socket to forward messages to the target application
            this.openUdpSocket(socket)

            socket.on('end', () => {
                log('Client disconnected')
            })
        })
        tcpServer.listen(this.tcpListenPort, () => {
            const address = tcpServer.address()
            log(`TCP server listening on ${address.address}:${address.port}`)
        })
    }

    openUdpSocket(tcpSocket) {
        const tcpClientInfo = tcpSocket.address().address + ':' + tcpSocket.address().port

        // Start UDP client that forwards packets to the UDP application
        let udpSocket = dgram.createSocket('udp4')
        log(`Data will be forwarded to UDP port ${this.udpForwardPort}`)

        // Forward received TCP packets
        tcpSocket.on('data', (buffer) => {
            const msg = buffer.toString().replace(/(\r\n|\n|\r)/gm, '');    // Remove line breaks
            log(`Message received from ${tcpClientInfo} (TCP)`)

            // Forward data via UDP
            const port = this.udpForwardPort
            udpSocket.send(buffer, this.udpForwardPort, '127.0.0.1', function (err) {
                if (err) {
                    log(`Error while forwarding message: ${err}`)
                    udpSocket.close()
                } else {
                    log(`Message forwarded to 127.0.0.1:${port} (UDP)`)
                }
            })
        })

        // Send answers to UDP requests back via TCP
        udpSocket.on('message', (msg, rinfo) => {
            log(`Answer received from ${rinfo.address}:${rinfo.port} (UDP)`)
            tcpSocket.write(msg, () => {
                log(`Answer forwarded to ${tcpClientInfo} (TCP)`)
            })
        })
    }
}

module.exports = Server;