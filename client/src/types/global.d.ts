// Type declarations for wallet extensions and global objects

interface EthereumProvider {
  isMetaMask?: boolean;
  isPhantom?: boolean;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    _originalEthereum?: EthereumProvider;
    phantom?: {
      ethereum?: EthereumProvider;
    };
    solana?: unknown;
  }
}

export {};
