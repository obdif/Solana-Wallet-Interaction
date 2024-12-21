import React, { useState } from 'react';
import { Wallet, ArrowRight, Plus } from 'lucide-react';
import { createNewAccount, transferSol } from './utils/solana';

function App() {
  const [newAccount, setNewAccount] = useState<{ publicKey: string; secretKey: Uint8Array } | null>(null);
  const [phantomWallet, setPhantomWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleCreateAccount = async () => {
    try {
      setLoading('Creating new account and airdropping SOL...');
      setError('');
      setSuccess('');
      const account = await createNewAccount();
      setNewAccount(account);
      setSuccess('New account created and funded with 2 SOL!');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  const connectPhantom = async () => {
    try {
      setLoading('Connecting to Phantom wallet...');
      setError('');
      setSuccess('');

      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet is not installed!');
      }

      const response = await window.solana.connect();
      setPhantomWallet(response.publicKey.toString());
      setSuccess('Successfully connected to Phantom wallet!');
    } catch (err) {
      setError('Failed to connect to Phantom wallet. Please make sure it\'s installed.');
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  const handleTransfer = async () => {
    if (!newAccount || !phantomWallet) {
      setError('Please create an account and connect Phantom wallet first.');
      return;
    }

    try {
      setLoading('Transferring SOL...');
      setError('');
      setSuccess('');
      
      const signature = await transferSol(newAccount.secretKey, phantomWallet);
      setSuccess(`Successfully transferred 1 SOL! Transaction signature: ${signature}`);
    } catch (err) {
      setError('Failed to transfer SOL. Please try again.');
      console.error(err);
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">
            Solana Wallet Interaction
          </h1>
          <h4 className='text-center mb-12 font-bold'>Module 2 Assessment</h4>

          <div className="space-y-8">
            {/* Create Account Button */}
            <div className="bg-purple-800/50 p-6 rounded-lg backdrop-blur-sm">
              <button
                onClick={handleCreateAccount}
                disabled={!!loading}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                <Plus size={20} />
                <span>Create a new Solana account</span>
              </button>
              {newAccount && (
                <div className="mt-4 text-sm break-all">
                  <p className="text-purple-200">Public Key:</p>
                  <p className="font-mono">{newAccount.publicKey}</p>
                </div>
              )}
            </div>

            {/* Connect Phantom Button */}
            <div className="bg-purple-800/50 p-6 rounded-lg backdrop-blur-sm">
              <button
                onClick={connectPhantom}
                disabled={!!loading}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                <Wallet size={20} />
                <span>Connect to Phantom Wallet</span>
              </button>
              {phantomWallet && (
                <div className="mt-4 text-sm break-all">
                  <p className="text-purple-200">Connected Wallet:</p>
                  <p className="font-mono">{phantomWallet}</p>
                </div>
              )}
            </div>

            {/* Transfer Button */}
            <div className="bg-purple-800/50 p-6 rounded-lg backdrop-blur-sm">
              <button
                onClick={handleTransfer}
                disabled={!newAccount || !phantomWallet || !!loading}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                <ArrowRight size={20} />
                <span>Transfer SOL to Phantom Wallet</span>
              </button>
            </div>

            {/* Status Messages */}
            {loading && (
              <div className="text-center text-purple-200 animate-pulse">
                {loading}
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="text-center text-green-400 bg-green-900/20 p-4 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;