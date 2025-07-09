import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError('');
    
    if (file.size > maxFileSize) {
      setError('File size must be less than 10MB');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported. Please use JPG, PNG, GIF, PDF, or DOCX files.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        <div className="file-upload-header">
          <h3>Upload File</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="file-upload-content">
          {!selectedFile ? (
            <div
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="upload-icon" />
              <p className="drop-text">
                Drag and drop a file here, or click to select
              </p>
              <p className="file-info">
                Supported formats: JPG, PNG, GIF, PDF, DOCX (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="file-input"
              />
            </div>
          ) : (
            <div className="file-selected">
              <div className="file-details">
                <File size={32} className="file-icon" />
                <div className="file-info">
                  <div className="file-name">{selectedFile.name}</div>
                  <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                </div>
              </div>
              <div className="file-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedFile(null)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;