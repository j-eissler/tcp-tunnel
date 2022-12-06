const program = require('commander')
const Client = require('./client.js')
const Server = require('./server.js')

// Define command line arguments
program.command('client')
    .description('Start the program in client mode')
    .argument('<udp listen port>', 'Receive UDP packets on this port')
    .argument('<tcp forward port>', 'Pack received UDP datagrams into a TCP packet and forward to this port')
    .action((udpListenPort, tcpForwardPort) => HandleClient(udpListenPort, tcpForwardPort))
program.command('server')
    .description('Start the program in server mode')
    .argument('<tcp listen port>', 'Listen for TCP connections on this port')
    .argument('<udp forward port>', 'Unpack UDP datagrams from the received TCP packets and send them here')
    .action((tcpListenPort, udpForwardPort) => HandleServer(tcpListenPort, udpForwardPort));
program.parse();

function HandleClient(udpListenPort, tcpForwardPort) {
    const client = new Client(udpListenPort, tcpForwardPort)
}

function HandleServer(tcpListenPort, udpForwardPort) {
    const server = new Server(tcpListenPort, udpForwardPort)
}
