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
  
  // Referencias a otros contratos (variables públicas immutable)
  'function geodeNFT() view returns (address)',
  'function coreMinerNFT() view returns (address)',
  
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
  
  // Funciones de aprobación ERC721 (NECESARIAS para hatchGeode)
  'function approve(address to, uint256 tokenId)',
  'function setApprovalForAll(address operator, bool approved)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  
  // Funciones personalizadas (ACTUALIZADAS)
  // Ahora devuelve: (category, axieClass, forgeDate, creator)
  'function getGeodeInfo(uint256 tokenId) view returns (uint256, uint256, uint256, address)',
  'function getGeodeCategory(uint256 tokenId) view returns (uint8)',
  'function getGeodeClass(uint256 tokenId) view returns (uint8)',
  'function getGeodeName(uint256 tokenId) view returns (string)',
  
  // Eventos (ACTUALIZADOS)
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event GeodeMinted(address indexed to, uint256 indexed tokenId, uint256 category, uint256 axieClass)',
  'event GeodeBurned(address indexed owner, uint256 indexed tokenId)',
];

/**
 * ABI del contrato CoreMiner NFT V2
 * Contrato: contratos/contracts/CoreMinerNFTV2.sol
 */
export const CORE_MINER_ABI = [
  // Funciones ERC721 estándar + Enumerable
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function totalSupply() view returns (uint256)',
  
  // Funciones de consulta personalizadas
  'function getMinerData(uint256 tokenId) view returns (uint256 power, uint256 efficiency, uint256 durability, uint256 level, uint256 experience, bool isVoracious, uint256 lastFed, uint8 minerType, uint8 minerNameIndex)',
  'function getMinerStats(uint256 tokenId) view returns (uint256 power, uint256 efficiency, uint256 durability, uint256 lastMined, uint256 forgeDate)',
  'function getMinersOfOwner(address owner) view returns (uint256[])',
  'function needsFeeding(uint256 tokenId, uint256 feedInterval) view returns (bool)',
  'function getEffectivePower(uint256 tokenId) view returns (uint256)',
  
  // Funciones de minting (MINTER_ROLE)
  'function mint(address to, uint256 power, uint256 efficiency, uint8 minerType, uint8 minerNameIndex) returns (uint256)',
  
  // Funciones de juego (GAME_ROLE)
  'function feedMiner(uint256 tokenId)',
  'function addExperience(uint256 tokenId, uint256 amount)',
  'function setVoracious(uint256 tokenId, bool voracious)',
  'function reduceDurability(uint256 tokenId, uint256 amount)',
  'function repairMiner(uint256 tokenId, uint256 amount)',
  
  // Eventos
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event MinerMinted(address indexed to, uint256 indexed tokenId, uint256 power, uint256 efficiency, uint8 minerType)',
  'event MinerFed(uint256 indexed tokenId, uint256 timestamp)',
  'event MinerLeveledUp(uint256 indexed tokenId, uint256 newLevel)',
  'event MinerRepaired(uint256 indexed tokenId, uint256 newDurability)',
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
 * ABI del contrato MiningScheduler
 * Contrato: contratos/contracts/MiningScheduler.sol
 */
export const MINING_SCHEDULER_ABI = [
  // Funciones principales
  'function startMining(uint256 minerId, uint256 power, uint256 efficiency) external',
  'function claimRewards(uint256 minerId) external',
  'function stopMining(uint256 minerId) external',
  
  // Funciones de consulta
  'function calculatePendingRewards(uint256 minerId) view returns (uint256)',
  'function getMiningSession(uint256 minerId) view returns (address owner, uint256 startTime, uint256 lastClaim, uint256 power, uint256 efficiency, bool isActive, uint256 pendingRewards)',
  'function miningSessions(uint256 minerId) view returns (address owner, uint256 startTime, uint256 lastClaim, uint256 power, uint256 efficiency, bool isActive)',
  'function baseRewardPerHour() view returns (uint256)',
  
  // Eventos
  'event MiningStarted(address indexed user, uint256 indexed minerId, uint256 power, uint256 efficiency)',
  'event MiningClaimed(address indexed user, uint256 indexed minerId, uint256 amount)',
  'event MiningStopped(address indexed user, uint256 indexed minerId)',
];

/**
 * ABI del token fCORE (ERC20)
 * Token de recompensas de mining
 */
export const FCORE_TOKEN_ABI = [
  // Funciones ERC20 estándar
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
  
  // Eventos
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
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
