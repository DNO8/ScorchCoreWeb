import { useAccount, useBalance, useDisconnect } from 'wagmi';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address,
  });

  return {
    address,
    isConnected,
    chain,
    balance: balance?.formatted,
    balanceSymbol: balance?.symbol,
    disconnect,
  };
}
