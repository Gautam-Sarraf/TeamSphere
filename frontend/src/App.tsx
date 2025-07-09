import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ServerLayout from './components/Server/ServerLayout';
import ChatWindow from './components/Chat/ChatWindow';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/server/:serverId"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <ServerLayout>
                      <div className="no-channel-selected">
                        <h2>Welcome to the server!</h2>
                        <p>Select a channel to start chatting with your team</p>
                      </div>
                    </ServerLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/server/:serverId/channel/:channelId"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <ServerLayout>
                      <ChatWindow />
                    </ServerLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;