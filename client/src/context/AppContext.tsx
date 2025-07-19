import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type declarations for wallet extensions
declare global {
  interface Window {
    ethereum?: any;
    _originalEthereum?: any;
  }
}

// Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  network: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface AppContextType {
  // Wallet
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Watchlist
  watchlist: string[];
  addToWatchlist: (item: string) => void;
  removeFromWatchlist: (item: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Wallet state
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    network: 'mainnet',
  });

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to KilnPM',
      message: 'Your enhanced staking dashboard is ready!',
      type: 'success',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'New Validator Added',
      message: 'Validator 0x1234...5678 has been successfully added to your watchlist.',
      type: 'info',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      title: 'APY Update',
      message: 'Network APY has increased to 3.42%',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>([
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
  ]);

  // Wallet functions
  const connectWallet = async () => {
    try {
      console.log('Starting wallet connection...');
      
      // Check for wallet extensions safely
      const hasMetaMask = typeof window !== 'undefined' && 
                         (window.ethereum || window._originalEthereum);
      
      if (hasMetaMask) {
        console.log('Wallet extension detected');
        // In a real app, you would use the actual wallet here
        // For now, we'll simulate the connection
      } else {
        console.log('No wallet extension found, using simulation');
      }
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWallet({
        isConnected: true,
        address: '0x742d35Cc6634C0532925a3b8d4B2D8A4f5c4',
        balance: '32.5',
        network: 'mainnet',
      });

      addNotification({
        title: 'Wallet Connected',
        message: 'Successfully connected to wallet',
        type: 'success',
        read: false,
      });
      
      console.log('Wallet connection successful!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      addNotification({
        title: 'Connection Failed',
        message: 'Failed to connect wallet. Please try again.',
        type: 'error',
        read: false,
      });
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      network: 'mainnet',
    });

    addNotification({
      title: 'Wallet Disconnected',
      message: 'Wallet has been disconnected successfully',
      type: 'info',
      read: false,
    });
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Theme functions
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    addNotification({
      title: 'Theme Changed',
      message: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      type: 'info',
      read: false,
    });
  };

  // Watchlist functions
  const addToWatchlist = (item: string) => {
    if (!watchlist.includes(item)) {
      setWatchlist(prev => [...prev, item]);
      addNotification({
        title: 'Added to Watchlist',
        message: `${item.slice(0, 10)}... added to your watchlist`,
        type: 'success',
        read: false,
      });
    }
  };

  const removeFromWatchlist = (item: string) => {
    setWatchlist(prev => prev.filter(w => w !== item));
    addNotification({
      title: 'Removed from Watchlist',
      message: `${item.slice(0, 10)}... removed from your watchlist`,
      type: 'info',
      read: false,
    });
  };

  const contextValue: AppContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
