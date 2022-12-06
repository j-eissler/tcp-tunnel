const net = require('node:net')
const dgram = require('node:dgram')
const log = require('./logging.js')

class Client {
    constructor(udpListenPort = 0, tcpForwardPort = 0) {
        this.udpListenPort = udpListenPort
        this.tcpForwardPort = tcpForwardPort

        log('Starting in client mode')
        this.setupUdpServer()
    }

    setupUdpServer() {
        const udpServer = dgram.createSocket('udp4')
        udpServer.on('listening', () => {
            const address = udpServer.address();
            log(`UDP server listening ${address.address}:${address.port}`);
        })
        udpServer.on('message', (msg, rinfo) => {
            log(`Message received from ${rinfo.address}:${rinfo.port} (UDP)`);

            // Connect to server
            if (!this.tcpConnection) {
                this.tcpConnection = net.createConnection(this.tcpForwardPort, () => {
                    const address = this.tcpConnection.address()
                    log(`Connected to server on ${address.address}:${address.port}`)
                })

                this.tcpConnection.on('data', (buffer) => {
                    const address = this.tcpConnection.address()
                    log(`Answer received from ${address.address}:${address.port} (TCP)`)
                    udpServer.send(buffer, rinfo.port, rinfo.address, (err) => {
                        if (err) {
                            log(`Error while forwarding answer (UDP): ${err}`)
                        } else {
                            log(`Answer forwarded to ${rinfo.address}:${rinfo.port} (UDP)`)
                        }
                    })
                })
                this.tcpConnection.on('timeout', () => {
                    log('TCP connection timed out')
                })
            }
            if (this.tcpConnection) {
                if (this.tcpConnection.readyState == 'open') {
                    this.tcpConnection.write(msg, () => {
                        log(`Message forwarded to ${this.tcpConnection.remoteAddress}:${this.tcpConnection.remotePort} (TCP)`)
                    })
                } else {
                    log('TCP connection is not ready')
                }
            }
        })

        udpServer.bind(this.udpListenPort)
    }
}

module.exports = Client;