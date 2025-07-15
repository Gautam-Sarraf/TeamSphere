import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings, MessageCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

import { useAuth } from '../../contexts/AuthContext';
import CreateServerModal from './CreateServerModal';
import JoinServerModal from './JoinServerModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { servers, setCurrentServer } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleServerClick = (server: import('../../contexts/AppContext').Server) => {
    setCurrentServer(server);
    navigate(`/server/${server._id}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Select a server to start collaborating with your team</p>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Create Server
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowJoinModal(true)}
        >
          <Users size={20} />
          Join Server
        </button>
      </div>

      <div className="servers-grid">
        {servers.map(server => (
          <div
            key={server._id}
            className="server-card"
            onClick={() => handleServerClick(server)}
          >
            <div className="server-logo">
              <img src={server.logo} alt={server.name} />
            </div>
            <div className="server-info">
              <h3>{server.name}</h3>
              <div className="server-stats">
                <span className="stat">
                  <MessageCircle size={16} />
                  {server.channels.length} channels
                </span>
                <span className="stat">
                  <Users size={16} />
                  {server.members.length} members
                </span>
              </div>
              {server.taskBanner && (
                <div className="server-task-preview">
                  <span className="task-label">Latest:</span>
                  <p>{server.taskBanner}</p>
                </div>
              )}
            </div>
            <button className="server-settings">
              <Settings size={16} />
            </button>
          </div>
        ))}

        {servers.length === 0 && (
          <div className="empty-state">
            <MessageCircle size={48} className="empty-icon" />
            <h3>No servers yet</h3>
            <p>Create your first server or join an existing one to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateServerModal onClose={() => setShowCreateModal(false)} />
      )}

      {showJoinModal && (
        <JoinServerModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;