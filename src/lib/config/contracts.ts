/**
 * Configuración de direcciones de contratos para ScorchCore
 * Soporta Ronin Mainnet y Ronin Testnet
 */

import type { Address } from '@/types';

export interface ContractAddresses {
  // Tokens
  coreToken: Address;
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
// Deployed on Nov 10, 2025 - Full System v2 with 9 Mementos
const TESTNET_CONTRACTS: ContractAddresses = {
  // Mock Tokens
  axsToken: '0x59E8ab9C8f7264456c05F3819aF441b4E3ed4244', // MockAXS
  slpToken: '0x815B45A3D7d4A9fdb29FE2cFc78FdBa296cC8831', // MockSLP
  coreToken: '0x4d3199f7a96aEB1B71b1557055053ccA595201cD', // MockCORE
  
  // Mementos (9 tokens, uno por clase)
  mementos: {
    beast: '0xBfD408Ca9c42C80A48B176a50A9E79Bc909888A9',   // Beast Memento (MBEAST)
    aqua: '0xFaEeC4617296aa8A89E33a3aBd42A25118776b96',    // Aqua Memento (MAQUA)
    bird: '0xa31D16d195F0FdA8cd8b8F6D24a73505eD41bb74',    // Bird Memento (MBIRD)
    reptile: '0x563195BB1eed684E90a3C4DCf5802073d48f0d05', // Reptile Memento (MREPT)
    bug: '0x484E95EcbC39b4EE53FC53C26F79f2f77365A7Db',     // Bug Memento (MBUG)
    plant: '0xeF125955E4Bd3CEc6717267c64eAFaFF5b8A5D80',   // Plant Memento (MPLANT)
    mech: '0x28ce2FEE758497D085F6c1e3668bb5b12348D364',    // Mech Memento (MMECH)
    dusk: '0xCAE97b4bf534D78De099879BC4fDD9f34E041Ed3',    // Dusk Memento (MDUSK)
    dawn: '0x0C01bA22B572DEF1C71506a52302048b677fA25f',    // Dawn Memento (MDAWN)
  },
  
  // Mock NFTs
  axieNFT: '0xF2463FCB0211D5D4C224FBD67299d26B241Aae18', // MockAxieNFT (old deployment)
  geodeNFT: '0xFeb3df836f07565320e35538c832691037601cAF', // GeodeNFT (NEW)
  coreMinerNFT: '0x6ADC507df7d225c79294f387c8E3d1eEAD1d83ce', // CoreMinerNFT (NEW)
  
  // Core Contracts
  scorchHeartTransmuter: '0x64Ac90ECd159793152B65ac426B53D47Be53e165', // ScorchHeartTransmuter (NEW)
  axsTreasuryVault: '0x3d25d88D9b529d4e3493E3c7151e2D5b9ad74198', // AXSTreasuryVault (NEW)
  miningScheduler: '0xEe4A2d70561D6508238cC2AE6933263cBEBf307A', // (old deployment)
  axieStakingManager: '0xbB45Eca5C79FBed11384c0Ae5792F032cE4d9741', // (old deployment)
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
      console.warn(`Unknown chainId: ${chainId}, defaulting to testnet`);
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
    if (isValidAddress(value as Address)) {
      validAddresses[key as keyof ContractAddresses] = value as Address;
    }
  }
  
  return validAddresses;
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
