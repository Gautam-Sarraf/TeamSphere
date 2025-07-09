import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Server {
  id: string;
  name: string;
  logo: string;
  channels: Channel[];
  members: Member[];
  taskBanner?: string;
}

interface Channel {
  id: string;
  name: string;
  serverId: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: Member;
  timestamp: Date;
  file?: FileAttachment;
}

interface Member {
  id: string;
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
  createServer: (name: string, logo: string) => Server;
  joinServer: (inviteCode: string) => boolean;
  updateTaskBanner: (serverId: string, banner: string) => void;
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
  const [servers, setServers] = useState<Server[]>([
    {
      id: '1',
      name: 'Development Team',
      logo: 'https://ui-avatars.com/api/?name=Dev&background=6366f1&color=fff',
      taskBanner: 'Sprint 2024.1 is live! Please update your task status in the project board.',
      channels: [
        { id: '1', name: 'general', serverId: '1', messages: [] },
        { id: '2', name: 'development', serverId: '1', messages: [] },
        { id: '3', name: 'qa-testing', serverId: '1', messages: [] }
      ],
      members: [
        { id: '1', username: 'john_doe', avatar: 'https://ui-avatars.com/api/?name=John&background=10b981&color=fff', isOnline: true },
        { id: '2', username: 'jane_smith', avatar: 'https://ui-avatars.com/api/?name=Jane&background=f59e0b&color=fff', isOnline: false },
        { id: '3', username: 'mike_wilson', avatar: 'https://ui-avatars.com/api/?name=Mike&background=ef4444&color=fff', isOnline: true }
      ]
    },
    {
      id: '2',
      name: 'Marketing Team',
      logo: 'https://ui-avatars.com/api/?name=Marketing&background=10b981&color=fff',
      taskBanner: 'Q1 Campaign review meeting scheduled for tomorrow at 2 PM.',
      channels: [
        { id: '4', name: 'general', serverId: '2', messages: [] },
        { id: '5', name: 'campaigns', serverId: '2', messages: [] },
        { id: '6', name: 'analytics', serverId: '2', messages: [] }
      ],
      members: [
        { id: '4', username: 'sarah_johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=8b5cf6&color=fff', isOnline: true },
        { id: '5', username: 'david_brown', avatar: 'https://ui-avatars.com/api/?name=David&background=06b6d4&color=fff', isOnline: false }
      ]
    }
  ]);

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
          channel.id === channelId 
            ? { ...channel, messages: [...channel.messages, newMessage] }
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

  const createServer = (name: string, logo: string): Server => {
    const newServer: Server = {
      id: Date.now().toString(),
      name,
      logo,
      channels: [
        { id: `${Date.now()}-1`, name: 'general', serverId: Date.now().toString(), messages: [] }
      ],
      members: [],
      taskBanner: 'Welcome to the new server!'
    };

    setServers(prev => [...prev, newServer]);
    return newServer;
  };

  const joinServer = (inviteCode: string): boolean => {
    // Mock server join logic
    if (inviteCode === 'DEMO123') {
      const demoServer: Server = {
        id: 'demo-server',
        name: 'Demo Server',
        logo: 'https://ui-avatars.com/api/?name=Demo&background=f59e0b&color=fff',
        channels: [
          { id: 'demo-1', name: 'general', serverId: 'demo-server', messages: [] }
        ],
        members: [],
        taskBanner: 'Welcome to the demo server!'
      };

      setServers(prev => [...prev, demoServer]);
      return true;
    }
    return false;
  };

  const updateTaskBanner = (serverId: string, banner: string) => {
    setServers(prev => 
      prev.map(server => 
        server.id === serverId 
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
    updateTaskBanner
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };