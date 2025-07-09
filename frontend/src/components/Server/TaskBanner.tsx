import React, { useState } from 'react';
import { Edit, Save, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import './TaskBanner.css';

const TaskBanner: React.FC = () => {
  const { currentServer, updateTaskBanner } = useApp();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bannerText, setBannerText] = useState(currentServer?.taskBanner || '');

  const handleSave = () => {
    if (currentServer) {
      updateTaskBanner(currentServer.id, bannerText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setBannerText(currentServer?.taskBanner || '');
    setIsEditing(false);
  };

  if (!currentServer?.taskBanner && !isEditing) {
    return null;
  }

  const canEdit = user?.isAdmin || user?.email === 'admin@company.com';

  return (
    <div className="task-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <AlertCircle size={20} />
        </div>
        
        {isEditing ? (
          <div className="banner-edit">
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="banner-input"
              placeholder="Enter task banner message..."
              autoFocus
            />
            <div className="banner-actions">
              <button
                className="btn-icon save"
                onClick={handleSave}
                title="Save"
              >
                <Save size={16} />
              </button>
              <button
                className="btn-icon cancel"
                onClick={handleCancel}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="banner-display">
            <p>{currentServer.taskBanner}</p>
            {canEdit && (
              <button
                className="btn-icon edit"
                onClick={() => setIsEditing(true)}
                title="Edit banner"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBanner;