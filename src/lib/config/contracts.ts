/**
 * Configuración de direcciones de contratos para ScorchCore
 * Soporta Ronin Mainnet y Ronin Testnet
 */

import type { Address } from '@/types';

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
// Deployed on Nov 10, 2025 - UPDATED Nov 16, 2025
const TESTNET_CONTRACTS: ContractAddresses = {
  // Mock Tokens (from deployment-testnet.json)
  // Tokens (REDESPLIEGUE COMPLETO Nov 17, 2025)
  axsToken: '0x2f06F03bcbE94c7970b97D8Ddd5793a7beDE26b3', // MockAXS ✅ 
  slpToken: '0x1cd1459a4A4400F35313d7C0f41e3d80FF21Fc67', // MockSLP ✅ 
  coreToken: '0x236E0F5652e8f8863C1CB1E599bB309020a76539', // MockCORE
  fCoreToken: '0x66871e6949493f02b81047693430ac2Fda3bcC98', // fCORE (recompensas de mining) 
  
  // Memento Tokens (REDESPLIEGUE Nov 17, 2025 - 9 mementos específicos por clase)
  mementos: {
    beast: '0x98d5466D0654495D718e14A80e219e4F43cA8f70',   // Beast Memento ✅ NUEVO
    aqua: '0xc3A3dfD5d300Fd2A1ab3CfcEc0155F98C32d8fe9',    // Aqua Memento ✅ NUEVO
    bird: '0x87f69AD483163c5669974b8e41aAf8Cc2afD549e',    // Bird Memento ✅ NUEVO
    reptile: '0xd032c6046F2d69434Dd5b635ae8EaE9b0320eB49', // Reptile Memento ✅ NUEVO
    bug: '0x123Aa341e74A0dA523c1B667aC07E51e39F2eC83',     // Bug Memento ✅ NUEVO
    plant: '0xEDf19942589Dd7fb2637Ef5Ca21183ba0eeF6461',   // Plant Memento ✅ NUEVO
    mech: '0x29802D4d2B58fE33c02289345Ab6502743F3454d',    // Mech Memento ✅ NUEVO
    dusk: '0xD74b3E89Cd4145606CB6C0536DdF871667b2d165',    // Dusk Memento ✅ NUEVO
    dawn: '0x4C7B285c325A9Bf136bb5a733e377B0903066910',    // Dawn Memento ✅ NUEVO
  },
  
  // NFTs (REDESPLIEGUE COMPLETO Nov 17, 2025)
  axieNFT: '0xF2463FCB0211D5D4C224FBD67299d26B241Aae18', // MockAxieNFT
  geodeNFT: '0x22A5587085f6717E2462Ef2eFF0DD0AcFa354FEc', // GeodeNFT ✅ NUEVO
  coreMinerNFT: '0xC119c50166D7DC9866a1548E5B6c70A354c0c8D6', // CoreMinerNFTV2 ✅ ACTUALIZADO Nov 17
  
  // Core Contracts (REDESPLIEGUE COMPLETO Nov 17, 2025)
  scorchHeartTransmuter: '0x8a0F8989A4ce18066eA186df793E8ab0e65F8bc6', // TransmuterV2 ✅ ACTUALIZADO Nov 17
  axsTreasuryVault: '0x910c0409ae9AafDb3B0f681D2f8A5C4Ce71505c3', // AXSTreasuryVault ✅ NUEVO
  miningScheduler: '0x4E9fAd24C85b73164D74FAe1204A4ec10046BA35', // MiningScheduler ✅ FIXED Nov 17 - Apuntando al CoreMinerNFT correcto
  axieStakingManager: '0xbB45Eca5C79FBed11384c0Ae5792F032cE4d9741', // AxieStakingManager
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
  const validAddresses: any = {};
  
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
