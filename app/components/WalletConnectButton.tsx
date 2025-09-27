'use client';

import { useState } from 'react';
import { useHederaWallet } from '../wallet_components/hederaWallet';

export const WalletConnectButton = () => {
  const { wallet, provider, isConnecting, error, connect, disconnect } = useHederaWallet();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const getWalletProviders = () => {
    const providers = [];

    if (typeof window !== 'undefined') {
      if ((window as any).hashpack) {
        providers.push({ name: 'HashPack', icon: '🔷', available: true });
      } else {
        providers.push({ 
          name: 'HashPack', 
          icon: '🔷', 
          available: false,
          installUrl: 'https://www.hashpack.app/download'
        });
      }

      if ((window as any).bladeWallet) {
        providers.push({ name: 'Blade', icon: '⚔️', available: true });
      } else {
        providers.push({ 
          name: 'Blade', 
          icon: '⚔️', 
          available: false,
          installUrl: 'https://bladewallet.io'
        });
      }

      if ((window as any).kabila) {
        providers.push({ name: 'Kabila', icon: '🌊', available: true });
      } else {
        providers.push({ 
          name: 'Kabila', 
          icon: '🌊', 
          available: false,
          installUrl: 'https://kabila.app'
        });
      }
    }

    return providers;
  };

  const handleConnect = async (providerName: string) => {
    await connect(providerName);
    setShowWalletOptions(false);
  };

  if (wallet) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span>{provider?.icon}</span>
          <span className="text-sm font-medium">
            {wallet.accountId.slice(0, 6)}...{wallet.accountId.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWalletOptions(!showWalletOptions)}
        disabled={isConnecting}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showWalletOptions && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-10">
          <div className="space-y-2">
            {getWalletProviders().map((walletProvider) => (
              <div key={walletProvider.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{walletProvider.icon}</span>
                  <span className="font-medium">{walletProvider.name}</span>
                </div>
                {walletProvider.available ? (
                  <button
                    onClick={() => handleConnect(walletProvider.name)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    Connect
                  </button>
                ) : (
                  <a
                    href={(walletProvider as any).installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Install
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};