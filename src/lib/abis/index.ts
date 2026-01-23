/**
 * ABIs centralizados de todos los contratos
 * Barrel export para fácil importación
 */

// Imports explícitos para CONTRACT_ABIS
import { 
  CORETOKEN_ABI, 
  EMISSIONSCHEDULE_ABI, 
  METADATAREGISTRY_ABI,
  MEMENTOVALIDATOR_ABI,
  MEMENTOTOKEN_ABI,
  FCORETOKEN_ABI,
  FCORECONVERTER_ABI
} from './core.abis';

import {
  COREMINERNFT_ABI,
  GEODENFT_ABI,
  IDNFT_ABI
} from './nft.abis';

import {
  MINERSTATSMANAGER_ABI,
  REWARDSCALCULATOR_ABI,
  CYCLEMANAGER_ABI,
  MININGPOOL_ABI,
  AXIESTAKINGMANAGER_ABI,
  BONUSCALCULATOR_ABI,
  SETREGISTRY_ABI,
  USERCOLLECTIONTRACKER_ABI
} from './mining.abis';

import {
  FORGEFACTORY_ABI,
  RECIPEREGISTRY_ABI,
  SUPPLYTRACKER_ABI,
  HATCHINGRANDOMNESS_ABI,
  CHAINLINKVRFPROVIDER_ABI
} from './forge.abis';

import {
  VESTINGMANAGER_ABI,
  PRICEORACLE_ABI,
  BUYBACKFUND_ABI,
  ROYALTYMANAGER_ABI
} from './economy.abis';

import {
  PROOFOFHUMANITYORACLE_ABI,
  TRUSTSCOREMANAGER_ABI
} from './antibot.abis';

// Re-exports para mantener compatibilidad
export * from './core.abis';
export * from './nft.abis';
export * from './mining.abis';
export * from './forge.abis';
export * from './economy.abis';
export * from './antibot.abis';

/**
 * Mapa de todos los ABIs por nombre de contrato
 */
export const CONTRACT_ABIS = {
  CoreToken: CORETOKEN_ABI,
  EmissionSchedule: EMISSIONSCHEDULE_ABI,
  MetadataRegistry: METADATAREGISTRY_ABI,
  MementoValidator: MEMENTOVALIDATOR_ABI,
  MementoToken: MEMENTOTOKEN_ABI,
  fCoreToken: FCORETOKEN_ABI,
  fCoreConverter: FCORECONVERTER_ABI,
  CoreMinerNFT: COREMINERNFT_ABI,
  GeodeNFT: GEODENFT_ABI,
  IdNFT: IDNFT_ABI,
  MinerStatsManager: MINERSTATSMANAGER_ABI,
  RewardsCalculator: REWARDSCALCULATOR_ABI,
  CycleManager: CYCLEMANAGER_ABI,
  MiningPool: MININGPOOL_ABI,
  AxieStakingManager: AXIESTAKINGMANAGER_ABI,
  BonusCalculator: BONUSCALCULATOR_ABI,
  SetRegistry: SETREGISTRY_ABI,
  UserCollectionTracker: USERCOLLECTIONTRACKER_ABI,
  ForgeFactory: FORGEFACTORY_ABI,
  RecipeRegistry: RECIPEREGISTRY_ABI,
  SupplyTracker: SUPPLYTRACKER_ABI,
  HatchingRandomness: HATCHINGRANDOMNESS_ABI,
  ChainlinkVRFProvider: CHAINLINKVRFPROVIDER_ABI,
  VestingManager: VESTINGMANAGER_ABI,
  PriceOracle: PRICEORACLE_ABI,
  BuyBackFund: BUYBACKFUND_ABI,
  RoyaltyManager: ROYALTYMANAGER_ABI,
  ProofOfHumanityOracle: PROOFOFHUMANITYORACLE_ABI,
  TrustScoreManager: TRUSTSCOREMANAGER_ABI,
} as const;

export type ContractName = keyof typeof CONTRACT_ABIS;
