import React, { useEffect, useRef } from 'react';
import { Download, FileText, Image, Video, Music } from 'lucide-react';
import './MessageList.css';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
  };
  timestamp: Date;
  file?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.startsWith('video/')) return <Video size={16} />;
    if (type.startsWith('audio/')) return <Music size={16} />;
    return <FileText size={16} />;
  };

  const isImageFile = (type: string) => {
    return type.startsWith('image/');
  };

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>Start the conversation!</h3>
          <p>This is the beginning of your chat history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-avatar">
              <img src={message.sender.avatar} alt={message.sender.username} />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="sender-name">{message.sender.username}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-text">
                {message.content}
              </div>
              {message.file && (
                <div className="message-file">
                  {isImageFile(message.file.type) ? (
                    <div className="file-preview">
                      <img src={message.file.url} alt={message.file.name} />
                    </div>
                  ) : (
                    <div className="file-attachment">
                      <div className="file-icon">
                        {getFileIcon(message.file.type)}
                      </div>
                      <div className="file-info">
                        <div className="file-name">{message.file.name}</div>
                        <div className="file-size">{formatFileSize(message.file.size)}</div>
                      </div>
                      <a
                        href={message.file.url}
                        download={message.file.name}
                        className="download-btn"
                        title="Download file"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;