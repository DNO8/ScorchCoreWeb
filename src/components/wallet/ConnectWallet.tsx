'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Wallet, LogOut, ChevronDown, Copy, ExternalLink, Check } from 'lucide-react';

export const ConnectWallet: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '0.00';
    const formatted = Number(value) / Math.pow(10, decimals);
    return formatted.toFixed(4);
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = () => {
    if (!address || !chain) return '#';
    const baseUrl = chain.id === 2020 
      ? 'https://app.roninchain.com/address/' 
      : 'https://saigon-app.roninchain.com/address/';
    return `${baseUrl}${address}`;
  };

  // Not connected - show connect button
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectors(!showConnectors)}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>

        {/* Connector Selection Modal */}
        {showConnectors && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowConnectors(false)} 
            />
            <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
                <p className="text-sm text-gray-400 mt-1">Choose how you want to connect</p>
              </div>
              <div className="p-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector });
                      setShowConnectors(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      {connector.name === 'Ronin Wallet' ? (
                        <span className="text-xl">🦊</span>
                      ) : connector.name === 'Waypoint' ? (
                        <span className="text-xl">🔑</span>
                      ) : (
                        <Wallet className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{connector.name}</p>
                      <p className="text-xs text-gray-400">
                        {connector.name === 'Ronin Wallet' 
                          ? 'Browser extension or mobile app'
                          : connector.name === 'Waypoint'
                          ? 'Email or social login (gasless)'
                          : 'Connect with wallet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Connected - show account info
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
      >
        {/* Chain indicator */}
        <div className={`w-2 h-2 rounded-full ${chain?.id === 2020 ? 'bg-blue-500' : 'bg-yellow-500'}`} />
        
        {/* Balance */}
        <span className="text-white font-medium hidden sm:block">
          {formatBalance(balance?.value)} {balance?.symbol || 'RON'}
        </span>
        
        {/* Address */}
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-900 rounded-md">
          <span className="text-gray-300 text-sm">{formatAddress(address!)}</span>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)} 
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Account Info */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Connected to</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  chain?.id === 2020 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {chain?.name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {address?.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{formatAddress(address!)}</p>
                  <p className="text-sm text-gray-400">
                    {formatBalance(balance?.value)} {balance?.symbol || 'RON'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-300 text-sm">
                  {copied ? 'Copied!' : 'Copy Address'}
                </span>
              </button>
              
              <a
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">View on Explorer</span>
              </a>
              
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
