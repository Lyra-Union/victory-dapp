import { connect, keyStores, WalletConnection } from 'near-api-js';
import { Contract } from 'near-api-js/lib/contract';

const nearConfig = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
  contractName: "your-contract.testnet", // Replace CONTRACT NAME
};

async function initNear() {
  const near = await connect(nearConfig);

  const walletConnection = new WalletConnection(near, 'saga-victory-dapp');

  const contract: Contract = new Contract(walletConnection.account(), nearConfig.contractName, {
    viewMethods: [], 
    changeMethods: ['mint'],
    useLocalViewExecution: true, 
  });
  return { walletConnection, contract };
}

interface TokenMetadata {
  title: string;
  description: string;
  governance_role: string;
}

export const mintNFT = async (accountId: string, purchaseAmount: string, metadata: TokenMetadata): Promise<void> => {
  const { walletConnection, contract } = await initNear();

  if (!walletConnection.isSignedIn()) {
    walletConnection.requestSignIn({
      contractId: nearConfig.contractName, 
      methodNames: ['mint'],
      successUrl: window.location.href,
      failureUrl: window.location.href,
    });
    return;
  }

  try {
    const args = {
      account_id: accountId,
      metadata: metadata,
      amount: purchaseAmount,
    };

    await (contract as any).mint(
      args,
      "300000000000000",
      "1"
    );

    console.log("NFT minted successfully");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
};

export { initNear, nearConfig };