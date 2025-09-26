"use client";

import React, { useState, useEffect, useCallback } from "react";
import Wallet from "../wallet_components/ploygonwallet";
import { ConnectBtn } from "../wallet_components/connectEvm";
import Profile from "../wallet_components/evmWalletProfile";
import { mintNFT, initNear, nearConfig } from "./shldContractInteractions";

const TokenBody = () => {
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nftDescription, setNftDescription] = useState("");
  const [title, setTitle] = useState<string>("");
  const [governanceRole, setGovernanceRole] = useState("");

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { walletConnection } = await initNear();
      
      if (!walletConnection.isSignedIn()) {
        throw new Error("You need to be logged in to view purchase history.");
      }

      const accountId = walletConnection.getAccountId();
      //const history = await walletConnection.account().viewFunction(nearConfig.contractName, "getPurchaseHistory", { account_id: accountId });
      
      console.log("Purchase history:", history);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setError("Failed to fetch purchase history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePurchaseTokens = async () => {
    try {
      setLoading(true);

      const metadata = {
        title,
        description: nftDescription,
        governance_role: governanceRole,
      };

      const { walletConnection } = await initNear();
      const accountId = walletConnection.getAccountId();
      if (!walletConnection.isSignedIn()) {
        walletConnection.requestSignIn({
          contractId: nearConfig.contractName,
          methodNames: ['mint'],
          successUrl: window.location.href,
          failureUrl: window.location.href,
        });
        return;
      }

      await mintNFT(accountId, purchaseAmount, metadata);

      console.log("Tokens purchased successfully!");
      fetchPurchaseHistory(); 
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setError("There was an issue with the transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#270927] min-h-screen text-white p-8">
      <header className="text-center mb-13">
        <h1 className="text-[#ce711e] text-4xl font-bold mt-10 mb-5">
          PRISM Landing Page
        </h1>
        <h2 className="text-[#ce711e] text-5xl font-bold mb-8">
          PRISM Token Landing Page
        </h2>
        <div className="flex justify-center space-x-4">
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            <Wallet />
          </button>
          <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            <ConnectBtn />
            <Profile />
          </div>
        </div>
      </header>

      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Purchase PRISM NFTs</h3>
        <label className="mb-4">Starting Price: {'{SHLD_STARTING_PRICE}'} BTC per NFT</label>

        <div className="mb-4">
          <input
            type="number"
            id="price"
            className="w-full p-2 rounded text-black"
            placeholder="Input SHLD Amount"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
        </div>
        <button
            onClick={handlePurchaseTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Purchasing..." : "PURCHASE SHLD"}
          </button>

        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">PRISM NFT Collections</h3>

        <label className="mb-4">Choose based on these criteria:</label>
        
        <div className="mb-4">
          <label>Title:</label>
          <input
            type="text"
            id="nfttitle"
            className="w-full p-2 rounded text-black"
            placeholder="Enter NFT Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label>Description:</label>
          <input
            type="text"
            id="nftdescription"
            className="w-full p-2 rounded text-black"
            placeholder="Describe your NFT"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label>Job:</label>
          <select
            className="w-full p-2 rounded text-black"
            value={governanceRole}
            onChange={(e) => setGovernanceRole(e.target.value)}
          >
            <option value="">Governance Role</option>
            <option value="creator">Creator</option>
            <option value="patron">Patron</option>
            <option value="content">Content</option>
            <option value="community-supporter">Community Supporter</option>
          </select>
        </div>

        <button
          onClick={handlePurchaseTokens}
          className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded"
        >
          PURCHASE PRISM NFTS
        </button>
      </main>

      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4 mt-5">Utility & Use Case</h3>
        <p>PRISM NFTs serve as **Sovereign IDs** and **authentication tokens** in the SagaHalla ecosystem. They also provide links to **MANA rights** with **Sovereign ID** for governance within the cooperative.</p>
        <p>PRISM NFTs come with an **immutable badge**. The image can only be transferred upon burning the token, while maintaining **MANA and authentication rights**</p>
      </main>

      <footer>
        <div className="flex justify-center space-x-4">
          <p>LyraUnion © 2025</p>
          <p>Sign Up</p>
        </div>
      </footer>
    </div>
  );
};

export default TokenBody;
