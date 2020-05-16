const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server);

const { Join, UserJoinTheChat, MessageDetection, Message,
    Disconnected, UserDisconnected} = require('./Events')

app.get('/', (req, res) => {
    res.send('Up and running')
})



io.on('connection', (socket) => {
    console.log("user connected")

    socket.on(Join, (nickName) => {
        console.log(nickName + " : has joined the chat")
        socket.broadcast.emit(UserJoinTheChat, nickName + " : has joined the chat")
    })

    socket.on(MessageDetection, (nickName, messageContent) => {
        console.log(nickName + " : " + messageContent)

        let m = { 'message': messageContent, 'nickName': nickName}

        io.emit(Message, m)
    })

    socket.on(Disconnected, () => {
        console.log('user has left')

        socket.broadcast.emit(UserDisconnected, 'user has left')
    })
})

const port = process.env.PORT
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})