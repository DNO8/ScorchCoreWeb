// ScorchCore TypeScript Types

export * from './contracts';
export * from './game';
export * from './user';

// Tipos básicos
export type Address = `0x${string}`;

export interface TokenBalance {
  address: Address;
  symbol: string;
  balance: bigint;
  decimals: number;
  formatted: string;
}

export interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}
