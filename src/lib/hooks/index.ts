/**
 * Barrel export de todos los hooks
 * 
 * Organizado por categoría de funcionalidad:
 * - Core: Infraestructura base
 * - NFT: Gestión de NFTs (Miners, Axies)
 * - Forge: Forja y eclosión de geodas
 * - Mining: Operaciones de minería
 * - Balance: Consulta de balances
 */

// ==========================================
// CORE - Infraestructura base
// ==========================================
// Export all hooks from this barrel
export * from './useWallet';
export * from './useContractManager';
export * from './useMining';
export * from './useNFTs';
export * from './useForgeFacade';
export * from './useNFTFacade';
export * from './useMiningStats';
export * from './useTokenService';
export * from './useMementoBalances';
export * from './useInventoryFacade';

// Export new hooks
export * from './useContracts';
export * from './useUserData';
export * from './useMetadataService';

// ==========================================
// NFT - Gestión de NFTs
// ==========================================
export { useNFTFacade } from './useNFTFacade';
export { useNFTs } from './useNFTs';
export type { 
  UseNFTsOptions, 
  UseNFTsReturn 
} from './useNFTs';

// ==========================================
// FORGE - Forja y eclosión
// ==========================================
export { useForgeFacade } from './useForgeFacade';
export { useInventoryFacade } from './useInventoryFacade';

// ==========================================
// MINING - Operaciones de minería
// ==========================================
// Mining hooks
export { useMining } from './useMining';
export { useCycleManager, useCycleBonusInfo, useUserCyclesSummary } from './useCycleManager';
export { useMinerActions } from './useMinerActions';
export type { UseMiningReturn } from './useMining';
export type { UseCycleManagerReturn } from './useCycleManager';
export type { UseMinerActionsReturn, MinerActionResult } from './useMinerActions';

// fCore System Hook (Anti-Bot)
export {
  usefCoreBalance,
  type UsefCoreBalanceReturn
} from './usefCoreBalance';

export type {
  MiningStatsData,
  UseMiningStatsOptions,
  UseMiningStatsReturn
} from './useMiningStats';

// ==========================================
// BALANCE - Consulta de balances
// ==========================================
export { useMementoBalances } from './useMementoBalances';
export type {
  MementoBalance,
  MementoBalances,
  UseMementoBalancesOptions,
  UseMementoBalancesReturn
} from './useMementoBalances';
