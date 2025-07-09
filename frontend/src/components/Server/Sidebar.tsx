import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Hash, Plus, Settings, Volume2, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { currentServer } = useApp();
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();

  const handleChannelClick = (channel: any) => {
    navigate(`/server/${currentServer?.id}/channel/${channel.id}`);
  };

  if (!currentServer) return null;

  return (
    <div className="sidebar">
      <div className="server-header">
        <img
          src={currentServer.logo}
          alt={currentServer.name}
          className="server-logo"
        />
        <div className="server-info">
          <h2>{currentServer.name}</h2>
          <span className="member-count">
            <Users size={14} />
            {currentServer.members.length} members
          </span>
        </div>
        <button className="server-settings-btn">
          <Settings size={16} />
        </button>
      </div>

      <div className="channels-section">
        <div className="section-header">
          <Hash size={16} />
          <span>Text Channels</span>
          <button className="add-channel-btn">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="channels-list">
          {currentServer.channels.map(channel => (
            <button
              key={channel.id}
              className={`channel-item ${channelId === channel.id ? 'active' : ''}`}
              onClick={() => handleChannelClick(channel)}
            >
              <Hash size={16} />
              <span>{channel.name}</span>
              {channel.messages.length > 0 && (
                <span className="message-count">{channel.messages.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="voice-section">
        <div className="section-header">
          <Volume2 size={16} />
          <span>Voice Channels</span>
          <button className="add-channel-btn">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="channels-list">
          <button className="channel-item">
            <Volume2 size={16} />
            <span>General</span>
          </button>
          <button className="channel-item">
            <Volume2 size={16} />
            <span>Team Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;