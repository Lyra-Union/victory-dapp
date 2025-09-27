export interface HederaWallet {
    accountId: string;
    balance?: string;
    publicKey?: string;
  }
  
  export interface WalletProvider {
    name: string;
    icon: string;
    isInstalled: boolean;
    connect: () => Promise<HederaWallet>;
    disconnect: () => Promise<void>;
    executeTransaction: (transaction: any) => Promise<any>;
  }