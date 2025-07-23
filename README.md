# TeamSphere

**TeamSphere** is a full-stack team collaboration platform with real-time communication features, inspired by platforms like Discord. It enables teams to collaborate effectively through text and voice channels, manage tasks, and streamline communication—all in one place.

---

## 🔧 Technology Stack

### 🖥️ Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v7
- **State Management**: React Context API
- **UI**: Custom components with [Lucide React](https://lucide.dev/icons) icons
- **Real-time**: Socket.IO Client
- **Styling**: CSS Modules
- **Build Tool**: Vite

### 🗄️ Backend
- **Runtime**: Node.js with ES Modules
- **Web Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Security**: bcrypt for password hashing, CORS, environment variables

---

## 📁 Project Structure

### `/frontend/src`
- `assets/`: Static images and icons
- `components/`: Shared reusable components
- `Auth/`: Login and Register components
- `Chat/`: Text chat UI and logic
- `Dashboard/`: Main dashboard interface
- `Landing/`: Public landing page
- `Layout/`: App layout wrappers
- `Server/`: Server and channel management
- `VoiceChannel/`: Voice chat feature
- `contexts/`: App-wide state (AppContext, AuthContext)
- `types/`: TypeScript type declarations
- `utils/`: Utility functions

### `/backend`
- `models/`: Mongoose schemas
  - `User.js`: User model
  - `Server.js`: Team/Server model
  - `Channel.js`: Text/Voice channels
  - `Message.js`: Messages in channels
- `routes/`: API route handlers
- `index.js`: Main server entry point

---

## 🚀 Key Features

### 🔐 User Authentication
- Email and password-based login/registration
- Secure JWT session handling
- Protected frontend routes

### 💬 Servers & Channels
- Create and manage team servers
- Add/manage text and voice channels

### 🔴 Real-Time Messaging
- Real-time chat via WebSocket (Socket.IO)
- Typing indicators, online/offline presence
- Voice channel functionality

### ✅ Task Management
- Create, assign, and track tasks
- Notifications and task updates in real-time

---

## 🔄 Data Flow

1. Users authenticate → receive JWT
2. User's servers/channels are loaded by API
3. Real-time updates handled by Socket.IO
4. React Context handles UI state updates

---

## 📜 Development Scripts

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build production assets
npm run preview   # Preview production build
