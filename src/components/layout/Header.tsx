'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/lib/hooks/useWallet';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const { isConnected } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const homeUrl = isConnected ? '/dashboard' : '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={homeUrl} className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">🔥</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              ScorchCore
            </span>
            <span className="text-xs text-gray-400">Protocol</span>
          </div>
        </Link>
        
        {/* Wallet Connection & Dashboard Button */}
        <div className="flex items-center gap-3">
          {isConnected && pathname !== '/dashboard' && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
          )}
          <ConnectButton 
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            chainStatus="icon"
          />
        </div>
      </div>
    </header>
  );
};
