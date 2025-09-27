"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  HistoryIcon,
  BarChart3Icon,
  CoinsIcon,
  ArrowUpRightIcon,
} from "lucide-react"
import Wallet from "../wallet_components/ploygonwallet";
import { ConnectBtn } from "../wallet_components/connectEvm";
import Profile from "../wallet_components/evmWalletProfile";
import { ethers } from "ethers";
import fyreData from "../abi/FyreToken.json";
import { HederaWalletProvider } from '../wallet_components/hederaWallet';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { TransactionExample } from '../components/TransactionExample';

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
    <div className="min-h-screen bg-background gradient-bg">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                VICTORY EXCHANGE
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <CoinsIcon className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-semibold text-foreground">SPARK Token</h2>
                <Badge variant="secondary" className="ml-2">
                  Live
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Card className="p-2 card-gradient border-border/50">
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
              </Card>
              <Card className="p-2 card-gradient border-border/50">
                <div className="flex items-center space-x-2">
                  <ConnectBtn />
                  <Profile />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Purchase Card */}
          <Card className="lg:col-span-1 card-gradient border-border/50 glow-effect">
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-2">
                <WalletIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Purchase SPARK</CardTitle>
              </div>
              <CardDescription>Current offering price: $0.00 per SPARK</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount (SPARK)</label>
                <Input
                  type="number"
                  id="price"
                  className="bg-input border-border/50"
                  placeholder="Input Spark Amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
              </div>

              <Button
                onClick={handlePurchaseTokens}
                disabled={loading || !purchaseAmount}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              >
                {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ArrowUpRightIcon className="h-4 w-4" />
                      <span>Purchase SPARK</span>
                    </div>
                  )}
              </Button>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Statistics */}
          <Card className="lg:col-span-2 card-gradient border-border/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3Icon className="h-5 w-5 text-primary" />
                <CardTitle>Token Statistics</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg border border-border/30">
                    <span className="text-sm font-medium text-muted-foreground">Circulating Supply</span>
                    <span className="text-lg font-bold text-foreground">{circulatingSupply || "0"} SPARK</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg border border-border/30">
                    <span className="text-sm font-medium text-muted-foreground">Maximum Supply</span>
                    <span className="text-lg font-bold text-foreground">{maximumSupply || "0"} SPARK</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg border border-border/30">
                    <span className="text-sm font-medium text-muted-foreground">Market Price</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUpIcon className="h-4 w-4 text-success" />
                      <span className="text-lg font-bold text-foreground">-- BTC</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg border border-border/30">
                    <span className="text-sm font-medium text-muted-foreground">Floor Price</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDownIcon className="h-4 w-4 text-warning" />
                      <span className="text-lg font-bold text-foreground">-- BTC</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Minting Schedule</span>
                    <a
                      href="https://sagahalla.org/approved-projects"
                      className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>2025 - 2046 [21 Year Schedule]</span>
                      <ArrowUpRightIcon className="h-3 w-3" />
                    </a>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-gradient border-border/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HistoryIcon className="h-5 w-5 text-primary" />
              <CardTitle>Purchase History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="ml-2 text-muted-foreground">Loading history...</span>
              </div>
            ) : purchaseHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map((purchase, index) => (
                      <tr key={index} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-4 text-foreground">{purchase.date}</td>
                        <td className="py-3 px-4 font-mono text-foreground">{purchase.amount}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground text-sm">{purchase.buyer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <HistoryIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No purchases made yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/50">
          <CardHeader>
            <CardTitle>Utility & Use Cases</CardTitle>
            <CardDescription>Discover what you can do with SPARK tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-accent/30 rounded-lg border border-border/30">
                <h4 className="font-semibold text-foreground mb-2">Token Conversion</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  SPARK tokens can be used to purchase PRISM tokens and contribute AXIS to projects within LyraUnion.
                </p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg border border-border/30">
                <h4 className="font-semibold text-foreground mb-2">Long-term Staking</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert your SPARK tokens to AXIS tokens, representing long-term staking in the LyraUnion community.
                </p>
              </div>
            </div>

            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning font-medium">
                <strong>Governance Notice:</strong> SPARK tokens are community tokens and do not provide governance
                rights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent">
                <CoinsIcon className="h-4 w-4 mr-2" />
                Purchase PRISM
              </Button>
              <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent">
                <ArrowUpRightIcon className="h-4 w-4 mr-2" />
                Contribute AXIS
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      

      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-sm">© 2025 LyraUnion. All rights reserved.</p>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Sign Up
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TokenBody;
