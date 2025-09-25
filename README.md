# Real-Time Location Tracker

A clean, production-ready, real-time location tracker built with **React (Vite)** and **Node.js/Express + Socket.IO**.  
It supports multiple tabs/clients, robust state synchronization, and structured server-side logging of users and coordinates.

---

## 📌 Features

- Real-time location sharing across connected clients  
- Interactive map powered by Leaflet  
- Live updates of all user locations  
- Connection health indicators  
- Responsive design for both desktop and mobile  
- Automatic reconnection on network interruptions  

---

## 🏗️ Architecture

### **Frontend (React + Vite)**
- Custom Hook: `useUserDistances` manages initial fetch, live socket updates, retries, and safety timeouts  
- Component-based screens: `Home` and `PathFinder` with a shared Navbar and toggle  
- Tailwind-ready styling with a responsive design  
- Vite dev server for development and optimized builds for production  

### **Backend (Node.js + Express + Socket.IO)**
- Centralized helper functions for distance calculation and broadcasting  
- Configuration-driven setup for CORS and Socket.IO  
- Structured logging for connections, locations, and distance updates  
- Full CORS support for both development and production  

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm 8+  
- A modern browser with geolocation support  

### **Installation**

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd realTime_tracker
Install backend dependencies:

```bash

cd backend
npm install
Install frontend dependencies:

bash
Copy code
cd ../frontend
npm install
Running the Application
Start the backend server

Windows (PowerShell):

powershell
Copy code
cd backend; npm run dev
macOS/Linux (Bash):

bash
Copy code
cd backend && npm run dev
Backend runs at: http://localhost:3000

Start the frontend development server

Windows (PowerShell):

powershell
Copy code
cd frontend; npm run dev
macOS/Linux (Bash):

bash
Copy code
cd frontend && npm run dev
Frontend runs at: http://localhost:5173

Open your browser at: http://localhost:5173

⚙️ Configuration
Frontend Environment Variables
Create a .env file in the frontend directory:

env
Copy code
VITE_BACKEND_URL=http://localhost:3000
Backend Configuration (backend/server.js)
javascript
Copy code
const CONFIG = {
  PORT: process.env.PORT || 3000,
  CORS_OPTIONS: { /* CORS settings */ },
  SOCKET_OPTIONS: { /* Socket.IO settings */ }
};
Key Socket.IO settings:

transports: ['websocket', 'polling']

Tuned pingInterval, pingTimeout, and upgradeTimeout

Development-friendly CORS configuration
```

## 📂 Project Structure
```bash
realTime_tracker/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/Home/
│   │   │   ├── Home.jsx
│   │   │   ├── PathFinder.jsx
│   │   │   ├── Routes.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ToggleButton.jsx
│   │   ├── hooks/useUserDistances.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── index.html
└── README.md
```
🔑 Key Components
## Frontend
Home → Landing page displaying distances, counts & connection states

PathFinder → Real-time map view with Socket.IO updates

Routes → Handles /, /home, /pathfinder, and redirects

Hook: useUserDistances → Combines API fetch + live socket + retries

## Backend
Socket Events → send-location, disconnect

Helper Functions → calculateDistance, emitDistanceUpdates, broadcastExistingLocations

Logging → Structured connection & location logs

## 📜 Development Scripts
Backend
bash
Copy code
npm start       # Start production server
npm run dev     # Start dev server (nodemon)
npm run lint    # Run ESLint
Frontend
bash
Copy code
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview build
npm run lint      # Run ESLint
npm run lint:fix  # Fix lint issues
npm run format    # Format with Prettier
🛠️ Troubleshooting
CORS Errors → Ensure backend CORS matches frontend domain

Socket Issues → Check firewall & network connectivity

Geolocation Errors → Use HTTPS in production (browser requirement)

PowerShell → Use ; instead of && for command chaining

🌍 Browser Support
Chrome 60+

Firefox 55+

Safari 12+

Edge 79+

🤝 Contributing
Fork the repository

Create a feature branch

Follow existing code style

Test thoroughly

Submit a pull request

📄 License
This project is licensed under the ISC License.

## 🙌 Credits
Frontend Development → Vanshika

Backend & Overall Architecture → Lokesh @ NVIAM

## ⚠️ Important Note
This project is production-ready in its current state.
However, future enhancements can be added, such as:

A refined and more polished UI

A history panel to track past locations

At this point, the project is intentionally paused here.
Anyone interested is welcome to continue building upon it.

Maintained by Lokesh (NVIAM)