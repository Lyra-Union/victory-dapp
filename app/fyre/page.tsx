"use client";

import React, { useState, useEffect, useCallback } from "react";
import Wallet from "../wallet_components/ploygonwallet";
import { ConnectBtn } from "../wallet_components/connectEvm";
import Profile from "../wallet_components/evmWalletProfile";
import { ethers } from "ethers";
import fyreData from "../abi/FyreToken.json";

interface PurchaseHistory {
  date: string;
  amount: string;
  buyer: string;
}

const TokenBody: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [circulatingSupply, setCirculatingSupply] = useState<string>("");
  const [maximumSupply, setMaximumSupply] = useState<string>("");

  const fyreAddress = fyreData.fyreAddress;
  const fyreAbi = fyreData.abi;

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(fyreAddress, fyreAbi, provider);

      const filter = contract.filters.Purchase();
      const events = await contract.queryFilter(filter);

      const history = events.map(event => ({
        date: event.args?.timestamp ? new Date(event.args.timestamp * 1000).toLocaleDateString() : 'N/A',
        amount: event.args?.amount ? `${ethers.utils.formatUnits(event.args.amount, "ether")} FYRE` : 'N/A',
        buyer: event.args?.buyer ?? 'Unknown',
      }));

      setPurchaseHistory(history);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    } finally {
      setLoading(false);
    }
  }, [fyreAddress, fyreAbi]);

  //const fetchTokenStats = useCallback(async () => {
    //try {
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      //const contract = new ethers.Contract(fyreAddress, fyreAbi, provider);

      //const circSupply = await contract.circulatingSupply();
      //const maxSupply = await contract.maximumSupply();

      //setCirculatingSupply(ethers.utils.formatUnits(circSupply, "ether"));
      //setMaximumSupply(ethers.utils.formatUnits(maxSupply, "ether"));
    //} catch (error) {
      //console.error("Error fetching token statistics:", error);
    //}
  //}, [fyreAddress, fyreAbi]);

  useEffect(() => {
    fetchPurchaseHistory();
    //fetchTokenStats();
  }, [fetchPurchaseHistory]); //add fetchTokenStats later

  const handlePurchaseTokens = async () => { 
    try {
      setLoading(true);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress(); 

      const fyreContract = new ethers.Contract(fyreAddress, fyreAbi, signer);
  
      const tx = await fyreContract.mintUncollateralized(account, ethers.utils.parseUnits(purchaseAmount, "ether"));
      
      await tx.wait(); 

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
        <h1 className="text-[#ce711e] text-4xl font-bold mt-10 mb-5">VICTORY EXCHANGE</h1>
        <h2 className="text-[#ce711e] text-5xl font-bold mb-8">SPARK Token</h2>
        <div className="flex justify-center space-x-4">
          <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            <Wallet />
          </div>
          <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            <ConnectBtn />
            <Profile />
          </div>
        </div>
      </header>

      <main className="flex justify-center mt-10">
        <div className="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4 text-center">Purchase SPARK Tokens</h3>
          <label className="mb-2 block text-center">Offering Price: $ per SPARK</label>
          <input
            type="number"
            id="price"
            className="w-full p-2 rounded text-black"
            placeholder="Input Fyre Amount"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
          <button
            onClick={handlePurchaseTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Purchasing..." : "PURCHASE FYRE"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
      
      <main>
        <div className="mt-10">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Purchase History</h3>
          {loading ? (
            <p>Loading purchase history...</p>
          ) : purchaseHistory.length > 0 ? (
            <div className="bg-[#270927] p-4 rounded-lg shadow-md">
              <table className="w-full text-left text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((purchase, index) => (
                    <tr key={index} className="bg-[#3a0f3a]">
                      <td className="border px-4 py-2">{purchase.date}</td>
                      <td className="border px-4 py-2">{purchase.amount}</td>
                      <td className="border px-4 py-2">{purchase.buyer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No purchases made yet.</p>
          )}
        </div>
      </main>

      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">SPARK Token Minting Stats</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">CIRCULATING SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{circulatingSupply} SPARK</div>
            <div className="p-3 text-white font-semibold">MAXIMUM SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{maximumSupply} SPARK</div>
            <div className="p-3 text-white font-semibold">SPARK MINTING SCHEDULE</div>
            <div className="p-3 bg-[#270927] text-white">
              <a href="https://sagahalla.org/approved-projects" className="underline">
                2025 - 2046 [21 Year Schedule]
              </a>
            </div>
          </div>
        </div>
      </main>

      <main className="bg-[#3a0f3a] p-6 rounded-lg shadow-md">
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Real-Time SPARK Prices</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">MARKET PRICE</div>
            <div className="p-3 bg-[#270927] text-white"> BTC</div>
            <div className="p-3 text-white font-semibold">FLOOR PRICE</div>
            <div className="p-3 bg-[#270927] text-white"> BTC</div>
          </div>
        </div>
      </main>

      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Utility & Use Case</h3>
        <p>SPARK tokens can be used to purchase PRISM tokens and contribute AXIS to projects within LyraUnion.</p>
        <p>Convert your SPARK tokens to AXIS tokens. This action represents long term staking in the LyraUnion community, representing a contribution to the LyraUnion cooperative and a decision to join a real cooperative entity in the real world.</p>
        <p>Governance Rights: FYRE tokens are community tokens and do not provide governance rights.</p>

        <div className="flex justify-center space-x-4">
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            PURCHASE PRISM
          </button>
          <button className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            CONTRIBUTE AXIS
          </button>
        </div>
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
