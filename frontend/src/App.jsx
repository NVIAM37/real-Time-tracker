import { useEffect, useMemo, useRef } from 'react'
import { io } from 'socket.io-client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const ownLocationRef = useRef(null)

  const socket = useMemo(() => {
    const inferredBackend = `${window.location.protocol}//${window.location.hostname}:3000`
    const backendUrl = import.meta.env.VITE_BACKEND_URL || inferredBackend
    return io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: true,
    })
  }, [])

  useEffect(() => {
    // Ensure default Leaflet marker icons load correctly in bundlers
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    })
    L.Marker.prototype.options.icon = defaultIcon

    if (!mapRef.current) {
      mapRef.current = L.map('map', { zoomControl: true }).setView([0, 0], 16)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'coder7.0',
      }).addTo(mapRef.current)
    }

    const map = mapRef.current
    const markers = markersRef.current

    const metersToLatLngDelta = (meters, atLat) => {
      const dLat = meters / 111320
      const dLng = meters / (111320 * Math.cos((atLat * Math.PI) / 180))
      return { dLat, dLng }
    }

    const maybeJitter = (id, lat, lng) => {
      const own = ownLocationRef.current
      if (!own || id === socket.id) return { lat, lng }
      const latMeters = (lat - own.lat) * 111320
      const lngMeters = (lng - own.lng) * 111320 * Math.cos((own.lat * Math.PI) / 180)
      const distanceMeters = Math.sqrt(latMeters * latMeters + lngMeters * lngMeters)
      if (distanceMeters > 1) return { lat, lng }
      let hash = 0
      for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
      const angle = (hash % 360) * (Math.PI / 180)
      const radius = 2
      const { dLat, dLng } = metersToLatLngDelta(radius, own.lat)
      return {
        lat: lat + Math.sin(angle) * dLat,
        lng: lng + Math.cos(angle) * dLng,
      }
    }

    socket.on('connect', () => {
      console.log('socket connected', socket.id)
    })
    socket.on('connect_error', (err) => {
      console.error('socket connect_error', err)
    })

    socket.on('receive-location', (data) => {
      console.log('receive-location', data)
      const { id, latitude, longitude } = data
      const adjusted = maybeJitter(id, latitude, longitude)
      map.setView([adjusted.lat, adjusted.lng])
      if (markers[id]) {
        markers[id].setLatLng([adjusted.lat, adjusted.lng])
      } else {
        markers[id] = L.marker([adjusted.lat, adjusted.lng]).addTo(map)
      }
    })

    socket.on('user-disconnected', (id) => {
      if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]
      }
    })

    // Emit an immediate location once (helps peers see you right away)
    if (navigator.geolocation?.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          ownLocationRef.current = { lat: latitude, lng: longitude }
          socket.emit('send-location', { latitude, longitude })
        },
        (error) => {
          console.error('getCurrentPosition error', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      )
    }

    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        ownLocationRef.current = { lat: latitude, lng: longitude }
        socket.emit('send-location', { latitude, longitude })
      },
      (error) => {
        console.error(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )

    const handleBeforeUnload = () => {
      try {
        socket.disconnect()
      } catch {
        console.error('Error disconnecting socket')
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      if (watchId && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchId)
      }
      socket.off('connect')
      socket.off('connect_error')
      socket.off('receive-location')
      socket.off('user-disconnected')
      socket.disconnect()
      if (map) {
        map.remove()
        mapRef.current = null
      }
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [socket])

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }} />
  )
}

export default App
