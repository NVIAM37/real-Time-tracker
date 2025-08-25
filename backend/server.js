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

// Store real connected users (Socket.IO connections)
const connectedUsers = new Map();

// Store test users separately (for debugging only)
const testUsers = new Map();

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to get all user distances (only for real connected users)
function getAllUserDistances() {
  const locations = Array.from(connectedUsers.entries());
  const distances = [];
  
  console.log(`Calculating distances for ${locations.length} real connected users:`, locations.map(([id, coords]) => ({ id, coords })));
  
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const [id1, coords1] = locations[i];
      const [id2, coords2] = locations[j];
      
      const distance = calculateDistance(
        coords1.latitude, coords1.longitude,
        coords2.latitude, coords2.longitude
      );
      
      console.log(`Distance between ${id1.slice(0, 8)} and ${id2.slice(0, 8)}: ${distance.toFixed(2)} km`);
      
      distances.push({
        user1: id1,
        user2: id2,
        distance: distance.toFixed(2)
      });
    }
  }
  
  console.log(`Total distances calculated: ${distances.length}`);
  return distances;
}

// Helper function to get real connected user count
function getRealUserCount() {
  return connectedUsers.size;
}

// Helper function to check if there are real connections
function hasRealConnections() {
  return connectedUsers.size > 0;
}

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
    realConnectedUsers: Array.from(connectedUsers.keys()),
    testUsers: Array.from(testUsers.keys()),
    realUserCount: getRealUserCount(),
    testUserCount: testUsers.size,
    hasRealConnections: hasRealConnections()
  });
});

// Real-time clock endpoint
app.get('/api/current-time', (req, res) => {
  const now = new Date();
  res.json({
    time: {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds()
    },
    date: {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      weekday: now.getDay(),
      weekdayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
      monthName: now.toLocaleDateString('en-US', { month: 'long' })
    },
    timestamp: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    greeting: getGreeting(now.getHours())
  });
});

// Helper function to get greeting based on time
function getGreeting(hours) {
  if (hours < 12) return 'Good Morning';
  if (hours < 17) return 'Good Afternoon';
  if (hours < 21) return 'Good Evening';
  return 'Good Night';
}

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to simulate multiple users
app.get('/test-users', (req, res) => {
  // Clear any existing test users first
  testUsers.clear();
  
  // Simulate adding test users for debugging (these won't affect real user counts)
  const testUserData = [
    { id: 'test-user-1', lat: 40.7128, lng: -74.0060 }, // New York
    { id: 'test-user-2', lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { id: 'test-user-3', lat: 41.8781, lng: -87.6298 }  // Chicago
  ];
  
  testUserData.forEach(user => {
    testUsers.set(user.id, { 
      latitude: user.lat, 
      longitude: user.lng 
    });
  });
  
  // Calculate distances between test users only
  const testDistances = [];
  const testUserArray = Array.from(testUsers.entries());
  
  for (let i = 0; i < testUserArray.length; i++) {
    for (let j = i + 1; j < testUserArray.length; j++) {
      const [id1, coords1] = testUserArray[i];
      const [id2, coords2] = testUserArray[j];
      
      const distance = calculateDistance(
        coords1.latitude, coords1.longitude,
        coords2.latitude, coords2.longitude
      );
      
      testDistances.push({
        user1: id1,
        user2: id2,
        distance: distance.toFixed(2)
      });
    }
  }
  
  res.json({
    message: 'Test users added (for debugging only - do not affect real user counts)',
    testUsers: Array.from(testUsers.entries()).map(([id, coords]) => ({ id, coords })),
    testDistances,
    realConnectedUsers: getRealUserCount(),
    hasRealConnections: hasRealConnections(),
    timestamp: new Date().toISOString()
  });
});

// Clear test users endpoint
app.get('/clear-test-users', (req, res) => {
  testUsers.clear();
  res.json({
    message: 'Test users cleared',
    realConnectedUsers: getRealUserCount(),
    hasRealConnections: hasRealConnections(),
    timestamp: new Date().toISOString()
  });
});

// User distances API endpoint
app.get('/api/user-distances', (req, res) => {
  try {
    const distances = getAllUserDistances();
    const totalUsers = getRealUserCount();
    const hasConnections = hasRealConnections();
    
    console.log(`API request - Real users: ${totalUsers}, Has connections: ${hasConnections}, Distances: ${distances.length}`);
    
    res.json({
      distances,
      totalUsers,
      hasConnections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting user distances:', error);
    res.status(500).json({
      error: 'Failed to get user distances',
      distances: [],
      totalUsers: 0,
      hasConnections: false
    });
  }
});

// Debug endpoint to see current state
app.get('/debug', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount,
    realConnectedUsers: {
      count: getRealUserCount(),
      users: Array.from(connectedUsers.entries()).map(([id, coords]) => ({ id, coords }))
    },
    testUsers: {
      count: testUsers.size,
      users: Array.from(testUsers.entries()).map(([id, coords]) => ({ id, coords }))
    },
    legacyLocations: {
      count: latestLocations.size,
      users: Array.from(latestLocations.entries()).map(([id, coords]) => ({ id, coords }))
    },
    distances: getAllUserDistances(),
    hasRealConnections: hasRealConnections()
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  const clientId = socket.id;
  const totalConnections = io.engine.clientsCount;
  const tabId = Date.now(); // Unique ID for each connection
  
  console.log(`[Tab ${tabId}] Socket connected: ${clientId} (Total: ${totalConnections})`);
  console.log(`[Tab ${tabId}] Client origin: ${socket.handshake.headers.origin}`);
  console.log(`[Tab ${tabId}] Client user-agent: ${socket.handshake.headers['user-agent']}`);
  console.log(`[Tab ${tabId}] Current real connected users: ${Array.from(connectedUsers.keys())}`);
  console.log(`[Tab ${tabId}] Current test users: ${Array.from(testUsers.keys())}`);
  console.log(`[Tab ${tabId}] All socket connections: ${Array.from(io.sockets.sockets.keys())}`);

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
    console.error(`[Tab ${tabId}] Socket error for ${clientId}:`, error);
  });
});

