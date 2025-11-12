import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Ronin Mainnet Chain
export const ronin = defineChain({
  id: 2020,
  name: 'Ronin',
  network: 'ronin',
  nativeCurrency: {
    decimals: 18,
    name: 'RON',
    symbol: 'RON',
  },
  rpcUrls: {
    default: {
      http: ['https://api.roninchain.com/rpc'],
    },
    public: {
      http: ['https://api.roninchain.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ronin Explorer',
      url: 'https://app.roninchain.com',
    },
  },
  contracts: {
    // Add ScorchCore contracts here when deployed
  },
});

// Ronin Saigon Testnet
export const roninTestnet = defineChain({
  id: 2021,
  name: 'Ronin Testnet',
  network: 'ronin-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'RON',
    symbol: 'RON',
  },
  rpcUrls: {
    default: {
      http: [
        'https://saigon-testnet.roninchain.com/rpc',
        'https://api-gateway.skymavis.com/rpc/testnet',
      ],
    },
    public: {
      http: [
        'https://saigon-testnet.roninchain.com/rpc',
        'https://api-gateway.skymavis.com/rpc/testnet',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Saigon Explorer',
      url: 'https://saigon-app.roninchain.com',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'ScorchCore Protocol',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [ronin, roninTestnet],
  ssr: true,
});
