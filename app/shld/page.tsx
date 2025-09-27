"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wallet, Shield, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import { HederaWalletProvider } from '../wallet_components/hederaWallet';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { TransactionExample } from '../components/TransactionExample';

// Dynamically import wallet components to prevent SSR issues
const WalletComponent = dynamic(() => import("../wallet_components/ploygonwallet"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading...
    </div>
  ),
})

const ConnectBtn = dynamic(
  () => import("../wallet_components/connectEvm").then((mod) => ({ default: mod.ConnectBtn })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    ),
  },
)

const Profile = dynamic(() => import("../wallet_components/evmWalletProfile"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading...
    </div>
  ),
})

// Dynamically import contract interactions
let mintNFT: any, initNear: any, nearConfig: any
if (typeof window !== "undefined") {
  const contractInteractions = require("../shldContractInteractions")
  mintNFT = contractInteractions.mintNFT
  initNear = contractInteractions.initNear
  nearConfig = contractInteractions.nearConfig
}

const TokenBody = () => {
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [nftDescription, setNftDescription] = useState("")
  const [title, setTitle] = useState<string>("")
  const [governanceRole, setGovernanceRole] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchPurchaseHistory = useCallback(async () => {
    if (!isClient || !initNear) return

    try {
      setLoading(true)
      const { walletConnection } = await initNear()

      if (!walletConnection.isSignedIn()) {
        throw new Error("You need to be logged in to view purchase history.")
      }

      const accountId = walletConnection.getAccountId()
      // Uncomment and implement when ready
      // const history = await walletConnection.account().viewFunction(nearConfig.contractName, "getPurchaseHistory", { account_id: accountId });
      // console.log("Purchase history:", history);
    } catch (error) {
      console.error("Error fetching purchase history:", error)
      setError("Failed to fetch purchase history. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [isClient])

  const handlePurchaseTokens = async () => {
    if (!isClient || !initNear || !mintNFT || !nearConfig) {
      setError("Wallet not initialized. Please refresh the page.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const metadata = {
        title,
        description: nftDescription,
        governance_role: governanceRole,
      }

      const { walletConnection } = await initNear()

      if (!walletConnection.isSignedIn()) {
        walletConnection.requestSignIn({
          contractId: nearConfig.contractName,
          methodNames: ["mint"],
          successUrl: window.location.href,
          failureUrl: window.location.href,
        })
        return
      }

      const accountId = walletConnection.getAccountId()
      await mintNFT(accountId, purchaseAmount, metadata)

      console.log("Tokens purchased successfully!")
      fetchPurchaseHistory()
    } catch (error) {
      console.error("Error purchasing tokens:", error)
      setError("There was an issue with the transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse-glow">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Initializing PRISM</h1>
          <p className="text-muted-foreground">Connecting to blockchain networks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative">
          {/* Navigation */}
          <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">PRISM</span>
                </div>

                <div className="flex items-center space-x-4">
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
                  <div className="flex items-center space-x-2">
                    <ConnectBtn />
                    <Profile />
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  Sovereign Identity • Governance • Authentication
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
                  The Future of
                  <span className="text-primary"> Digital Identity</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  PRISM NFTs serve as Sovereign IDs and authentication tokens in the SagaHalla ecosystem, providing MANA
                  rights and governance capabilities within our decentralized cooperative.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Sovereign Identity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Immutable digital identity with authentication rights that you fully control.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Governance Rights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Participate in cooperative governance with MANA rights and voting power.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Immutable Badge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Transferable image rights while maintaining authentication and MANA privileges.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <Alert className="mb-8 border-destructive/50 text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Purchase SHLD Tokens */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Purchase SHLD Tokens
              </CardTitle>
              <CardDescription>
                Starting Price: <Badge variant="outline">0.001 BTC per NFT</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">SHLD Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount to purchase"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
              </div>

              <Button
                onClick={handlePurchaseTokens}
                disabled={loading || !isClient || !purchaseAmount}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Purchase SHLD
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* NFT Configuration */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Configure Your PRISM NFT</CardTitle>
              <CardDescription>Customize your NFT metadata and governance role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">NFT Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your NFT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe your NFT"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Governance Role</Label>
                <Select value={governanceRole} onValueChange={setGovernanceRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your governance role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="patron">Patron</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="community-supporter">Community Supporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                onClick={handlePurchaseTokens}
                disabled={loading || !isClient || !nftDescription || !governanceRole}
                className="w-full bg-transparent"
                variant="outline"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    Mint PRISM NFT
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Utility Section */}
        <Card className="mt-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Utility & Use Cases</CardTitle>
            <CardDescription className="text-lg">
              Understanding the power of PRISM NFTs in the SagaHalla ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Authentication & Identity
                </h3>
                <p className="text-muted-foreground">
                  PRISM NFTs serve as <strong>Sovereign IDs</strong> and <strong>authentication tokens</strong>
                  in the SagaHalla ecosystem, providing secure, decentralized identity verification.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Governance & Rights
                </h3>
                <p className="text-muted-foreground">
                  Each NFT provides links to <strong>AXIS rights</strong> with <strong>Sovereign ID</strong>
                  for governance within the cooperative, giving you a voice in the ecosystem&apos;s future.
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Immutable Badge System
              </h4>
              <p className="text-sm text-muted-foreground">
                PRISM NFTs feature an <strong>immutable badge</strong> system where the image can only be transferred
                upon burning the token, while maintaining <strong>MANA and authentication rights</strong>
                for maximum flexibility and security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">© 2025 LyraUnion. All rights reserved.</span>
            </div>
            <Button variant="outline" size="sm">
              Sign Up for Updates
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TokenBody;