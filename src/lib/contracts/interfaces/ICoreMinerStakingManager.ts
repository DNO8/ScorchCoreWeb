/**
 * Interface para CoreMinerStakingManager
 * Staking flexible de CoreMiners sin lock obligatorio
 */

import type { Contract, ContractTransaction } from 'ethers';
import type { Address } from 'viem';

export interface ICoreMinerStakingManager extends Contract {
  // ============================================
  // Staking Functions
  // ============================================
  
  /**
   * Stakea un CoreMiner NFT
   * @param minerId - ID del CoreMiner
   */
  stake(minerId: bigint): Promise<ContractTransaction>;
  
  /**
   * Unstakea un CoreMiner NFT
   * @param minerId - ID del CoreMiner
   */
  unstake(minerId: bigint): Promise<ContractTransaction>;
  
  /**
   * Unstakea múltiples CoreMiners
   * @param minerIds - Array de IDs de CoreMiners
   */
  batchUnstake(minerIds: bigint[]): Promise<ContractTransaction>;
  
  // ============================================
  // View Functions
  // ============================================
  
  /**
   * Obtiene el poder total de staking de un usuario
   * @param user - Address del usuario
   * @returns Poder total (suma de todos los miners stakeados)
   */
  getUserStakingPower(user: Address): Promise<bigint>;
  
  /**
   * Obtiene todos los CoreMiners stakeados por un usuario
   * @param user - Address del usuario
   * @returns Array de IDs de CoreMiners
   */
  getStakedMiners(user: Address): Promise<bigint[]>;
  
  /**
   * Verifica si un CoreMiner específico está stakeado
   * @param minerId - ID del CoreMiner
   */
  isStaked(minerId: bigint): Promise<boolean>;
  
  /**
   * Obtiene información de staking de un CoreMiner
   * @param minerId - ID del CoreMiner
   * @returns Struct con owner, timestamp, power
   */
  getStakeInfo(minerId: bigint): Promise<{
    owner: Address;
    stakedAt: bigint;
    power: bigint;
  }>;
  
  /**
   * Obtiene el poder de mining de un CoreMiner
   * @param minerId - ID del CoreMiner
   */
  getMinerPower(minerId: bigint): Promise<bigint>;
  
  /**
   * Verifica si un CoreMiner puede ser unstakeado
   * @param minerId - ID del CoreMiner
   */
  canUnstake(minerId: bigint): Promise<boolean>;
  
  // ============================================
  // Admin Functions
  // ============================================
  
  /**
   * Pausa/despausa el contrato
   */
  pause(): Promise<ContractTransaction>;
  unpause(): Promise<ContractTransaction>;
}

export default ICoreMinerStakingManager;
