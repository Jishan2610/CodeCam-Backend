// server.js (backend)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});     
io.on('connection', (socket) => {
    console.log('New client connected '+socket);
    socket.on('edit', (content) => {
        io.emit('updateContent', content);
    });

    socket.on('bold', (bold) => {
        io.emit('updateStyleBold', bold);
    })

    socket.on('italic', (italic) => {
        io.emit('updateStyleItalic', italic);
    })

    socket.on('underline', (underline) => {
        io.emit('updateStyleUnderline', underline);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
