import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Server {
  _id: string; // MongoDB ObjectId
  name: string;
  logo?: string;
  channels: Channel[];
  members: Member[];
  taskBanner?: string;
}

export interface Channel {
  _id: string; // MongoDB ObjectId
  name: string;
  server: string; // MongoDB ObjectId reference
  messages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  sender: Member;
  timestamp: Date;
  file?: FileAttachment;
}

interface Member {
  _id: string; // MongoDB ObjectId
  id: string; // legacy or for compatibility
  username: string;
  avatar: string;
  isOnline: boolean;
  isAdmin?: boolean;
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Notification {
  id: string;
  type: 'message' | 'file' | 'task';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppContextType {
  servers: Server[];
  currentServer: Server | null;
  currentChannel: Channel | null;
  notifications: Notification[];
  darkMode: boolean;
  setCurrentServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  addMessage: (channelId: string, message: Omit<Message, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  toggleDarkMode: () => void;
  createServer: (name: string, logo: string) => Promise<Server | null>;
  joinServer: (inviteCode: string) => boolean;
  updateTaskBanner: (serverId: string, banner: string) => void;
  addChannel: (serverId: string, name: string) => Promise<Channel | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const { user } = useAuth();

  // Fetch servers from backend on user login
  useEffect(() => {
    const fetchServers = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/servers/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setServers(data);
        }
      } catch (err) {
        console.error('Failed to fetch servers:', err);
      }
    };
    fetchServers();
  }, [user]);

  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to body
  useEffect(() => {
    // Remove any existing theme classes
    document.body.classList.remove('dark-mode', 'light-mode');
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addMessage = (channelId: string, message: Omit<Message, 'id'>) => {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString()
  };

  setServers(prevServers =>
    prevServers.map(server => ({
      ...server,
      channels: server.channels.map(channel =>
        channel._id === channelId
          ? { ...channel, messages: [...(channel.messages || []), newMessage] }
          : channel
      )
    }))
  );

  // Add notification
  addNotification({
    type: 'message',
    title: 'New Message',
    message: `${message.sender.username}: ${message.content}`,
    timestamp: new Date(),
    read: false
  });
};

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const createServer = async (name: string, logo: string): Promise<Server | null> => {
    if (!user) throw new Error('Not authenticated');
    try {
      const res = await fetch('http://localhost:5000/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo, ownerId: user.id })
      });
      if (!res.ok) throw new Error('Failed to create server');
      const data = await res.json();
      return data.server;
    } catch (err) {
      console.error('Create server error:', err);
      return null;
    }
  };

  const joinServer = (): boolean => {
  // Placeholder: always returns false
  return false;
};

  const addChannel = async (serverId: string, name: string): Promise<Channel | null> => {
    if (!user) throw new Error('Not authenticated');
    try {
      const res = await fetch(`http://localhost:5000/api/server/${serverId}/channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to create channel');
      const data = await res.json();
      // Refetch servers after channel creation
      const serversRes = await fetch(`http://localhost:5000/api/servers/${user.id}`);
      if (serversRes.ok) {
        const serversData = await serversRes.json();
        setServers(serversData);
      }
      return data.channel;
    } catch (err) {
      console.error('Create channel error:', err);
      return null;
    }
  };

  const updateTaskBanner = (serverId: string, banner: string) => {
    setServers((prev: Server[]) =>
  prev.map((server: Server) =>
    server._id === serverId
      ? { ...server, taskBanner: banner }
      : server
  )
);
  };

  const value: AppContextType = {
    servers,
    currentServer,
    currentChannel,
    notifications,
    darkMode,
    setCurrentServer,
    setCurrentChannel,
    addMessage,
    addNotification,
    markNotificationAsRead,
    toggleDarkMode,
    createServer,
    joinServer,
    updateTaskBanner,
    addChannel,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };