# Real-Time Location Tracker

A clean, production-ready, **real-time location tracker** built with **React (Vite)** and **Node.js/Express + Socket.IO**.  
It supports **multiple tabs/clients**, robust **state synchronization**, and **structured server-side logging** of users and coordinates.

---

## 🚀 Features

- Real-time location sharing across connected clients  
- Interactive map powered by **Leaflet**  
- Live updates of all user locations  
- Connection health indicators  
- Responsive design (desktop + mobile)  
- Automatic reconnection on network interruptions  

---

## 🏗️ Architecture

### **Frontend (React + Vite)**
- Custom Hook: `useUserDistances` manages:
  - Initial API fetch  
  - Live socket updates  
  - Retry logic & safety timeouts  
- Component-based screens: `Home` and `PathFinder` with shared Navbar + Toggle  
- Tailwind-ready responsive styling  
- Vite dev server for fast development + optimized builds  

### **Backend (Node.js + Express + Socket.IO)**
- Centralized helper functions for:
  - Distance calculation  
  - Broadcasting updates  
- Config-driven setup for **CORS** and **Socket.IO**  
- Structured logging (connections, locations, distance updates)  
- Full CORS support for both development & production  

---

## ⚙️ Getting Started

### **Prerequisites**
- **Node.js** `v18+` and **npm** `v8+`  
- A modern browser with **Geolocation API support**  

---

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd realTime_tracker
Install backend dependencies

bash
Copy code
cd backend
npm install
Install frontend dependencies

bash
Copy code
cd ../frontend
npm install
Running the Application
1. Start the backend server
Windows (PowerShell):

powershell
Copy code
cd backend; npm run dev
macOS/Linux (Bash):

bash
Copy code
cd backend && npm run dev
Backend runs at: http://localhost:3000

2. Start the frontend dev server
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

🔧 Configuration
Frontend Environment Variables
Create a .env file inside frontend/:

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

Tuned pingInterval, pingTimeout, upgradeTimeout

Dev-friendly CORS config

📂 Project Structure
bash
Copy code
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
🔑 Key Components
Frontend
Home → Landing page displaying distances, counts & connection states

PathFinder → Real-time map view with Socket.IO updates

Routes → Handles /, /home, /pathfinder, and redirects

Hook: useUserDistances → Combines API fetch + live socket + retries

Backend
Socket Events → send-location, disconnect

Helper Functions → calculateDistance, emitDistanceUpdates, broadcastExistingLocations

Logging → Structured connection & location logs

📜 Development Scripts
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

## 👥 Credits
Frontend Development → Vanshika

Backend & Architecture → Lokesh @ NVIAM

## 📌 Important Note
This project is production-ready in its current state.

Potential future enhancements:

A refined, polished UI

A history panel to track past locations

At this stage, the project is intentionally paused.
Anyone interested is welcome to continue building upon it.

Maintained by Lokesh (NVIAM)