/**
 * Hook para gestionar NFTs (Axies y Mineros)
 * Carga automáticamente los NFTs desde la wallet del usuario
 */

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useConfig } from 'wagmi';
import { createAxieService } from '@/services/nft/axieService';
import { createMinerService } from '@/services/nft/minerService';
import { ethers } from 'ethers';
import type { CoreMiner } from '@/types/game';

interface UseNFTsOptions {
  autoLoad?: boolean;
  stakingContractAddress?: string;
  minerContractAddress?: string;
}

interface AxieNFT {
  tokenId: string;
  owner: string;
  metadata: {
    id: string;
    name: string;
    image: string;
    class: string;
    genes: string;
    stats: {
      hp: number;
      speed: number;
      skill: number;
      morale: number;
    };
  };
  isStaked: boolean;
}

// Tipo CoreMinerNFT - coincide con el del minerService
interface CoreMinerNFT extends CoreMiner {
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
      display_type?: string;
    }>;
  };
}

export function useNFTs(options: UseNFTsOptions = {}) {
  const {
    autoLoad = true,
    stakingContractAddress,
    minerContractAddress,
  } = options;

  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();

  const [axies, setAxies] = useState<AxieNFT[]>([]);
  const [miners, setMiners] = useState<CoreMinerNFT[]>([]);
  const [isLoadingAxies, setIsLoadingAxies] = useState(false);
  const [isLoadingMiners, setIsLoadingMiners] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar Axies
  const loadAxies = async () => {
    if (!address || !publicClient || !chain) return;

    setIsLoadingAxies(true);
    setError(null);

    try {
      // Verificar si hay una dirección de contrato Axie configurada (no en mainnet siempre está)
      // En testnet podría no estar desplegado
      
      // Crear provider de ethers desde el RPC de la chain
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);
      const axieService = createAxieService(provider);

      let loadedAxies: AxieNFT[];
      if (stakingContractAddress) {
        // Cargar solo Axies disponibles (no stakeados)
        loadedAxies = await axieService.getAvailableAxies(
          address,
          stakingContractAddress
        );
      } else {
        // Cargar todos los Axies
        loadedAxies = await axieService.getAxiesFromWallet(address);
      }

      setAxies(loadedAxies);
    } catch (err) {
      // Ahora axieService retorna [] en lugar de lanzar error,
      // pero mantenemos el catch por si acaso
      console.warn('⚠️ No se pudieron cargar Axies:', err);
      setAxies([]); // Array vacío, no mostrar error al usuario
    } finally {
      setIsLoadingAxies(false);
    }
  };

  // Cargar Mineros
  const loadMiners = async () => {
    if (!address || !publicClient || !chain || !minerContractAddress) return;

    setIsLoadingMiners(true);
    setError(null);

    try {
      // Crear provider de ethers desde el RPC de la chain
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);
      const minerService = createMinerService(minerContractAddress, provider);
      const loadedMiners = await minerService.getMinersFromWallet(address);
      setMiners(loadedMiners);
    } catch (err) {
      // Si el error es porque el contrato no está desplegado, no mostrar error
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('could not decode result data')) {
        console.warn('⚠️ Contrato CoreMiner no desplegado o no disponible en esta red.');
        setMiners([]); // Array vacío
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load miners';
        setError(errorMessage);
        console.error('Error loading miners:', err);
      }
    } finally {
      setIsLoadingMiners(false);
    }
  };

  // Recargar todos los NFTs
  const reload = async () => {
    await Promise.all([loadAxies(), loadMiners()]);
  };

  // Auto-cargar al conectar wallet
  useEffect(() => {
    if (isConnected && autoLoad) {
      loadAxies();
      if (minerContractAddress) {
        loadMiners();
      }
    }
  }, [isConnected, address, autoLoad, minerContractAddress]);

  // Calcular estadísticas
  const stats = {
    totalAxies: axies.length,
    totalMiners: miners.length,
    stakedAxies: axies.filter(a => a.isStaked).length,
    availableAxies: axies.filter(a => !a.isStaked).length,
    totalResonancePower: axies.filter(a => a.isStaked).length * 5,
    totalMiningPower: miners.reduce((sum, m) => sum + Number(m.miningPower), 0),
    voraciousMiners: miners.filter(m => m.isVoracious).length,
  };

  return {
    // Data
    axies,
    miners,
    stats,

    // Loading states
    isLoadingAxies,
    isLoadingMiners,
    isLoading: isLoadingAxies || isLoadingMiners,

    // Error
    error,

    // Actions
    loadAxies,
    loadMiners,
    reload,
  };
}

/**
 * Hook específico para Axies
 */
export function useAxies(stakingContractAddress?: string) {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();

  const [axies, setAxies] = useState<AxieNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAxies = async () => {
    if (!address || !publicClient || !chain) return;

    setIsLoading(true);
    setError(null);

    try {
      // Crear provider de ethers desde el RPC de la chain
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);
      const axieService = createAxieService(provider);
      const loadedAxies = await axieService.getAxiesFromWallet(address);
      setAxies(loadedAxies);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('could not decode result data')) {
        console.warn('⚠️ Contrato Axie no desplegado o no disponible en esta red.');
        setAxies([]);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Axies';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadAxies();
    }
  }, [isConnected, address]);

  return {
    axies,
    isLoading,
    error,
    reload: loadAxies,
    totalAxies: axies.length,
    stakedAxies: axies.filter(a => a.isStaked).length,
    availableAxies: axies.filter(a => !a.isStaked).length,
  };
}

/**
 * Hook específico para Mineros
 */
export function useMiners(minerContractAddress: string) {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();

  const [miners, setMiners] = useState<CoreMinerNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMiners = async () => {
    if (!address || !publicClient || !chain) return;

    setIsLoading(true);
    setError(null);

    try {
      // Crear provider de ethers desde el RPC de la chain
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);
      const minerService = createMinerService(minerContractAddress, provider);
      const loadedMiners = await minerService.getMinersFromWallet(address);
      setMiners(loadedMiners);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('could not decode result data')) {
        console.warn('⚠️ Contrato CoreMiner no desplegado o no disponible en esta red.');
        setMiners([]);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load miners';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadMiners();
    }
  }, [isConnected, address]);

  // Filtros útiles
  const minersByType = (type: number) => miners.filter(m => m.minerType === type);
  const voraciousMiners = miners.filter(m => m.isVoracious);
  const totalMiningPower = miners.reduce((sum, m) => sum + Number(m.miningPower), 0);

  return {
    miners,
    isLoading,
    error,
    reload: loadMiners,
    totalMiners: miners.length,
    minersByType,
    voraciousMiners,
    totalMiningPower,
  };
}
