const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

// Keeps the last known location per socket id so new connections can see existing peers
const latestLocations = new Map();

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            callback(null, true);
        },
        methods: ['GET', 'POST'],
    },
    pingInterval: 10000,
    pingTimeout: 20000,
});

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

io.on('connection', (socket) => {
    console.log('socket connected:', socket.id, 'total:', io.engine.clientsCount);

    // Replay existing peers' last known locations to the newly connected client
    for (const [peerId, coords] of latestLocations.entries()) {
        if (peerId !== socket.id) {
            socket.emit('receive-location', { id: peerId, ...coords });
        }
    }

    socket.on('send-location', function (data) {
        latestLocations.set(socket.id, { latitude: data.latitude, longitude: data.longitude });
        io.emit('receive-location', { id: socket.id, ...data });
        console.log('send-location from', socket.id, data);
    });
    socket.on('disconnect', function () {
        latestLocations.delete(socket.id);
        io.emit('user-disconnected', socket.id);
        console.log('socket disconnected:', socket.id, 'total:', io.engine.clientsCount);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend listening on port ${PORT}`);
});


