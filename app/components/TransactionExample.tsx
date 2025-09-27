'use client';

import { useState } from 'react';
import { useHederaWallet } from '../wallet_components/hederaWallet';

export const TransactionExample = () => {
  const { wallet, executeTransaction } = useHederaWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransacting, setIsTransacting] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);

  const handleSendHBAR = async () => {
    if (!wallet || !recipient || !amount) return;

    setIsTransacting(true);
    setTxResult(null);

    try {
      // Example transaction object - adjust based on your wallet provider's requirements
      const transaction = {
        type: 'HBAR_TRANSFER',
        from: wallet.accountId,
        to: recipient,
        amount: parseFloat(amount) * 100000000, // Convert to tinybars
      };

      const result = await executeTransaction(transaction);
      setTxResult(`Transaction successful! ID: ${result.transactionId || result.id}`);
    } catch (error: any) {
      setTxResult(`Transaction failed: ${error.message}`);
    } finally {
      setIsTransacting(false);
    }
  };

  if (!wallet) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Connect your wallet to send transactions</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Send HBAR</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Account ID</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0.0.123456"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Amount (HBAR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.0"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={handleSendHBAR}
          disabled={!recipient || !amount || isTransacting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTransacting ? 'Sending...' : 'Send HBAR'}
        </button>
        
        {txResult && (
          <div className={`p-3 rounded-lg text-sm ${
            txResult.includes('successful') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {txResult}
          </div>
        )}
      </div>
    </div>
  );
};