/**
 * Configuración de direcciones de contratos para ScorchCore
 * Soporta Ronin Mainnet y Ronin Testnet
 */

import type { Address } from 'viem';
import { createServiceLogger } from '@/lib/utils/logger';

const log = createServiceLogger('ContractConfig');

export interface ContractAddresses {
  // Tokens
  coreToken: Address;
  fCoreToken: Address; // Token de recompensas de mining
  slpToken: Address;
  axsToken: Address;
  
  // Mementos (9 tokens, uno por clase de Axie)
  mementos: {
    beast: Address;
    aqua: Address;
    bird: Address;
    reptile: Address;
    bug: Address;
    plant: Address;
    mech: Address;
    dusk: Address;
    dawn: Address;
  };
  
  // NFTs
  geodeNFT: Address;
  coreMinerNFT: Address;
  axieNFT: Address;
  
  // Core Contracts
  scorchHeartTransmuter: Address;
  axsTreasuryVault: Address;
  miningScheduler?: Address;
  axieStakingManager?: Address;
  
  // Faucets (solo testnet)
  tokenFaucet?: Address;
  axieFaucet?: Address;
}

// Ronin Mainnet Addresses (2020)
// TODO: Actualizar con direcciones reales al hacer deploy en mainnet
const MAINNET_CONTRACTS: ContractAddresses = {
  // Tokens reales de Axie Infinity
  axsToken: '0x97a9107c1793bc407d6f527b77e7fff4d812bece',
  slpToken: '0xa8754b9fa15fc18bb59458815510e40a12cd2014',
  coreToken: '0x0000000000000000000000000000000000000000',
  fCoreToken: '0x0000000000000000000000000000000000000000',
  
  // Mementos (actualizar después del deploy)
  mementos: {
    beast: '0x0000000000000000000000000000000000000000',
    aqua: '0x0000000000000000000000000000000000000000',
    bird: '0x0000000000000000000000000000000000000000',
    reptile: '0x0000000000000000000000000000000000000000',
    bug: '0x0000000000000000000000000000000000000000',
    plant: '0x0000000000000000000000000000000000000000',
    mech: '0x0000000000000000000000000000000000000000',
    dusk: '0x0000000000000000000000000000000000000000',
    dawn: '0x0000000000000000000000000000000000000000',
  },
  
  // Axie NFT real
  axieNFT: '0x32950db2a7164aE833121501C797D79E7B79d74C',
  geodeNFT: '0x0000000000000000000000000000000000000000',
  coreMinerNFT: '0x0000000000000000000000000000000000000000',
  
  // ScorchCore Contracts (actualizar después del deploy)
  scorchHeartTransmuter: '0x0000000000000000000000000000000000000000',
  axsTreasuryVault: '0x0000000000000000000000000000000000000000',
  miningScheduler: '0x0000000000000000000000000000000000000000',
  axieStakingManager: '0x0000000000000000000000000000000000000000',
};

// Ronin Testnet Addresses (2021)
// DEPLOYED: 15-ene-2026 04:14 UTC - VERIFIED on Sourcify ✅
export const TESTNET_CONTRACTS: ContractAddresses = {
  // External Tokens (Ronin Testnet)
  // ⚠️ IMPORTANTE: AXS es solo para PRUEBAS en testnet. Para producción usar el contrato oficial de AXS
  axsToken: '0x59e8ab9c8f7264456c05f3819af441b4e3ed4244', // AXS Token (testnet - TEMPORAL para pruebas)
  slpToken: '0xa8754b9Fa15fc18BB59458815510E40a12cD2014', // SLP Contract (external)
  
  // Core Tokens (NUEVO DEPLOYMENT)
  coreToken: '0x725d916F4f9212057A63E3BE1B4790BCe8720bf5', // CoreToken ✅ VERIFIED
  fCoreToken: '0xF525F3C43888da15d18cbE4006e0c173FC84f363', // fCoreToken ✅ VERIFIED
  
  // Memento Token (ERC-1155 Multi-Type - Token IDs 0-8)
  // ✅ NUEVO: Soporta 9 tipos diferentes por clase de Axie (0=Beast, 1=Aqua, 2=Bird, etc.)
  mementos: {
    beast: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',   // MementoToken v2 ✅ Multi-Type
    aqua: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',    // (mismo contrato, diferentes IDs)
    bird: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    reptile: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    bug: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    plant: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    mech: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    dusk: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
    dawn: '0xfa3Ab001DA96e9D97574cec97D0e1A1eFc53CA25',
  },
  
  // NFTs (NUEVO DEPLOYMENT - verificados en Sourcify)
  axieNFT: '0x32950db2a7164aE833121501C797D79E7B79d74C', // Axie Contract (external)
  geodeNFT: '0x4581b630DC14905a2C13B21654610a547733A287', // GeodeNFT ✅ VERIFIED
  coreMinerNFT: '0xa105F44F96A733C1eADEecDd9ade3f03Ce11B79b', // CoreMinerNFT ✅ VERIFIED
  
  // Core Contracts (NUEVO DEPLOYMENT - Phase 2A completo)
  scorchHeartTransmuter: '0x2974bb1607DDBEc7eC7013562e0D0F45FE6732B1', // ForgeFactory ✅ VERIFIED
  axsTreasuryVault: '0x0000000000000000000000000000000000000000', // TODO: No deployed yet
  miningScheduler: '0x6FAD12Be7CbaB1F559B39A84019a29239B17863E', // MiningPool ✅ VERIFIED
  axieStakingManager: '0x0f00cce40b8aA690926daCDbDA5663b2bd39c2FB', // AxieStakingManager ✅ VERIFIED
};

/**
 * Obtiene las direcciones de contratos según el chainId
 * @param chainId - 2020 para mainnet, 2021 para testnet
 */
export function getContractAddresses(chainId: number): ContractAddresses {
  switch (chainId) {
    case 2020:
      return MAINNET_CONTRACTS;
    case 2021:
      return TESTNET_CONTRACTS;
    default:
      log.warn('Unknown chainId detected, defaulting to testnet', { 
        chainId,
        supportedChains: [2020, 2021],
        defaulting: 'testnet'
      });
      return TESTNET_CONTRACTS;
  }
}

/**
 * Verifica si una dirección es válida (no es address zero)
 */
export function isValidAddress(address: Address): boolean {
  return address !== '0x0000000000000000000000000000000000000000';
}

/**
 * Obtiene las direcciones de contratos válidos (no son address zero)
 */
export function getValidContracts(chainId: number): Partial<ContractAddresses> {
  const addresses = getContractAddresses(chainId);
  const validAddresses: Partial<ContractAddresses> = {};
  
  for (const [key, value] of Object.entries(addresses)) {
    // mementos es un objeto, manejarlo especialmente
    if (key === 'mementos' && typeof value === 'object') {
      validAddresses[key] = value;
    } else if (typeof value === 'string' && isValidAddress(value as Address)) {
      validAddresses[key] = value;
    }
  }
  
  return validAddresses as Partial<ContractAddresses>;
}

/**
 * Hook para obtener las direcciones de contratos de la red actual
 */
export { getContractAddresses as default };

// Exportar constantes
export const RONIN_MAINNET_ID = 2020;
export const RONIN_TESTNET_ID = 2021;

// Nombres legibles
export const CHAIN_NAMES: Record<number, string> = {
  [RONIN_MAINNET_ID]: 'Ronin Mainnet',
  [RONIN_TESTNET_ID]: 'Ronin Testnet',
};
