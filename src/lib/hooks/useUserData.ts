/**
 * Hook central para obtener todos los datos del usuario
 * Combina NFTs, mining stats y otras estadísticas
 */

import { useAccount } from 'wagmi';
import { useNFTs } from './useNFTs';
import { useMiningStats } from './useMiningStats';
import { useContracts } from './useContracts';

export interface UserStats {
  // NFTs
  axiesOwned: number;
  coreMinersActive: number;
  stakedAxies: number;
  
  // Mining
  totalCOREMined: string;
  dailyRate: string;
  activeMiningCycles: number;
  pendingRewards: string;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useUserData() {
  const { address, isConnected } = useAccount();
  const contracts = useContracts();
  
  // Obtener NFTs del usuario
  const {
    axies,
    miners,
    stats: nftStats,
    isLoading: isLoadingNFTs,
    error: nftError,
    reload: reloadNFTs,
  } = useNFTs({
    autoLoad: true,
    minerContractAddress: contracts?.coreMinerNFT,
  });
  
  // Obtener estadísticas de minería
  const miningStats = useMiningStats();
  
  // Combinar estadísticas
  const userStats: UserStats = {
    // NFTs
    axiesOwned: nftStats.totalAxies,
    coreMinersActive: nftStats.totalMiners,
    stakedAxies: nftStats.stakedAxies,
    
    // Mining
    totalCOREMined: miningStats.totalCOREMined,
    dailyRate: miningStats.dailyRate,
    activeMiningCycles: miningStats.activeMiningCycles,
    pendingRewards: miningStats.pendingRewards,
    
    // Loading
    isLoading: isLoadingNFTs || miningStats.isLoading,
    error: nftError || miningStats.error,
  };
  
  return {
    // Datos raw
    axies,
    miners,
    
    // Estadísticas combinadas
    stats: userStats,
    
    // Estados
    isLoading: userStats.isLoading,
    error: userStats.error,
    isConnected,
    address,
    
    // Acciones
    reload: reloadNFTs,
  };
}
