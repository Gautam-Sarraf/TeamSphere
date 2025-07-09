import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Moon, Sun, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, darkMode, toggleDarkMode } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => window.location.href = '/dashboard'}>
          <MessageCircle size={28} className="brand-icon" />
          <h1>TeamSphere</h1>
        </div>
        
        <div className="navbar-actions">
          <button
            className="navbar-button"
            onClick={toggleDarkMode}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="notification-container">
            <button
              className="navbar-button notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No notifications</p>
                  ) : (
                    notifications.slice(0, 5).map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.avatar}
                alt={user?.username}
                className="user-avatar"
              />
              <span className="user-name">{user?.username}</span>
            </button>
            
            {showDropdown && (
              <div className="user-dropdown">
                <div className="user-info">
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="user-avatar-large"
                  />
                  <div>
                    <p className="user-name-large">{user?.username}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <User size={16} />
                  Profile
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  Settings
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;