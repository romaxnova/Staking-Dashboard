/**
 * Watchlist management utilities for Kiln Explorer
 * Implements localStorage-based persistence for starred validators and integrators
 */

export interface WatchlistItem {
  id: string;
  type: 'validator' | 'integrator';
  name: string;
  address?: string;
  network?: string;
  addedAt: string;
  metadata?: any;
}

const WATCHLIST_KEY = 'kiln_explorer_watchlist';

/**
 * Get all watchlist items from localStorage
 */
export const getWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading watchlist:', error);
    return [];
  }
};

/**
 * Add item to watchlist
 */
export const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>): boolean => {
  try {
    const watchlist = getWatchlist();
    
    // Check if item already exists
    const exists = watchlist.some(w => w.id === item.id && w.type === item.type);
    if (exists) {
      return false; // Item already in watchlist
    }
    
    const newItem: WatchlistItem = {
      ...item,
      addedAt: new Date().toISOString()
    };
    
    watchlist.push(newItem);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

/**
 * Remove item from watchlist
 */
export const removeFromWatchlist = (id: string, type: 'validator' | 'integrator'): boolean => {
  try {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(item => !(item.id === id && item.type === type));
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

/**
 * Check if item is in watchlist
 */
export const isInWatchlist = (id: string, type: 'validator' | 'integrator'): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id && item.type === type);
};

/**
 * Get watchlist items by type
 */
export const getWatchlistByType = (type: 'validator' | 'integrator'): WatchlistItem[] => {
  const watchlist = getWatchlist();
  return watchlist.filter(item => item.type === type);
};

/**
 * Clear entire watchlist
 */
export const clearWatchlist = (): boolean => {
  try {
    localStorage.removeItem(WATCHLIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing watchlist:', error);
    return false;
  }
};

/**
 * Export watchlist to CSV
 */
export const exportWatchlist = () => {
  const watchlist = getWatchlist();
  
  if (watchlist.length === 0) {
    throw new Error('Watchlist is empty');
  }
  
  const csvData = watchlist.map(item => ({
    'Name': item.name,
    'Type': item.type,
    'Address': item.address || 'N/A',
    'Network': item.network || 'N/A',
    'Added Date': new Date(item.addedAt).toLocaleDateString(),
    'Notes': item.metadata?.notes || ''
  }));
  
  // Use the export utility
  import('./exportUtils').then(({ exportToCSV }) => {
    exportToCSV(csvData, 'kiln_watchlist');
  });
};

/**
 * Get watchlist statistics
 */
export const getWatchlistStats = () => {
  const watchlist = getWatchlist();
  
  return {
    total: watchlist.length,
    validators: watchlist.filter(item => item.type === 'validator').length,
    integrators: watchlist.filter(item => item.type === 'integrator').length,
    networks: Array.from(new Set(watchlist.map(item => item.network).filter(Boolean))),
    oldestItem: watchlist.length > 0 ? 
      watchlist.reduce((oldest, item) => 
        new Date(item.addedAt) < new Date(oldest.addedAt) ? item : oldest
      ) : null,
    newestItem: watchlist.length > 0 ? 
      watchlist.reduce((newest, item) => 
        new Date(item.addedAt) > new Date(newest.addedAt) ? item : newest
      ) : null
  };
};

/**
 * Toggle validator in watchlist (add if not present, remove if present)
 */
export const toggleWatchlistValidator = (validatorId: string): string[] => {
  const watchlist = getWatchlist();
  const isCurrentlyWatched = watchlist.some(item => item.id === validatorId && item.type === 'validator');
  
  if (isCurrentlyWatched) {
    removeFromWatchlist(validatorId, 'validator');
  } else {
    addToWatchlist({
      id: validatorId,
      type: 'validator',
      name: `Validator ${validatorId.substring(0, 10)}...`,
      address: validatorId,
      network: 'mainnet'
    });
  }
  
  // Return list of validator IDs for state management
  return getWatchlistByType('validator').map(item => item.id);
};

/**
 * Get list of validator IDs in watchlist
 */
export const getWatchlistValidatorIds = (): string[] => {
  return getWatchlistByType('validator').map(item => item.id);
};
