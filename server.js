const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

// Serve static files
app.use(express.static('public'));

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add user to online list
    socket.on('join', (username) => {
        onlineUsers[socket.id] = username;
        io.emit('online users', Object.values(onlineUsers));
        socket.broadcast.emit('chat message', { user: 'System', msg: `${username} joined the chat`, time: getTime() });
    });

    // Listen for messages
    socket.on('chat message', (data) => {
        io.emit('chat message', { user: data.user, msg: data.msg, time: getTime() });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const username = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        io.emit('online users', Object.values(onlineUsers));
        if (username) {
            io.emit('chat message', { user: 'System', msg: `${username} left the chat`, time: getTime() });
        }
    });
});

function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
}

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
