import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paperclip, Send, Smile, Hash, CheckSquare } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import FileUpload from './FileUpload';
import TaskSidebar from './TaskSidebar';
import getSocket from '../../utils/socket';

import './ChatWindow.css';

const ChatWindow: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { currentServer, addMessage } = useApp();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showTaskSidebar, setShowTaskSidebar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentChannel = currentServer?.channels.find(c => c._id === channelId);

  

  // Fetch messages on channel change
  useEffect(() => {
    if (!currentChannel) return;
    fetch(`http://localhost:5000/api/channel/${currentChannel._id}/history`)
      .then(res => res.json())
      .then(data => setMessages(data.map((m: any) => ({ ...m, id: m._id || m.id }))))
      .catch(err => {
        setMessages([]);
        console.error('Failed to fetch messages:', err);
      });
  }, [currentChannel]);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    if (currentChannel) {
      socketInstance.emit('join channel', currentChannel._id);
    }

    // Listen for incoming messages
    socketInstance.on('chat message', (msg: any) => {
      try {
        console.log('[Socket] Received chat message:', msg);
        if (!msg || typeof msg !== 'object') {
          console.error('Received invalid message:', msg);
          return;
        }
        if (!msg.channelId) {
          console.error('Received message without channelId:', msg);
          return;
        }
        if (currentChannel && msg.channelId === currentChannel._id) {
          const normalizedMsg = { ...msg, id: msg._id || msg.id };
          setMessages(prev => [...prev, normalizedMsg]);
        } else {
          console.log('Message for different channel, ignoring:', msg.channelId);
        }
      } catch (err) {
        console.error('Error handling incoming chat message:', err, msg);
      }
    });

    // On cleanup, leave the channel room
    return () => {
      if (currentChannel) {
        socketInstance.emit('leave channel', currentChannel._id);
      }
      socketInstance.off('chat message');
    };
    // eslint-disable-next-line
  }, [currentChannel]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [channelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !currentChannel || !user) return;

    const newMessage = {
      content: message,
      sender: user.id, // Send only the MongoDB id
      channelId: currentChannel._id,
      timestamp: new Date(),
      file: undefined
    };

    // Emit to backend
    if (socket) {
      socket.emit('chat message', newMessage);
    }

    setMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!currentChannel || !user) return;

    const fileMessage = {
      content: `Shared a file: ${file.name}`,
      sender: {
        id: user.id,
        username: user.username,
        avatar: user.avatar || '',
        isOnline: true
      },
      timestamp: new Date(),
      file: {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }
    };

    addMessage(currentChannel._id, fileMessage);
    setShowFileUpload(false);
  };

  if (!currentChannel) {
    return (
      <div className="chat-window">
        <div className="channel-header">
          <Hash size={20} />
          <span>Select a channel</span>
        </div>
        <div className="no-channel">
          <p>Please select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-main">
        <div className="channel-header">
          <Hash size={20} />
          <span>{currentChannel.name}</span>
          <div className="channel-info">
            <button
              className={`task-toggle-btn ${showTaskSidebar ? 'active' : ''}`}
              onClick={() => setShowTaskSidebar(!showTaskSidebar)}
              title="Toggle tasks"
            >
              <CheckSquare size={20} />
            </button>
            <span className="member-count">
              {currentServer?.members.length} members
            </span>
          </div>
        </div>

        <div className="chat-messages">
          <MessageList messages={messages} />
        </div>

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Someone is typing...</span>
          </div>
        )}

        <div className="message-input-container">
          <form onSubmit={handleSendMessage} className="message-form">
            <div className="input-wrapper">
              <button
                type="button"
                className="attachment-btn"
                onClick={() => setShowFileUpload(true)}
                title="Attach file"
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="message-input"
                placeholder={`Message #${currentChannel.name}`}
                maxLength={2000}
              />

              <button
                type="button"
                className="emoji-btn"
                title="Add emoji"
              >
                <Smile size={20} />
              </button>

              <button
                type="submit"
                className="send-btn"
                disabled={!message.trim()}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`chat-content ${showTaskSidebar ? 'with-tasks' : ''}`}>

        {showFileUpload && (
          <FileUpload
            onFileUpload={handleFileUpload}
            onClose={() => setShowFileUpload(false)}
          />
        )}
      </div>

      <TaskSidebar
        channelId={currentChannel._id}
        isOpen={showTaskSidebar}
        onClose={() => setShowTaskSidebar(false)}
      />
    </div>
  );
};

export default ChatWindow;
