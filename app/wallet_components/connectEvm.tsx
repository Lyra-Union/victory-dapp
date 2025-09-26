"use client";

import { useEffect, useRef } from "react";
import { useConnectModal, useAccountModal, useChainModal, } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css';

export const ConnectBtn = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (!isConnected) {
    return (
      <button onClick={async () => {
          // Disconnecting wallet first because sometimes when is connected but the user is not connected
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        type="button"  disabled={isConnecting}
      >
        { isConnecting ? 'Connecting...' : 'CONNECT TO EVM' }
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button onClick={openChainModal} type="button">
        WRONG NETWORK
      </button>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex justify-center items-center px-4 py-2 border border-neutral-700 bg-neutral-800/30 rounded-xl font-mono font-bold gap-x-2 cursor-pointer"
        onClick={async () => openAccountModal?.()}>
        <p>Account</p>
      </div>
      <button type="button" onClick={openChainModal}>
        Switch Networks
      </button>
    </div>
  );
};