import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Custom hook for managing socket connection
function useSocketConnection() {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [connectionError, setConnectionError] = useState(null);

  const socket = useMemo(() => {
    // Determine backend URL based on environment
    let backendUrl;
    
    if (import.meta.env.VITE_BACKEND_URL) {
      backendUrl = import.meta.env.VITE_BACKEND_URL;
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      backendUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    } else {
      // For ngrok or external access - use same hostname but port 3000
      backendUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    }
    
    console.log('🔌 Connecting to backend at:', backendUrl);
    
    return io(backendUrl, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      forceNew: true,
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log('✅ Socket connected:', socket.id);
      setConnectionStatus('connected');
      setConnectionError(null);
    };
    
    const handleConnectError = (err) => {
      console.error('❌ Socket connection error:', err);
      setConnectionStatus('error');
      setConnectionError(err.message);
    };
    
    const handleDisconnect = (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setConnectionStatus('disconnected');
    };
    
    const handleReconnect = (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setConnectionStatus('connected');
      setConnectionError(null);
    };
    
    const handleReconnectError = (error) => {
      console.error('❌ Socket reconnection error:', error);
      setConnectionStatus('error');
      setConnectionError(error.message);
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);

    // Cleanup function
    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_error', handleReconnectError);
    };
  }, [socket]);

  return { socket, connectionStatus, connectionError };
}

// Custom hook for managing map functionality
function useMapManagement(socket) {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const ownLocationRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Initialize Leaflet map
    initializeMap();
    
    // Set up socket event listeners
    const handleReceiveLocation = (data) => {
      handleLocationUpdate(data);
    };

    const handleUserDisconnected = (userId) => {
      removeUserMarker(userId);
    };

    socket.on('receive-location', handleReceiveLocation);
    socket.on('user-disconnected', handleUserDisconnected);

    // Initialize geolocation
    initializeGeolocation();

    // Cleanup function
    return () => {
      socket.off('receive-location', handleReceiveLocation);
      socket.off('user-disconnected', handleUserDisconnected);
      cleanupMap();
    };
  }, [socket]);

  const initializeMap = () => {
    // Set default Leaflet marker icons
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // Create map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map('map', { zoomControl: true }).setView([0, 0], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'coder7.0',
      }).addTo(mapRef.current);
    }
  };

  const handleLocationUpdate = (data) => {
    const { id, latitude, longitude } = data;
    const adjusted = applyJitterIfNeeded(id, latitude, longitude);
    
    if (mapRef.current) {
      mapRef.current.setView([adjusted.lat, adjusted.lng]);
      
      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([adjusted.lat, adjusted.lng]);
      } else {
        markersRef.current[id] = L.marker([adjusted.lat, adjusted.lng]).addTo(mapRef.current);
      }
    }
  };

  const removeUserMarker = (userId) => {
    if (markersRef.current[userId] && mapRef.current) {
      mapRef.current.removeLayer(markersRef.current[userId]);
      delete markersRef.current[userId];
    }
  };

  const applyJitterIfNeeded = (id, lat, lng) => {
    const own = ownLocationRef.current;
    if (!own || id === socket.id) return { lat, lng };
    
    const latMeters = (lat - own.lat) * 111320;
    const lngMeters = (lng - own.lng) * 111320 * Math.cos((own.lat * Math.PI) / 180);
    const distanceMeters = Math.sqrt(latMeters * latMeters + lngMeters * lngMeters);
    
    if (distanceMeters > 1) return { lat, lng };
    
    // Apply small jitter to prevent overlapping markers
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    
    const angle = (hash % 360) * (Math.PI / 180);
    const radius = 2;
    const dLat = radius / 111320;
    const dLng = radius / (111320 * Math.cos((own.lat * Math.PI) / 180));
    
    return {
      lat: lat + Math.sin(angle) * dLat,
      lng: lng + Math.cos(angle) * dLng,
    };
  };

  const initializeGeolocation = () => {
    if (!navigator.geolocation?.getCurrentPosition) return;

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        ownLocationRef.current = { lat: latitude, lng: longitude };
        socket.emit('send-location', { latitude, longitude });
      },
      (error) => {
        console.error('❌ Error getting initial position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Watch for position changes
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        ownLocationRef.current = { lat: latitude, lng: longitude };
        socket.emit('send-location', { latitude, longitude });
      },
      (error) => {
        console.error('❌ Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Cleanup function for geolocation
    return () => {
      if (navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  };

  const cleanupMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  return { mapRef, markersRef, ownLocationRef };
}

// Connection status indicator component
function ConnectionStatus({ status, error }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'connected':
        return { text: '🟢 Connected', bgColor: '#4CAF50' };
      case 'connecting':
        return { text: '🟡 Connecting...', bgColor: '#2196F3' };
      case 'disconnected':
        return { text: '🟠 Disconnected', bgColor: '#ff9800' };
      case 'error':
        return { text: '🔴 Connection Error', bgColor: '#f44336' };
      default:
        return { text: '🟡 Connecting...', bgColor: '#2196F3' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: statusConfig.bgColor,
        }}
      >
        {statusConfig.text}
      </div>
      
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '10px',
            zIndex: 1000,
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'white',
            backgroundColor: '#f44336',
            maxWidth: '300px',
            wordWrap: 'break-word',
          }}
        >
          Error: {error}
        </div>
      )}
    </>
  );
}

// Main App component
function App() {
  const { socket, connectionStatus, connectionError } = useSocketConnection();
  useMapManagement(socket);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        socket?.disconnect();
      } catch (error) {
        console.error('❌ Error disconnecting socket:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [socket]);

  return (
    <div>
      <ConnectionStatus 
        status={connectionStatus} 
        error={connectionError} 
      />
      <div 
        id="map" 
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
}

export default App;
