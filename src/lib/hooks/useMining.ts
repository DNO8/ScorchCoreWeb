/**
 * Hook para gestionar el sistema de mining con CoreMiners
 * Proporciona funciones para iniciar, detener y reclamar recompensas
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { createMiningService, type MiningSession } from '@/services/blockchain/miningService';
import { useContracts } from './useContracts';

interface UseMiningOptions {
  minerId?: bigint;
  autoRefresh?: boolean;
  refreshInterval?: number; // en ms
}

export function useMining(options: UseMiningOptions = {}) {
  const { minerId, autoRefresh = false, refreshInterval = 30000 } = options;
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const contracts = useContracts();

  const [session, setSession] = useState<MiningSession | null>(null);
  const [fCoreBalance, setFCoreBalance] = useState<bigint>(0n);
  const [baseRewardRate, setBaseRewardRate] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga la información de una sesión de mining
   */
  const loadMiningSession = useCallback(async () => {
    if (!minerId || !contracts || !walletClient || !address) return;

    try {
      setIsLoading(true);
      setError(null);

      // Crear provider desde walletClient
      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      // Crear servicio
      const miningService = createMiningService(
        contracts.miningScheduler!,
        contracts.fCoreToken,
        signer
      );

      // Cargar sesión
      const sessionData = await miningService.getMiningSession(minerId);
      setSession(sessionData);

      // Cargar balance de fCORE
      const balance = await miningService.getFCoreBalance(address);
      setFCoreBalance(balance);

      // Cargar tasa base
      const rate = await miningService.getBaseRewardPerHour();
      setBaseRewardRate(rate);

    } catch (err) {
      console.error('Error loading mining session:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [minerId, contracts, walletClient, address]);

  /**
   * Inicia mining con un CoreMiner
   */
  const startMining = useCallback(async (
    minerIdToStart: bigint,
    power: bigint,
    efficiency: bigint
  ) => {
    if (!contracts || !walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const miningService = createMiningService(
        contracts.miningScheduler!,
        contracts.fCoreToken,
        signer
      );

      const tx = await miningService.startMining(minerIdToStart, power, efficiency);
      await tx.wait();

      // Recargar sesión si es el miner actual
      if (minerIdToStart === minerId) {
        await loadMiningSession();
      }

      return tx;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contracts, walletClient, minerId, loadMiningSession]);

  /**
   * Reclama recompensas de mining
   */
  const claimRewards = useCallback(async (minerIdToClaim: bigint) => {
    if (!contracts || !walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const miningService = createMiningService(
        contracts.miningScheduler!,
        contracts.fCoreToken,
        signer
      );

      const result = await miningService.claimRewards(minerIdToClaim);
      await result.tx.wait();

      // Recargar sesión
      if (minerIdToClaim === minerId) {
        await loadMiningSession();
      }

      return result;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contracts, walletClient, minerId, loadMiningSession]);

  /**
   * Detiene mining
   */
  const stopMining = useCallback(async (minerIdToStop: bigint) => {
    if (!contracts || !walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const miningService = createMiningService(
        contracts.miningScheduler!,
        contracts.fCoreToken,
        signer
      );

      const tx = await miningService.stopMining(minerIdToStop);
      await tx.wait();

      // Recargar sesión
      if (minerIdToStop === minerId) {
        await loadMiningSession();
      }

      return tx;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contracts, walletClient, minerId, loadMiningSession]);

  /**
   * Calcula recompensas estimadas por hora
   */
  const calculateEstimatedRewards = useCallback((power: bigint, efficiency: bigint): bigint => {
    if (!baseRewardRate) return 0n;
    return (baseRewardRate * power * efficiency) / 1000n;
  }, [baseRewardRate]);

  // Auto-refresh de la sesión
  useEffect(() => {
    if (autoRefresh && minerId) {
      loadMiningSession();
      const interval = setInterval(loadMiningSession, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, minerId, refreshInterval, loadMiningSession]);

  // Cargar al montar
  useEffect(() => {
    if (minerId && isConnected) {
      loadMiningSession();
    }
  }, [minerId, isConnected, loadMiningSession]);

  return {
    // Datos
    session,
    fCoreBalance,
    baseRewardRate,
    
    // Estados
    isLoading,
    error,
    isConnected,
    
    // Acciones
    startMining,
    claimRewards,
    stopMining,
    reload: loadMiningSession,
    calculateEstimatedRewards,
  };
}
