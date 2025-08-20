# Backend (Express + Socket.IO)

## Scripts
- Dev: `npm run dev`
- Start: `npm start`

## Env
- `PORT` (default 3000)
- `FRONTEND_ORIGIN` (optional) – if set, restrict CORS to this origin.

## API
- `GET /health` → `{ ok: true }`

## Socket events
- Client → Server: `send-location` `{ latitude, longitude }`
- Server → Clients: `receive-location` `{ id, latitude, longitude }`
- Server → Clients: `user-disconnected` `<socketId>`

## Behavior
- Broadcasts every received location to all clients.
- Tracks last known location by socket id and replays to new connections.
- Removes cached location and notifies peers on disconnect.



# Frontend (React + Vite + Leaflet)

## Scripts
- Dev: `npm run dev` (serves on http://localhost:5173)
- Build: `npm run build`
- Preview: `npm run preview`

## Env
- `VITE_BACKEND_URL` (optional): if set, overrides backend URL. Default is `http://<current-host>:3000`.

## Behavior
- Connects to Socket.IO backend.
- Emits current location once (getCurrentPosition) and continuously (watchPosition).
- Renders one marker per socket id. If two users overlap exactly, the peer marker is offset slightly so both remain visible.
- Removes peer markers on `user-disconnected`.

## Notes
- Allow geolocation when prompted.
- For LAN testing, ensure all devices use the same host/IP and set `VITE_BACKEND_URL` appropriately.


## Realtime Tracker – Feature Expansion Plan

Currently, the realtime tracker is working with the basic functionality of showing user locations on the map. The next stage of development will focus on advanced features to improve tracking, analysis, and interactivity.




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


<<<<<<< HEAD
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



=======
>>>>>>> 8898b52 (updating readme)
