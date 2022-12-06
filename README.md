# tcp-tunnel
This is a small client-server application that lets you send UDP traffic over TCP. Its intended usage is to allow applications that rely on UDP to communicate through an SSH TCP tunnel.

## Example use case
To make the above more clear let's go over an example on how this program can be used. 

We have a client/server application that communicates over UDP. Since the application doesn't support encryption the data is send in clear text.
We want to secure the communication. There is the popular *ssh* command line utility which allows port forwarding (aka. tunneling) however it only works with TCP.

This is where *tcptunnel* comes into play. On the client side it listens for UDP messages and sends them into the TCP tunnel. On the server side it listens for those TCP messages from the tunnel and forwards them via UDP. Answers will be sent in the opposite direction.

## Usage
Listen for UDP data and forward it to a TCP port:
```
tcptunnel client <udp listen port> <tcp forward port>
```
Listen for TCP data and forward it to a UDP port:
```
tcptunnel server <tcp listen port> <udp forward port>
```

## Build
You can build the application yourself using the npm package *pkg*. Install it globally.
```
npm install -g pkg
```

From inside the root directory of the repository you can build the program with one of the following commands.

### Windows
```
pkg .\src\index.js -t node18 -o tcptunnel.exe
```
### Linux
```
pkg src/index.js -t node18 -o tcptunnel
```
