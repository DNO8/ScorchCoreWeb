/**
 * ABIs centralizados de todos los contratos
 * IMPORTANTE: Estos ABIs deben coincidir EXACTAMENTE con los contratos desplegados
 */

/**
 * ABI del contrato ScorchHeartTransmuter
 * Contrato: contratos/contracts/ScorchHeartTransmuter.sol
 * ACTUALIZADO para sistema de categorías + clases (5x9 = 45 variantes)
 */
export const TRANSMUTER_ABI = [
  // Funciones principales (ACTUALIZADAS)
  'function forgeGeode(uint8 category, uint8 axieClass, uint256 mementosToUse) external',
  'function hatchGeode(uint256 tokenId) external',
  
  // Función para configurar tokens de memento
  'function setMementoToken(uint8 axieClass, address tokenAddress) external',
  'function mementoTokens(uint8 axieClass) view returns (address)',
  
  // Variables públicas (mapping públicos generan getters automáticos)
  'function customForgeCosts(uint8 category) view returns (uint256 coreCost, uint256 axsCost, uint256 slpCost, uint256 mementoCost)',
  'function failureProbability(uint8 category) view returns (uint256)',
  
  // Nueva función para obtener conteo de forjas por combinación
  'function getForgedCount(uint8 category, uint8 axieClass) view returns (uint256)',
  
  // Eventos (ACTUALIZADOS)
  'event GeodeForged(address indexed user, uint256 category, uint256 axieClass, uint256 tokenId)',
  'event GeodeHatched(address indexed user, uint256 tokenId, uint256 minerPower, uint256 minerEfficiency, bool isCritical)',
  'event ForgeFailed(address indexed user, uint256 category, uint256 axieClass, uint256 mementosUsed)',
  'event MaxSupplyReached(uint256 category, uint256 axieClass, uint256 totalForged)',
  'event MementoTokenSet(uint256 axieClass, address tokenAddress)',
];

/**
 * ABI del contrato GeodeNFT
 * Contrato: contratos/contracts/GeodeNFT.sol
 * ACTUALIZADO para sistema de categorías + clases
 */
export const GEODE_NFT_ABI = [
  // Funciones ERC721 estándar
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  
  // Funciones personalizadas (ACTUALIZADAS)
  // Ahora devuelve: (category, axieClass, forgeDate, creator)
  'function getGeodeInfo(uint256 tokenId) view returns (uint256, uint256, uint256, address)',
  'function getGeodeCategory(uint256 tokenId) view returns (uint8)',
  'function getGeodeClass(uint256 tokenId) view returns (uint8)',
  'function getGeodeName(uint256 tokenId) view returns (string)',
  
  // Eventos (ACTUALIZADOS)
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event GeodeMinted(address indexed to, uint256 indexed tokenId, uint256 category, uint256 axieClass)',
  'event GeodeBurned(address indexed owner, uint256 indexed tokenId)',
];

/**
 * ABI del contrato CoreMinerNFT
 * Contrato: contratos/contracts/CoreMinerNFT.sol
 */
export const CORE_MINER_ABI = [
  // Funciones ERC721 estándar
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  
  // Funciones personalizadas (si existen en el contrato)
  'function getMinerStats(uint256 tokenId) view returns (uint256 power, uint256 efficiency, uint256 durability, uint256 lastMined, uint256 forgeDate)',
  
  // Eventos
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event MinerMinted(address indexed to, uint256 indexed tokenId, uint256 power, uint256 efficiency)',
];

/**
 * ABI estándar de tokens ERC20
 * Compatible con MockAXS, MockSLP, MockMemento
 */
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  
  // Eventos
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

/**
 * ABI del contrato MiningScheduler (si existe)
 * Contrato: contratos/contracts/MiningScheduler.sol
 */
export const MINING_SCHEDULER_ABI = [
  'function getUserTotalMined(address user) view returns (uint256)',
  'function getUserActiveCycles(address user) view returns (uint256)',
  'function getUserPendingRewards(address user) view returns (uint256)',
  
  // Eventos (agregar si existen)
];

/**
 * ABI del contrato Axie (solo mainnet)
 * Este es un contrato externo de Ronin
 */
export const AXIE_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];
