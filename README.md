# Real-Time Location Tracker

A clean, production-ready, real-time location tracker built with React (Vite) and Node.js/Express + Socket.IO. It supports multiple tabs/clients, robust state sync, and clear server-side logging of users and coordinates.

## ✨ Features

- **Real-time Location Sharing**: Share your location with other connected users
- **Interactive Map**: Built with Leaflet for smooth map interactions
- **Live Updates**: See other users' locations update in real-time
- **Connection Status**: Visual indicators for connection health
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Auto-reconnection**: Handles network interruptions gracefully

## 🏗️ Architecture

The application is built with a clean, modular architecture:

### Frontend (React + Vite)
- **Custom Hook**: `useUserDistances` handles initial fetch, live socket updates, retries, and safety timeouts
- **Component-based**: `Home` and `PathFinder` screens with shared Navbar/Toggle
- **Modern CSS**: Tailwind-ready setup with responsive UI
- **Optimized Build**: Vite dev server and production build

### Backend (Node.js + Express + Socket.IO)
- **Clean Structure**: Central helpers for distance calculation and broadcasting
- **Configuration Management**: Centralized `CONFIG` for CORS and Socket.IO
- **Structured Logging**: Clear logs for connections, locations, and distances
- **CORS Support**: Full CORS configuration for development and production

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd realTime_tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   PowerShell (Windows):
   ```powershell
   cd backend; npm run dev
   ```
   Bash (macOS/Linux):
   ```bash
   cd backend && npm run dev
   ```
   The backend listens at `http://localhost:3000`.

2. **Start the frontend development server**
   PowerShell (Windows):
   ```powershell
   cd frontend; npm run dev
   ```
   Bash (macOS/Linux):
   ```bash
   cd frontend && npm run dev
   ```
   The frontend runs at `http://localhost:5173`.

3. **Open your browser** and navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend Configuration

The backend configuration is centralized in `backend/server.js`:

```javascript
const CONFIG = {
  PORT: process.env.PORT || 3000,
  CORS_OPTIONS: { /* CORS settings */ },
  SOCKET_OPTIONS: { /* Socket.IO settings */ }
};
```

Key Socket.IO options used:
- `transports: ['websocket', 'polling']`
- `pingInterval`, `pingTimeout`, `upgradeTimeout` tuned for dev tunnels
- CORS enabled for development origins

## 📁 Project Structure

```
realTime_tracker/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/Home/
│   │   │   ├── Home.jsx       # Home screen with cards and status
│   │   │   ├── PathFinder.jsx # Map + location sender
│   │   │   ├── Routes.jsx     # App routes
│   │   │   ├── Navbar.jsx     # Top nav
│   │   │   └── ToggleButton.jsx
│   │   ├── hooks/
│   │   │   └── useUserDistances.js # Socket + API sync and state
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # HTML template
└── README.md
```

## 🎯 Key Components

### Frontend Components

- **Home**: Landing page showing distance, counts, and status with robust loading/error states
- **PathFinder**: Map view that publishes your location via Socket.IO
- **Routes**: Handles `/`, `/Home`, `/home`, `/pathfinder`, `/PathFinder` and wildcard redirect
- **Hook `useUserDistances`**:
  - Initial API fetch from `GET /api/user-distances`
  - Subscribes to `distances-updated` + `welcome` socket events
  - Aggressive retries every 1s until data or 10 attempts
  - 15s safety timeout to prevent infinite loading
  - Cleans up timers and socket connections on unmount

### Backend Functions

- **Socket Event Handlers**: `send-location`, `disconnect` with structured logging
- **Helper Functions**: `calculateDistance`, `emitDistanceUpdates`, `broadcastExistingLocations`
- **Configuration Management**: Central `CONFIG` object

### Backend Logging (Console)
- On connect: client id, origin, user-agent, current user lists
- On `send-location`: structured log `{ latitude, longitude }` per user
- On disconnect: removal logs and rebroadcast
- On distances emission: total users, distances count, client totals

## 🛠️ Development

### Available Scripts

#### Backend
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run lint`: Run ESLint

#### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues
- `npm run format`: Format code with Prettier

### Code Quality

The project follows modern JavaScript/React best practices:

- **ESLint**: Code linting and style enforcement
- **Custom Hooks**: Separated concerns for better maintainability
- **Clean Architecture**: Modular, testable code structure
- **Consistent Formatting**: Standardized code style

## 🌐 Deployment

### Backend Deployment

1. Set environment variables (PORT, etc.)
2. Run `npm start` to start the production server
3. Ensure CORS settings match your frontend domain

### Frontend Deployment

1. Run `npm run build` to create production build
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_BACKEND_URL` to point to your production backend

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS settings match your frontend domain
2. **Socket Connection Issues**: Check network connectivity and firewall settings
3. **Windows PowerShell chaining**: Use `;` instead of `&&` when chaining commands (e.g., `cd backend; npm run dev`).
3. **Geolocation Errors**: Ensure HTTPS is used in production (geolocation requirement)

### Debug Mode & Test Utilities

- Backend debug endpoint: `GET http://localhost:3000/debug` (socket count, users, distances)
- Health endpoint: `GET http://localhost:3000/health`
- Test users (debug only): `GET http://localhost:3000/test-users` and `GET /clear-test-users`
- Simple API tester: open `test_api.html` in a browser and click "Test API" to call `GET /api/user-distances`.

Example `test_api.html` location: project root. It fetches the backend API and renders JSON in-page.

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Leaflet**: Open-source mapping library
- **Socket.IO**: Real-time bidirectional communication
- **React**: Modern UI framework
- **Vite**: Fast build tool

---

**Note**: This application requires user permission to access location services. Ensure users grant location access for full functionality.
