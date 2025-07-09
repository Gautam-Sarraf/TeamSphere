import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './Modal.css';

interface CreateServerModalProps {
  onClose: () => void;
}

const CreateServerModal: React.FC<CreateServerModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createServer } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name) {
      setError('Please enter a server name');
      setLoading(false);
      return;
    }

    try {
      const serverLogo = logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
      createServer(name, serverLogo);
      onClose();
    } catch (err) {
      setError('Failed to create server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create Server</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="server-name" className="form-label">
              Server Name
            </label>
            <input
              type="text"
              id="server-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter server name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="server-logo" className="form-label">
              Logo URL (optional)
            </label>
            <input
              type="url"
              id="server-logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="form-input"
              placeholder="https://example.com/logo.png"
            />
            <div className="form-help">
              Leave empty to generate a logo automatically
            </div>
          </div>

          {logo && (
            <div className="logo-preview">
              <img src={logo} alt="Server logo preview" />
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

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
              {loading ? 'Creating...' : 'Create Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServerModal;