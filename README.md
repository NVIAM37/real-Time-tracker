# Real-Time Location Tracker

A modern, real-time location tracking application built with React, Socket.IO, and Leaflet maps. This application allows multiple users to share their real-time locations on an interactive map.

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
- **Custom Hooks**: Separated concerns with `useSocketConnection` and `useMapManagement`
- **Component-based**: Modular React components for better maintainability
- **Modern CSS**: Enhanced styling with responsive design and accessibility features
- **Optimized Build**: Vite configuration with code splitting and optimizations

### Backend (Node.js + Express + Socket.IO)
- **Clean Structure**: Well-organized server code with helper functions
- **Configuration Management**: Centralized configuration constants
- **Error Handling**: Comprehensive error handling and logging
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
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

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

## 📁 Project Structure

```
realTime_tracker/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── App.css        # Application styles
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Application entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # HTML template
└── README.md
```

## 🎯 Key Components

### Frontend Components

- **App**: Main application component
- **ConnectionStatus**: Displays connection health and errors
- **Custom Hooks**:
  - `useSocketConnection`: Manages Socket.IO connection state
  - `useMapManagement`: Handles map initialization and updates

### Backend Functions

- **Socket Event Handlers**: Manage real-time communication
- **Helper Functions**: Clean, reusable utility functions
- **Configuration Management**: Centralized settings

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
3. **Geolocation Errors**: Ensure HTTPS is used in production (geolocation requirement)

### Debug Mode

Enable debug logging by checking the browser console and backend terminal for detailed connection information.

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
