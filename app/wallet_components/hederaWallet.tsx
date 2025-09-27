'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {HederaWallet, WalletProvider} from '../types/hedera';

interface HederaWalletContextType {
  wallet: HederaWallet | null;
  provider: WalletProvider | null;
  isConnecting: boolean;
  error: string | null;
  connect: (providerName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  executeTransaction: (transaction: any) => Promise<any>;
}

const HederaWalletContext = createContext<HederaWalletContextType | undefined>(undefined);

// Wallet providers configuration
const getWalletProviders = (): WalletProvider[] => {
  const providers: WalletProvider[] = [];

  // HashPack Wallet
  if (typeof window !== 'undefined' && (window as any).hashpack) {
    providers.push({
      name: 'HashPack',
      icon: '🔷',
      isInstalled: true,
      connect: async () => {
        const hashpack = (window as any).hashpack;
        const data = await hashpack.connectToLocalWallet();
        if (data.success) {
          return {
            accountId: data.accountIds[0],
            publicKey: data.publicKey
          };
        }
        throw new Error('Failed to connect to HashPack');
      },
      disconnect: async () => {
        // HashPack doesn't require explicit disconnect
      },
      executeTransaction: async (transaction) => {
        const hashpack = (window as any).hashpack;
        return await hashpack.sendTransaction(transaction);
      }
    });
  }

  // Blade Wallet
  if (typeof window !== 'undefined' && (window as any).bladeWallet) {
    providers.push({
      name: 'Blade',
      icon: '⚔️',
      isInstalled: true,
      connect: async () => {
        const blade = (window as any).bladeWallet;
        const result = await blade.connectWallet();
        return {
          accountId: result.accountId
        };
      },
      disconnect: async () => {
        const blade = (window as any).bladeWallet;
        await blade.disconnectWallet();
      },
      executeTransaction: async (transaction) => {
        const blade = (window as any).bladeWallet;
        return await blade.sendTransaction(transaction);
      }
    });
  }

  // Kabila Wallet
  if (typeof window !== 'undefined' && (window as any).kabila) {
    providers.push({
      name: 'Kabila',
      icon: '🌊',
      isInstalled: true,
      connect: async () => {
        const kabila = (window as any).kabila;
        const result = await kabila.connect();
        return {
          accountId: result.accountId
        };
      },
      disconnect: async () => {
        const kabila = (window as any).kabila;
        await kabila.disconnect();
      },
      executeTransaction: async (transaction) => {
        const kabila = (window as any).kabila;
        return await kabila.executeTransaction(transaction);
      }
    });
  }

  return providers;
};

export const HederaWalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<HederaWallet | null>(null);
  const [provider, setProvider] = useState<WalletProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing connection on mount
    const savedConnection = localStorage.getItem('hedera-wallet-connection');
    if (savedConnection) {
      const { providerName, accountId } = JSON.parse(savedConnection);
      const providers = getWalletProviders();
      const savedProvider = providers.find(p => p.name === providerName);
      if (savedProvider) {
        setProvider(savedProvider);
        setWallet({ accountId });
      }
    }
  }, []);

  const connect = async (providerName: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const providers = getWalletProviders();
      const selectedProvider = providers.find(p => p.name === providerName);
      
      if (!selectedProvider) {
        throw new Error(`Wallet ${providerName} not found or not installed`);
      }

      const walletData = await selectedProvider.connect();
      
      setWallet(walletData);
      setProvider(selectedProvider);
      
      // Save connection to localStorage
      localStorage.setItem('hedera-wallet-connection', JSON.stringify({
        providerName: selectedProvider.name,
        accountId: walletData.accountId
      }));

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (provider) {
      try {
        await provider.disconnect();
      } catch (err) {
        console.error('Error disconnecting:', err);
      }
    }
    
    setWallet(null);
    setProvider(null);
    localStorage.removeItem('hedera-wallet-connection');
  };

  const executeTransaction = async (transaction: any) => {
    if (!provider) {
      throw new Error('No wallet connected');
    }
    
    return await provider.executeTransaction(transaction);
  };

  return (
    <HederaWalletContext.Provider value={{
      wallet,
      provider,
      isConnecting,
      error,
      connect,
      disconnect,
      executeTransaction
    }}>
      {children}
    </HederaWalletContext.Provider>
  );
};

export const useHederaWallet = () => {
  const context = useContext(HederaWalletContext);
  if (context === undefined) {
    throw new Error('useHederaWallet must be used within a HederaWalletProvider');
  }
  return context;
};