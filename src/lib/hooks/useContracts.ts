/**
 * Hook para obtener las direcciones de contratos de la red actual
 */

import { useAccount } from 'wagmi';
import { getContractAddresses, type ContractAddresses } from '@/lib/config/contracts';

export function useContracts(): ContractAddresses | null {
  const { chain } = useAccount();
  
  if (!chain) {
    return null;
  }
  
  return getContractAddresses(chain.id);
}

export function useContractAddress(contractName: keyof ContractAddresses): string | null {
  const contracts = useContracts();
  
  if (!contracts) {
    return null;
  }
  
  return contracts[contractName] || null;
}
