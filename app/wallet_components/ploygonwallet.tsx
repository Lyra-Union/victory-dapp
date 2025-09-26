"use client";

import { useEffect, useState } from "react";
import ethers from "ethers";

// Polygon wallet selector component
const WalletSelectorComponent = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  // Polygon network configurations
  const POLYGON_MAINNET = {
    chainId: 137,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  };

  const POLYGON_MUMBAI = {
    chainId: 80001,
    chainName: "Polygon Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setSigner(signer);
            setWalletAddress(accounts[0]);
            setChainId(Number(network.chainId));
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          setWalletAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload(); // Reload page on network change
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setWalletAddress(accounts[0]);
      setChainId(Number(network.chainId));

      // Check if user is on Polygon network
      if (Number(network.chainId) !== 137 && Number(network.chainId) !== 80001) {
        await switchToPolygon();
      }

    } catch (error: any) {
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToPolygon = async () => {
    if (!window.ethereum) return;

    try {
      // Try to switch to Polygon Mainnet first
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${POLYGON_MAINNET.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${POLYGON_MAINNET.chainId.toString(16)}`,
                chainName: POLYGON_MAINNET.chainName,
                nativeCurrency: POLYGON_MAINNET.nativeCurrency,
                rpcUrls: POLYGON_MAINNET.rpcUrls,
                blockExplorerUrls: POLYGON_MAINNET.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          setError("Failed to add Polygon network to MetaMask");
        }
      } else {
        setError("Failed to switch to Polygon network");
      }
    }
  };

  const switchToMumbai = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${POLYGON_MUMBAI.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${POLYGON_MUMBAI.chainId.toString(16)}`,
                chainName: POLYGON_MUMBAI.chainName,
                nativeCurrency: POLYGON_MUMBAI.nativeCurrency,
                rpcUrls: POLYGON_MUMBAI.rpcUrls,
                blockExplorerUrls: POLYGON_MUMBAI.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          setError("Failed to add Polygon Mumbai network to MetaMask");
        }
      } else {
        setError("Failed to switch to Polygon Mumbai network");
      }
    }
  };

  const handleDisconnect = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
    setChainId(null);
    setError("");
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 137:
        return "Polygon Mainnet";
      case 80001:
        return "Polygon Mumbai";
      default:
        return "Unknown Network";
    }
  };

  const isPolygonNetwork = chainId === 137 || chainId === 80001;

  return (
    <div className="wallet-selector-container">
      {error && (
        <div className="error-message bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center text-red-300 text-sm">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {walletAddress ? (
        <div className="connected-wallet-info">
          <div className="wallet-details bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="wallet-address">
                <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
                <div className="text-white font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              </div>
              <div className="network-info">
                <div className="text-xs text-gray-400 mb-1">Network</div>
                <div className={`text-sm font-medium ${isPolygonNetwork ? 'text-purple-400' : 'text-red-400'}`}>
                  {getNetworkName(chainId)}
                </div>
              </div>
            </div>

            <div className="wallet-actions flex items-center space-x-2">
              {!isPolygonNetwork && (
                <div className="network-switch-buttons flex space-x-2 flex-1">
                  <button
                    onClick={switchToPolygon}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Switch to Polygon
                  </button>
                  <button
                    onClick={switchToMumbai}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Switch to Mumbai
                  </button>
                </div>
              )}

              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="connect-wallet-section">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="wallet-connect-btn w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🦊</span>
                <span>CONNECT TO POLYGON</span>
              </div>
            )}
          </button>

          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400 mb-2">Supported Networks:</div>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                Polygon Mainnet
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                Polygon Mumbai
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelectorComponent;






{/*"use client";

import { useEffect, useState } from "react";
import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
//import { setupNearSnap } from "@near-wallet-selector/near-snap";
//import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
//import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import "@near-wallet-selector/modal-ui/styles.css";

const WalletSelectorComponent = () => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const initializeSelector = async () => {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [
          setupMyNearWallet(),
          setupHereWallet(),
          setupMeteorWallet(),
          //setupNearSnap(),
          //setupWalletConnect({
            //projectId: "c4f79cc...",
            //metadata: {
              //name: "NEAR Wallet Selector",
              //description: "Example dApp used by NEAR Wallet Selector",
              //url: "https://github.com/near/wallet-selector",
              //icons: ["https://avatars.githubusercontent.com/u/37784886"],
            //},
          //}),
          //setupEthereumWallets({ wagmiConfig, web3Modal }),
        ],
      });

      const modal = setupModal(selector, {
        contractId: "guest-book.testnet",
      });

      setSelector(selector);
      setModal(modal);

      const state = await selector.store.getState();
      if (state.accounts.length > 0) {
        setWalletAddress(state.accounts[0].accountId);
      }
    };

    initializeSelector();
  }, []);

  const handleConnectWallet = () => {
    if (modal) {
      modal.show(); 
    }
  };

  const handleSignOut = async () => {
    if (selector) {
      const wallet = await selector.wallet();
      await wallet.signOut();
      setWalletAddress(null);
    }
  };

  return (
    <div>
      <div className="wallet" onClick={walletAddress ? handleSignOut : handleConnectWallet}>
        {walletAddress ? `Connected to: ${walletAddress}` : "CONNECT TO NEAR"}
      </div>
    </div>
  );
};

export default WalletSelectorComponent;*/}