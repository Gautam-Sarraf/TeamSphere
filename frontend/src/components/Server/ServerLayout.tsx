import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Sidebar from './Sidebar';
import TaskBanner from './TaskBanner';
import MembersList from './MembersList';
import './ServerLayout.css';

interface ServerLayoutProps {
  children: React.ReactNode;
}

const ServerLayout: React.FC<ServerLayoutProps> = ({ children }) => {
  const { serverId } = useParams<{ serverId: string }>();
  const { servers, currentServer, setCurrentServer } = useApp();

  useEffect(() => {
    if (serverId) {
      const server = servers.find(s => s._id === serverId);
      if (server) {
        setCurrentServer(server);
      }
    }
  }, [serverId, servers, setCurrentServer]);

  if (!currentServer) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="server-layout">
      <Sidebar />
      <div className="main-content">
        <TaskBanner />
        <div className="content-area">
          {children}
        </div>
      </div>
      <MembersList />
    </div>
  );
};

export default ServerLayout;