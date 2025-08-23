const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Configuration constants
const CONFIG = {
  PORT: process.env.PORT || 3000,
  CORS_OPTIONS: {
    origin: true, // Allow all origins for ngrok compatibility
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  SOCKET_OPTIONS: {
    cors: {
      origin: true,
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
  }
};

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors(CONFIG.CORS_OPTIONS));

// Store latest locations for each connected user
const latestLocations = new Map();

// Initialize Socket.IO server
const io = new Server(server, CONFIG.SOCKET_OPTIONS);

// Socket.IO middleware for logging connection attempts
io.use((socket, next) => {
  const origin = socket.handshake.headers.origin || 'unknown origin';
  console.log(`Connection attempt from: ${origin}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
    activeUsers: Array.from(latestLocations.keys())
  });
});

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  const clientId = socket.id;
  const totalConnections = io.engine.clientsCount;
  
  console.log(`Socket connected: ${clientId} (Total: ${totalConnections})`);
  console.log(`Client origin: ${socket.handshake.headers.origin}`);
  console.log(`Client user-agent: ${socket.handshake.headers['user-agent']}`);

  // Send existing peers' locations to newly connected client
  broadcastExistingLocations(socket);

  // Handle location updates from clients
  socket.on('send-location', (data) => {
    handleLocationUpdate(socket, data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    handleClientDisconnection(socket);
  });

  // Handle socket errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${clientId}:`, error);
  });
});

// Helper function to broadcast existing locations to new clients
function broadcastExistingLocations(socket) {
  for (const [peerId, coordinates] of latestLocations.entries()) {
    if (peerId !== socket.id) {
      socket.emit('receive-location', { 
        id: peerId, 
        latitude: coordinates.latitude, 
        longitude: coordinates.longitude 
      });
    }
  }
}

// Helper function to handle location updates
function handleLocationUpdate(socket, data) {
  const { latitude, longitude } = data;
  const clientId = socket.id;
  
  console.log(`Location update from ${clientId}:`, { latitude, longitude });
  
  // Store the latest location
  latestLocations.set(clientId, { latitude, longitude });
  
  // Broadcast to all connected clients
  io.emit('receive-location', { 
    id: clientId, 
    latitude, 
    longitude 
  });
}

// Helper function to handle client disconnection
function handleClientDisconnection(socket) {
  const clientId = socket.id;
  const totalConnections = io.engine.clientsCount;
  
  // Remove client's location data
  latestLocations.delete(clientId);
  
  // Notify other clients about the disconnection
  io.emit('user-disconnected', clientId);
  
  console.log(`Socket disconnected: ${clientId} (Total: ${totalConnections})`);
}

// Server error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Start the server
server.listen(CONFIG.PORT, '0.0.0.0', () => {
  console.log(`Backend server started successfully!`);
  console.log(`Listening on port: ${CONFIG.PORT}`);
  console.log(`Health check: http://localhost:${CONFIG.PORT}/health`);
  console.log(`Test endpoint: http://localhost:${CONFIG.PORT}/test`);
});


