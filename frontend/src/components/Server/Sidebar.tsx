import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Hash, Plus, Settings, Volume2, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { currentServer, addChannel } = useApp();
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();

  // State for Add Channel modal/input
  const [showAddChannel, setShowAddChannel] = React.useState(false);
  const [newChannelName, setNewChannelName] = React.useState('');
  const [addChannelLoading, setAddChannelLoading] = React.useState(false);
  const [addChannelError, setAddChannelError] = React.useState('');

  const handleChannelClick = (channel: import('../../contexts/AppContext').Channel) => {
    navigate(`/server/${currentServer?._id}/channel/${channel._id}`);
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddChannelError('');
    if (!newChannelName.trim()) {
      setAddChannelError('Channel name is required');
      return;
    }
    setAddChannelLoading(true);
    try {
      const created = await addChannel(currentServer!._id, newChannelName.trim());
      if (created) {
        setShowAddChannel(false);
        setNewChannelName('');
      } else {
        setAddChannelError('Failed to create channel.');
      }
    } catch {
      setAddChannelError('Failed to create channel.');
    } finally {
      setAddChannelLoading(false);
    }
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
          <button className="add-channel-btn" onClick={() => setShowAddChannel(true)}>
              <Plus size={16} />
            </button>
        </div>
        
        {/* Add Channel Modal/Input */}
        {showAddChannel && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add Channel</h3>
                <button className="modal-close" onClick={() => setShowAddChannel(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddChannel} className="modal-form">
                <div className="form-group">
                  <label htmlFor="channel-name" className="form-label">Channel Name</label>
                  <input
                    type="text"
                    id="channel-name"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    className="form-input"
                    placeholder="Enter channel name"
                    required
                  />
                </div>
                {addChannelError && <div className="form-error">{addChannelError}</div>}
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddChannel(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={addChannelLoading}>
                    {addChannelLoading ? 'Creating...' : 'Add Channel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="channels-list">
          {currentServer.channels.map(channel => (
            <button
              key={channel._id}
              className={`channel-item ${channelId === channel._id ? 'active' : ''}`}
              onClick={() => handleChannelClick(channel)}
            >
              <Hash size={16} />
              <span>{channel.name}</span>
              {(channel.messages && channel.messages.length > 0) && (
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