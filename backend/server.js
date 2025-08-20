const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration for ngrok compatibility
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Keeps the last known location per socket id so new connections can see existing peers
const latestLocations = new Map();

const io = new Server(server, {
    cors: {
        origin: true, // Allow all origins for ngrok compatibility
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    transports: ['websocket', 'polling'], // Support both transports for ngrok
    allowEIO3: true, // Allow Engine.IO v3 clients
    pingInterval: 10000,
    pingTimeout: 20000,
    upgradeTimeout: 30000, // Increased timeout for ngrok
    maxHttpBufferSize: 1e6, // 1MB buffer
});

// Add middleware to log connection attempts
io.use((socket, next) => {
    console.log('Connection attempt from:', socket.handshake.headers.origin || 'unknown origin');
    next();
});

app.get('/health', (req, res) => {
    res.json({ 
        ok: true, 
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount,
        latestLocations: Array.from(latestLocations.keys())
    });
});

// Add a test endpoint for debugging
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
});

io.on('connection', (socket) => {
    console.log('socket connected:', socket.id, 'total:', io.engine.clientsCount);
    console.log('Client origin:', socket.handshake.headers.origin);
    console.log('Client user-agent:', socket.handshake.headers['user-agent']);

    // Replay existing peers' last known locations to the newly connected client
    for (const [peerId, coords] of latestLocations.entries()) {
        if (peerId !== socket.id) {
            socket.emit('receive-location', { id: peerId, ...coords });
        }
    }

    socket.on('send-location', function (data) {
        console.log('send-location from', socket.id, data);
        latestLocations.set(socket.id, { latitude: data.latitude, longitude: data.longitude });
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', function () {
        latestLocations.delete(socket.id);
        io.emit('user-disconnected', socket.id);
        console.log('socket disconnected:', socket.id, 'total:', io.engine.clientsCount);
    });

    // Add error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Error handling for the server
server.on('error', (error) => {
    console.error('Server error:', error);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend listening on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
    console.log(`Test endpoint available at: http://localhost:${PORT}/test`);
});


