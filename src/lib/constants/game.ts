/**
 * Game Constants - Updated with Real Data from GENERAL DATA SCORCHCORE PROTOCOL.csv
 * 
 * Todas las constantes del juego actualizadas con datos reales del protocolo
 */

export const GAME_CONSTANTS = {
  // Mementos system
  MEMENTOS_PER_PERCENT: 10,
  
  // Critical chance
  CRITICAL_CHANCE: 10, // 1% (base 1000)
  CRITICAL_POWER_MULTIPLIER: 150, // 150%
  CRITICAL_EFFICIENCY_BONUS: 20, // +20%
  
  // Mining cycles
  CYCLES: {
    SHORT: {
      duration: 7 * 24 * 60 * 60, // 1 week
      bonus: 0,
      label: 'Corto (1 semana)',
    },
    STANDARD: {
      duration: 14 * 24 * 60 * 60, // 2 weeks
      bonus: 5,
      label: 'Estándar (2 semanas)',
    },
    COMMITTED: {
      duration: 30 * 24 * 60 * 60, // 1 month
      bonus: 10,
      label: 'Comprometido (1 mes)',
    },
    STRATEGIC: {
      duration: 60 * 24 * 60 * 60, // 2 months
      bonus: 15,
      label: 'Estratégico (2 meses)',
    },
    MASTER: {
      duration: 90 * 24 * 60 * 60, // 3 months
      bonus: 20,
      label: 'Máster (3 meses)',
    },
  },
  
  // Axie staking
  AXIE_RESONANCE_POWER: 5,
  MIN_STAKING_PERIOD: 7 * 24 * 60 * 60, // 1 week
  
  // CoreMiner Voraz
  VORACIOUS_POWER_BONUS: 25, // +25%
  FEEDING_PERIOD: 7 * 24 * 60 * 60, // 7 days
  AXIES_PER_FEEDING: 2,
  EFFICIENCY_PENALTY: 50, // -50%
  
  // Burn tickets
  TICKET_LEVELS: {
    LIBRE: {
      cost: { core: 0n, slp: 0n },
      maxBurnsPerDay: 10,
      label: 'Pase de Prospector Libre',
    },
    ASTRAL: {
      cost: { core: 1000n * 10n ** 18n, slp: 10000n * 10n ** 18n },
      maxBurnsPerDay: 30,
      label: 'Licencia Astral',
    },
    NEBULOSA: {
      cost: { core: 5000n * 10n ** 18n, slp: 50000n * 10n ** 18n },
      maxBurnsPerDay: 50,
      label: 'Edicto Nebulosa',
    },
    ALMA: {
      cost: { core: 10000n * 10n ** 18n, slp: 100000n * 10n ** 18n },
      maxBurnsPerDay: 100,
      label: 'Concesión del Alma',
    },
  },
  
  // Max supplies por etapa (del CSV)
  MAX_SUPPLY: {
    PETIT: 90000,        // 10,000 × 9 tipos
    ALTO: 67500,         // 7,500 × 9 tipos  
    ANIMAL: 45000,       // 5,000 × 9 tipos
    ULTRAMECH: 45000,    // 5,000 × 9 tipos
    TANQUE: 45000,       // 5,000 × 9 tipos
    TOTAL: 292500,       // Total de CoreMiners
  },
  
  // Poder de minado por etapa
  MINING_POWER: {
    PETIT: 75,
    ALTO: 125,
    ANIMAL: 165,
    ULTRAMECH: 165,
    TANQUE: 200,
  },
  
  // Bonus de colección
  COLLECTION_BONUS: 2.0, // 2% para todos
  
  // Costos de reparación (% de producción mensual)
  REPAIR_COSTS: {
    PETIT: 0.06,          // 6%
    ALTO: 0.05,           // 5%
    ANIMAL: 0.05,         // 5%
    ULTRAMECH: 0.05,      // 5%
    TANQUE: 0.04,         // 4%
    EPIC: 0.04,           // 4%
    LEGENDARY: 0.03,      // 3%
  },
  
  // Probabilidades de forja
  FORGE_PROBABILITIES: {
    PETIT: {
      NORMAL: 0.25,      // 25%
      FAILURE: 0.10,     // 10%
    },
    ALTO: {
      NORMAL: 0.20,      // 20%
      FAILURE: 0.20,     // 20%
    },
    ANIMAL: {
      NORMAL: 0.20,      // 20%
      CRITICAL: 0.001,   // 0.1%
    },
    ULTRAMECH: {
      NORMAL: 0.20,      // 20%
      CRITICAL: 0.005,   // 0.5%
    },
    TANQUE: {
      NORMAL: 0.20,      // 20%
      CRITICAL: 0.007,   // 0.7%
    },
    EPIC: {
      NORMAL: 0.01,      // 1%
      CRITICAL: 0.01,    // 1%
    },
  },
} as const;

// Nombres de etapas de Geodas (del CSV)
export const GEODE_STAGE_NAMES = {
  PETIT: 'Petit',
  ALTO: 'Alto',
  ANIMAL: 'Animal',
  ULTRAMECH: 'Ultramech',
  TANQUE: 'Tanque',
} as const;

// Nombres de tipos de Axie (del CSV)
export const AXIE_TYPE_NAMES = {
  0: 'Beast',      // Bestia
  1: 'Aquatic',    // Aqua
  2: 'Bird',       // Ave
  3: 'Reptile',    // Reptil
  4: 'Bug',        // Bicho
  5: 'Plant',      // Planta
  6: 'Mech',       // Mech
  7: 'Dusk',       // Oscuridad
  8: 'Dawn',       // Amanecer
} as const;

// Nombres en español
export const AXIE_TYPE_NAMES_ES = {
  BEAST: 'Bestia',
  AQUATIC: 'Aqua',
  BIRD: 'Ave',
  REPTILE: 'Reptil',
  BUG: 'Bicho',
  PLANT: 'Planta',
  MECH: 'Mech',
  DUSK: 'Oscuridad',
  DAWN: 'Amanecer',
} as const;

// Nombres de rareza
export const RARITY_NAMES = {
  COMMON: 'Común',
  UNCOMMON: 'Poco Común',
  RARE: 'Raro',
  VERY_RARE: 'Ultra Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Legendario',
} as const;

// Emojis por tipo de Axie
export const AXIE_TYPE_EMOJIS = {
  BEAST: '🐉',
  AQUATIC: '🐟',
  BIRD: '🦅',
  REPTILE: '🦎',
  BUG: '🦋',
  PLANT: '🌿',
  MECH: '🤖',
  DUSK: '🌙',
  DAWN: '☀️',
} as const;
