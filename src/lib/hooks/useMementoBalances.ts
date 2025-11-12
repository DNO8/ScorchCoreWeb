import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { useAccount } from 'wagmi';
import { AxieClass } from '../constants/geodes';
import { getContractAddresses } from '../config/contracts';
import { ethers } from 'ethers';

/**
 * Hook para obtener balances de los 9 tipos de mementos
 * Lee los balances reales desde los contratos desplegados en Ronin Testnet
 */

export interface MementoBalance {
  axieClass: AxieClass;
  balance: bigint;
  symbol: string;
  name: string;
  address?: string;
}

export interface MementoBalances {
  [key: number]: MementoBalance; // key es AxieClass
}

// Datos mock de mementos
const MOCK_MEMENTO_DATA = {
  [AxieClass.BEAST]: { symbol: 'MBEAST', name: 'Beast Memento' },
  [AxieClass.AQUA]: { symbol: 'MAQUA', name: 'Aqua Memento' },
  [AxieClass.BIRD]: { symbol: 'MBIRD', name: 'Bird Memento' },
  [AxieClass.REPTILE]: { symbol: 'MREPT', name: 'Reptile Memento' },
  [AxieClass.BUG]: { symbol: 'MBUG', name: 'Bug Memento' },
  [AxieClass.PLANT]: { symbol: 'MPLANT', name: 'Plant Memento' },
  [AxieClass.MECH]: { symbol: 'MMECH', name: 'Mech Memento' },
  [AxieClass.DUSK]: { symbol: 'MDUSK', name: 'Dusk Memento' },
  [AxieClass.DAWN]: { symbol: 'MDAWN', name: 'Dawn Memento' },
};

export function useMementoBalances() {
  const { isConnected } = useWallet();
  const { address, chain } = useAccount();
  const [balances, setBalances] = useState<MementoBalances>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !chain) {
      setBalances({});
      return;
    }

    fetchBalances();
  }, [isConnected, address, chain]);

  const fetchBalances = async () => {
    if (!address || !chain) return;

    setIsLoading(true);
    setError(null);

    try {
      // Obtener direcciones de contratos para la red actual
      const contracts = getContractAddresses(chain.id);
      const mementoAddresses = contracts.mementos;
      
      console.log('🔍 Cargando balances de mementos...');
      console.log('  Address:', address);
      console.log('  Chain:', chain.id);
      
      // Crear provider
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);
      
      // ABI básico de ERC20 para balanceOf
      const ERC20_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
      ];
      
      // Mapeo de clases de Axie a claves de mementos
      const classToMementoKey: Record<AxieClass, keyof typeof mementoAddresses> = {
        [AxieClass.BEAST]: 'beast',
        [AxieClass.AQUA]: 'aqua',
        [AxieClass.BIRD]: 'bird',
        [AxieClass.REPTILE]: 'reptile',
        [AxieClass.BUG]: 'bug',
        [AxieClass.PLANT]: 'plant',
        [AxieClass.MECH]: 'mech',
        [AxieClass.DUSK]: 'dusk',
        [AxieClass.DAWN]: 'dawn',
      };

      const balancesData: MementoBalances = {};
      
      // Obtener balance real de cada memento
      const balancePromises = Object.entries(MOCK_MEMENTO_DATA).map(async ([classId, data]) => {
        const axieClass = parseInt(classId) as AxieClass;
        const mementoKey = classToMementoKey[axieClass];
        const mementoAddress = mementoAddresses[mementoKey];
        
        try {
          // Crear contrato y obtener balance
          const mementoContract = new ethers.Contract(mementoAddress, ERC20_ABI, provider);
          const balance = await mementoContract.balanceOf(address);
          
          console.log(`  ${data.symbol}: ${ethers.formatEther(balance)}`);
          
          return {
            axieClass,
            balance,
            symbol: data.symbol,
            name: data.name,
            address: mementoAddress,
          };
        } catch (err) {
          console.error(`Error obteniendo balance de ${data.symbol}:`, err);
          return {
            axieClass,
            balance: BigInt(0),
            symbol: data.symbol,
            name: data.name,
            address: mementoAddress,
          };
        }
      });

      const balancesArray = await Promise.all(balancePromises);
      
      // Convertir array a objeto indexado por axieClass
      balancesArray.forEach(balance => {
        balancesData[balance.axieClass] = balance;
      });

      console.log('✅ Balances de mementos cargados');
      setBalances(balancesData);
    } catch (err) {
      console.error('Error fetching memento balances:', err);
      setError('Error al obtener balances de mementos');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener balance de un memento específico
   */
  const getBalance = (axieClass: AxieClass): bigint => {
    return balances[axieClass]?.balance || BigInt(0);
  };

  /**
   * Verificar si tiene suficientes mementos
   */
  const hasSufficientBalance = (axieClass: AxieClass, required: bigint): boolean => {
    const balance = getBalance(axieClass);
    return balance >= required;
  };

  /**
   * Obtener balance formateado como string (sin decimales)
   */
  const getFormattedBalance = (axieClass: AxieClass): string => {
    const balance = getBalance(axieClass);
    // Convertir de Wei a Ether y formatear sin decimales
    return Math.floor(Number(balance) / 1e18).toString();
  };

  /**
   * Refrescar balances manualmente
   */
  const refresh = () => {
    fetchBalances();
  };

  return {
    balances,
    isLoading,
    error,
    getBalance,
    hasSufficientBalance,
    getFormattedBalance,
    refresh,
  };
}

/**
 * Hook simplificado para obtener el balance de un memento específico
 */
export function useMementoBalance(axieClass: AxieClass) {
  const { balances, isLoading, error } = useMementoBalances();
  
  const balance = balances[axieClass]?.balance || BigInt(0);
  const symbol = balances[axieClass]?.symbol || '';
  const name = balances[axieClass]?.name || '';

  return {
    balance,
    symbol,
    name,
    isLoading,
    error,
  };
}
