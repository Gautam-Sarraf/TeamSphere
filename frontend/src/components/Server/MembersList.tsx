import React from 'react';
import { Crown, Circle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './MembersList.css';

const MembersList: React.FC = () => {
  const { currentServer } = useApp();

  if (!currentServer) return null;

  const onlineMembers = currentServer.members.filter(member => member.isOnline);
  const offlineMembers = currentServer.members.filter(member => !member.isOnline);

  return (
    <div className="members-list">
      <div className="members-header">
        <h3>Members — {currentServer.members.length}</h3>
      </div>

      {onlineMembers.length > 0 && (
        <div className="member-section">
          <div className="section-title">
            Online — {onlineMembers.length}
          </div>
          {onlineMembers.map(member => (
            <div key={member._id} className="member-item">
              <div className="member-avatar">
                <img src={member.avatar} alt={member.username} />
                <div className="status-indicator online">
                  <Circle size={12} />
                </div>
              </div>
              <div className="member-info">
                <span className="member-name">{member.username}</span>
                {member.isAdmin && (
                  <Crown size={12} className="admin-badge" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {offlineMembers.length > 0 && (
        <div className="member-section">
          <div className="section-title">
            Offline — {offlineMembers.length}
          </div>
          {offlineMembers.map(member => (
            <div key={member._id} className="member-item offline">
              <div className="member-avatar">
                <img src={member.avatar} alt={member.username} />
                <div className="status-indicator offline">
                  <Circle size={12} />
                </div>
              </div>
              <div className="member-info">
                <span className="member-name">{member.username}</span>
                {member.isAdmin && (
                  <Crown size={12} className="admin-badge" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentServer.members.length === 0 && (
        <div className="empty-members">
          <p>No members in this server yet</p>
        </div>
      )}
    </div>
  );
};

export default MembersList;