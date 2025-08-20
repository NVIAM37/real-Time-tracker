# RealTime Tracker (Monorepo)

A real-time multi-user location tracker using Socket.IO (backend) and React + Leaflet (frontend).

## Repository layout

```
realTime_tracker/
  backend/      # Express + Socket.IO server
  frontend/     # React + Vite + Leaflet client
  package.json  # Workspace root with helper scripts
```

## Prerequisites
- Node.js: 20.19+ recommended (Vite 7 requires >=20.19 or >=22.12). Node 20.15 works but prints warnings.
- npm: 10+

## Install
You can install per app, or rely on npm workspaces.

- Backend:
```bash
cd backend
npm install
```
- Frontend:
```bash
cd frontend
npm install
```

## Run (development)
Open two terminals from the repository root:
- Backend:
```bash
npm run dev:backend
```
- Frontend:
```bash
npm run dev:frontend
```
- Open http://localhost:5173 and allow geolocation. Open a second tab/window to simulate another user.

## Environment variables
- Backend:
  - FRONTEND_ORIGIN (optional): if set, restricts CORS to this origin.
- Frontend:
  - VITE_BACKEND_URL (optional): backend URL. Defaults to `http://<current-host>:3000`.

## How it works
- Each client watches its geolocation and emits `send-location` with `{ latitude, longitude }`.
- The server broadcasts `receive-location` to all clients with `{ id, latitude, longitude }`, where `id` is the socket id.
- On disconnect, server emits `user-disconnected` with the socket id so clients can remove that marker.
- New connections receive the last known locations of already-connected peers.

Socket events:
- `client → server`: `send-location` `{ latitude, longitude }`
- `server → clients`: `receive-location` `{ id, latitude, longitude }`
- `server → clients`: `user-disconnected` `<socketId>`

## Multi-user across devices
- Ensure all clients use the same host/IP for both frontend and backend.
- For LAN testing, set on the frontend:
```bash
# frontend/.env
VITE_BACKEND_URL=http://<PC-LAN-IP>:3000
```
Then open `http://<PC-LAN-IP>:5173` on each device.
- Browsers only allow geolocation on secure origins (HTTPS) or `http://localhost`. For phones on LAN, use HTTPS (e.g., a tunnel) or test from two tabs on the same machine.

## Troubleshooting
- No markers:
  - Check browser console for `socket connected` and `receive-location` logs.
  - Check server console for `send-location from <id> ...`.
  - Ensure geolocation permission is granted.
  - Ensure all clients use the same base host/IP/port.
  - Check Windows Firewall for ports 3000 and 5173.
- Only one marker when two users are co-located:
  - The frontend applies a tiny, deterministic offset for overlapping users so both pins are visible.

## Production notes
- Build frontend: `cd frontend && npm run build` (outputs `frontend/dist`).
- Serve `dist` via a static web server (Nginx, CDN, etc.).
- Run backend with a process manager (PM2/systemd) and set proper CORS.
- Prefer HTTPS for both frontend and backend in production.

For more, see `backend/README.md` and `frontend/README.md`.



Upcoming Features
1. History Indicator

Runs in the background and records a user’s movement history.

Displays which places or landmarks the user visited and at what time.

Helps in reviewing past locations and travel logs.

2. Path Finder

Saves and visualizes the exact route a user followed.

Stores route data as a sequence of coordinates grouped by timestamp.

Allows users to see which path was taken at a particular time.

3. Velocity Indicator

Shows the speed of movement in realtime.

Useful for analyzing travel behavior, tracking delays, or detecting unusual movements.

4. Ping Feature

Lets users send quick location pings to others.

Example: A user can notify their current position to connected peers instantly.

5. Chat Option

Adds a messaging feature inside the tracker.

Users can communicate directly without leaving the app.

Chat is linked with location context, so users know where the message sender is.

6. Displacement History

Tracks the total displacement (straight-line distance) vs. the actual traveled route.

Provides useful analytics on travel efficiency.

Frontend Design (React)

Each of the above features will have a dedicated page or module in the React frontend:

History Page – Visual timeline + map overlay of visited landmarks and timestamps.

Path Finder Page – Route visualization with stored coordinates grouped by time.

Velocity Indicator Page – Realtime speed graph / dashboard.

Ping & Chat Page – Live chat interface with integrated map pins.

Displacement Page – Summary of total displacement vs. traveled distance.

Backend Development

I (the developer) will be working on backend logic for these features in the next phase.

Socket.IO will still handle realtime connections.

Database schemas will be designed for storing routes, timestamps, velocities, chats, and pings.

APIs will be created to fetch history, displacement, and path data.

💡 Note: If any detail about these features is unclear, feel free to ask me for clarification before proceeding with frontend design 



