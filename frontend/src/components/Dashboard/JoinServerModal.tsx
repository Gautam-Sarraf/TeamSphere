import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './Modal.css';

interface JoinServerModalProps {
  onClose: () => void;
}

const JoinServerModal: React.FC<JoinServerModalProps> = ({ onClose }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinServer } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!inviteCode) {
      setError('Please enter an invite code');
      setLoading(false);
      return;
    }

    try {
      const success = joinServer(inviteCode);
      if (success) {
        onClose();
      } else {
        setError('Invalid invite code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to join server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Join Server</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="invite-code" className="form-label">
              Invite Code
            </label>
            <div className="input-wrapper">
              <Users className="input-icon" size={20} />
              <input
                type="text"
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="form-input"
                placeholder="Enter invite code"
                required
              />
            </div>
            <div className="form-help">
              Enter the invite code shared by a server admin
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="demo-section">
            <div className="demo-code">
              <strong>Demo Code:</strong> DEMO123
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinServerModal;