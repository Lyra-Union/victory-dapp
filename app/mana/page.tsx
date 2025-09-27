"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Wallet from "../wallet_components/ploygonwallet"
import { ConnectBtn } from "../wallet_components/connectEvm"
import Profile from "../wallet_components/evmWalletProfile"
import { ethers } from "ethers"
import { connect, keyStores, WalletConnection } from "near-api-js"
//import { SHLD_CONTRACT } from "../shld/shldContractInteractions"; //according to shld_contract file
//import manaData from "../abi/ManaToken.json";
//import fyreData from "../abi/FyreToken.json";
import { HederaWalletProvider } from '../wallet_components/hederaWallet';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { TransactionExample } from '../components/TransactionExample';

interface StakingHistory {
  staker: string
  stakedAmount: string
  stakingDuration: string
  status: string
  manaToReceive: string
}

// Have not add tokenContribution, circulating supply, max supply
const TokenBody: React.FC = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<string>("")
  const [stakingHistory, setStakingHistory] = useState<StakingHistory[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [circulatingSupply, setCirculatingSupply] = useState<string>("")
  const [maximumSupply, setMaximumSupply] = useState<string>("")

  //const manaAddress = manaData.manaAddress;
  //const manaAbi = manaData.abi;

  //const fyreAddress = fyreData.manaAddress;
  //const fyreAbi = fyreData.abi;

  const initNearConnection = async () => {
    const nearConfig = {
      networkId: "default",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.near.org",
    }

    const near = await connect(nearConfig)
    const wallet = new WalletConnection(near, "")
    return wallet
  }

  // Function to check SHLD NFT ownership
  const checkShldNftOwnership = async () => {
    try {
      const wallet = await initNearConnection()

      if (!wallet.isSignedIn()) {
        throw new Error("Please connect your NEAR wallet.")
      }

      const accountId = wallet.getAccountId()

      //const contract = new wallet.account().viewFunction(CONTRACT_NAME, "nft_tokens_for_owner", { account_id: accountId });

      // Please change to a specific SHLD token id
      //const ownsShldNft = contract.some((nft: any) => nft.token_id === "shld_nft_id");

      //return ownsShldNft;
    } catch (error) {
      console.error("Error checking SHLD NFT ownership:", error)
      throw new Error("Unable to check SHLD NFT ownership. Please try again.")
    }
  }

  const fetchStakingHistory = async () => {
    try {
      setLoading(true)

      //setStakingHistory(history);
    } catch (error) {
      console.error("Error fetching staking history:", error)
      setError("Unable to fetch staking history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReturnToken = async () => {
    try {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const account = await signer.getAddress()

      const ownsShldNft = await checkShldNftOwnership()

      //if (!ownsShldNft) {
      //setError("You must own the SHLD NFT to retrieve tokens.");
      //return;
      //}

      //const fyreContract = new ethers.Contract(fyreAddress, fyreAbi, signer);
      //const stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, signer);

      //const fyreBalance = await fyreContract.balanceOf(account);
      //const formattedFyreBalance = ethers.utils.formatUnits(fyreBalance, 18);

      //const stakedAmount = await stakingContract.stakedAmount(account);
      //const stakingStartTime = await stakingContract.stakingStartTime(account);

      //const formattedStakedAmount = ethers.utils.formatUnits(stakedAmount, 18);

      // Calculate total hours staked
      const currentTime = Math.floor(Date.now() / 1000)
      //const stakingDurationInSeconds = currentTime - stakingStartTime;
      //const stakingDurationInHours = Math.floor(stakingDurationInSeconds / 3600);

      //const manaToAward = ethers.utils.parseUnits(stakingDurationInHours.toString(), 18);
      //if (stakingDurationInHours > 0) {
      //  const manaTx = await manaContract.mint(account, manaToAward); // Assumes minting is allowed by the contract
      //  await manaTx.wait();
      //}

      //console.log(`FYRE balance: ${formattedFyreBalance}`);
      //console.log(`Staked amount: ${formattedStakedAmount}`);
      //console.log(`Staked for: ${stakingDurationInHours} hours`);
    } catch (error) {
      console.error("Error retrieving tokens and staking information:", error)
      setError("There was an issue retrieving the staking information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSwapTokens = async () => {
    try {
      setLoading(true)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const account = await signer.getAddress()

      const ownsShldNft = await checkShldNftOwnership()

      //if (!ownsShldNft) {
      //setError("You must own the SHLD NFT to stake tokens.");
      //return;
      //}

      //const fyreContract = new ethers.Contract(fyreAddress, fyreAbi, signer);

      //const stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, signer);

      //const amountToStake = ethers.utils.parseUnits(purchaseAmount, 18);

      //const approvalTx = await fyreContract.approve(stakingContract.address, amountToStake);
      //await approvalTx.wait(); // Wait for approval transaction to complete

      // Stake the tokens by interacting with the staking contract
      //const stakeTx = await stakingContract.stakeTokens(amountToStake);
      //await stakeTx.wait(); // Wait for the staking transaction to complete

      console.log("Tokens staked successfully!")
    } catch (error) {
      console.error("Error staking tokens:", error)
      setError("There was an issue with the staking transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStakingHistory()
  }, [])

  return (
    <div className="bg-[#270927] min-h-screen text-white p-8">
      <header className="text-center mb-13">
        <h1 className="text-[#ce711e] text-4xl font-bold mt-10 mb-5">VICTORY EXCHANGE</h1>
        <h2 className="text-[#ce711e] text-5xl font-bold mb-8">AXIS Token</h2>
        <div className="flex justify-center space-x-4">
          <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
              <HederaWalletProvider>
                               
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Hedera Wallet Connect</h1>
                        <WalletConnectButton />
                    </div>
                                 
                                 {/*<div className="grid gap-8">
                                   <TransactionExample />
                                   
                                   {/* Add more components as needed
                                 </div>*/}
                               
              </HederaWalletProvider>
          </div>
          <div className="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded">
            <ConnectBtn />
            <Profile />
          </div>
        </div>
      </header>

      <main className="flex justify-center mt-10">
        <div className="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4 text-center">Contribute MANA Tokens</h3>
          <label className="mb-2 block text-center">Offering Price: FYRE per MANA</label>
          <input
            type="number"
            id="price"
            className="w-full p-2 rounded text-black"
            placeholder="Input MANA Amount"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
          />
          <button
            onClick={handleSwapTokens}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? "cursor-not-allowed" : ""}`}
          >
            {loading ? "Contributing..." : "FYRE TO MANA CONTRIBUTION"}
          </button>
          <button
            onClick={handleReturnToken}
            disabled={loading}
            className={`bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4 ${loading ? "cursor-not-allowed" : ""}`}
          >
            {loading ? "Retrieving..." : "GET FYRE"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>

      <main>
        <div className="mt-10">
          <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Staking History</h3>
          {loading ? (
            <p>Loading staking history...</p>
          ) : stakingHistory.length > 0 ? (
            <div className="bg-[#270927] p-4 rounded-lg shadow-md">
              <table className="w-full text-left text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Staker</th>
                    <th className="px-4 py-2">Staked SPARK</th>
                    <th className="px-4 py-2">Duration (hours)</th>
                    <th className="px-4 py-2">AXIS to Receive</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stakingHistory.map((staking, index) => (
                    <tr key={index} className="bg-[#3a0f3a]">
                      <td className="border px-4 py-2">{staking.staker}</td>
                      <td className="border px-4 py-2">{staking.stakedAmount}</td>
                      <td className="border px-4 py-2">{staking.stakingDuration}</td>
                      <td className="border px-4 py-2">{staking.manaToReceive}</td>
                      <td className="border px-4 py-2">{staking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No staking history available.</p>
          )}
        </div>
      </main>

      <main>
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">AXIS Token Minting Stats</h3>
        <div className="bg-[#ce711e] rounded overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 text-white font-semibold">CIRCULATING SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{circulatingSupply} AXIS</div>
            <div className="p-3 text-white font-semibold">MAXIMUM SUPPLY</div>
            <div className="p-3 bg-[#270927] text-white">{maximumSupply} AXIS</div>
            <div className="p-3 text-white font-semibold">AXIS MINTING SCHEDULE</div>
            <div className="p-3 bg-[#270927] text-white">
              <a href="https://lyrauniondao.vercel.app/" className="underline">
                2025 - 2046 [21 Year Schedule]
              </a>
            </div>
          </div>
        </div>
      </main>

      <main className="bg-[#3a0f3a] p-6 rounded-lg shadow-md">
        <h3 className="text-[#ce711e] text-3xl font-bold mb-4">Real-Time AXIS Prices</h3>
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
        <p>
          AXIS tokens can be used to contribute to projects within the LyraUnion ecosystem. These contributions
          represent real-world involvement in cooperative initiatives.
        </p>
        <p>
          Convert your SPARK tokens to AXIS tokens. This action represents long term staking in the LyraUnion community,
          representing a contribution to the LyraUnion cooperative and a decision to join a real cooperative entity in
          the real world.
        </p>
        <p>
          Governance Rights: AXIS tokens represent contributions and do not provide governance rights within LyraUnion.
        </p>

        <div className="flex justify-center space-x-4">
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
  )
}

export default TokenBody