// Helper function to broadcast existing locations to new clients
function broadcastExistingLocations(socket) {
  console.log(`[Backend] Broadcasting existing locations to new client ${socket.id}`);
  
  for (const [peerId, coordinates] of connectedUsers.entries()) {
    if (peerId !== socket.id) {
      console.log(`[Backend] Sending location of ${peerId.slice(0, 8)} to new client`);
      socket.emit('receive-location', { 
        id: peerId, 
        latitude: coordinates.latitude, 
        longitude: coordinates.longitude 
      });
    }
  }
  
  // Emit updated distances to all clients (including the new one)
  emitDistanceUpdates();
  
  // Also send a welcome message to the new client
  socket.emit('welcome', {
    message: 'Connected to real-time tracker',
    totalUsers: getRealUserCount(),
    hasConnections: hasRealConnections(),
    timestamp: new Date().toISOString()
  });
}

// Helper function to handle location updates
function handleLocationUpdate(socket, data) {
  const { latitude, longitude } = data;
  const clientId = socket.id;
  
  console.log(`Location update from ${clientId}:`, { latitude, longitude });
  
  // Store the latest location for this real connected user
  connectedUsers.set(clientId, { latitude, longitude });
  
  // Also keep the legacy latestLocations for backward compatibility
  latestLocations.set(clientId, { latitude, longitude });
  
  // Broadcast to all connected clients
  io.emit('receive-location', { 
    id: clientId, 
    latitude, 
    longitude 
  });
  
  // Emit updated distances to all clients
  emitDistanceUpdates();
}

// Helper function to handle client disconnection
function handleClientDisconnection(socket) {
  const clientId = socket.id;
  const totalConnections = io.engine.clientsCount;
  const tabId = Date.now(); // Unique ID for disconnection
  
  console.log(`[Tab ${tabId}] Socket disconnecting: ${clientId} (Total: ${totalConnections})`);
  
  // Remove client's location data
  latestLocations.delete(clientId);
  connectedUsers.delete(clientId); // Also remove from connectedUsers
  
  console.log(`[Tab ${tabId}] After removal - Real users: ${Array.from(connectedUsers.keys())}`);
  console.log(`[Tab ${tabId}] After removal - Legacy locations: ${Array.from(latestLocations.keys())}`);
  
  // Notify other clients about the disconnection
  io.emit('user-disconnected', clientId);
  
  // Emit updated distances to all clients
  emitDistanceUpdates();
  
  console.log(`[Tab ${tabId}] Socket disconnected: ${clientId} (Total: ${totalConnections})`);
}

// Helper function to emit distance updates to all clients
function emitDistanceUpdates() {
  const distances = getAllUserDistances();
  const totalUsers = getRealUserCount();
  const hasConnections = hasRealConnections();
  
  console.log(`[Backend] Emitting distance updates to all clients:`, {
    totalUsers,
    hasConnections,
    distancesCount: distances.length,
    distances,
    realUsers: Array.from(connectedUsers.keys()),
    totalClients: io.engine.clientsCount
  });
  
  const updateData = {
    distances,
    totalUsers,
    hasConnections,
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to all connected clients
  io.emit('distances-updated', updateData);
  
  console.log(`[Backend] Distance update broadcasted to ${io.engine.clientsCount} clients`);
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


