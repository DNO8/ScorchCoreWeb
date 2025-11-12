/**
 * Constantes para el sistema de Geodas
 * Según whitepaper: 5 categorías × 9 clases de Axie = 45 variantes
 */

// Categorías de Geodas (rareza/nivel)
export enum GeodeCategory {
  PETIT = 0,
  ALTO = 1,
  ANIMAL = 2,
  ULTRAMECH = 3,
  TANQUE = 4,
}

// Clases de Axie (subtipo)
export enum AxieClass {
  BEAST = 0,
  AQUA = 1,
  BIRD = 2,
  REPTILE = 3,
  BUG = 4,
  PLANT = 5,
  MECH = 6,
  DUSK = 7,
  DAWN = 8,
}

// Información de categorías
export const CATEGORY_INFO = {
  [GeodeCategory.PETIT]: {
    id: GeodeCategory.PETIT,
    name: 'Petit',
    displayName: 'Petit (Común)',
    rarity: 'Común',
    maxSupply: 10000,
    miningPower: 75,
    collectionBonus: 2.0, // 2%
    repairCost: 3, // 3% de producción mensual
    color: '#94a3b8', // slate-400
    defaultCost: {
      axs: '100', // 100 AXS según whitepaper
      slp: '50000', // 50,000 SLP
      memento: '100', // 100 mementos
    },
    failureRate: 10, // 10%
  },
  [GeodeCategory.ALTO]: {
    id: GeodeCategory.ALTO,
    name: 'Alto',
    displayName: 'Alto (Poco Común)',
    rarity: 'Poco Común',
    maxSupply: 7500,
    miningPower: 125,
    collectionBonus: 2.0, // 2%
    repairCost: 3, // 3% de producción mensual
    color: '#22c55e', // green-500
    defaultCost: {
      axs: '250',
      slp: '100000',
      memento: '250',
    },
    failureRate: 20, // 20%
  },
  [GeodeCategory.ANIMAL]: {
    id: GeodeCategory.ANIMAL,
    name: 'Animal',
    displayName: 'Animal (Raro)',
    rarity: 'Raro',
    maxSupply: 5000,
    miningPower: 165,
    collectionBonus: 2.0, // 2%
    repairCost: 3, // 3% de producción mensual
    color: '#3b82f6', // blue-500
    defaultCost: {
      axs: '500',
      slp: '150000',
      memento: '500',
    },
    failureRate: 30, // 30%
  },
  [GeodeCategory.ULTRAMECH]: {
    id: GeodeCategory.ULTRAMECH,
    name: 'Ultramech',
    displayName: 'Ultramech (Ultra Raro)',
    rarity: 'Ultra Raro',
    maxSupply: 5000,
    miningPower: 165,
    collectionBonus: 2.0, // 2%
    repairCost: 3, // 3% de producción mensual
    color: '#a855f7', // purple-500
    defaultCost: {
      axs: '1000',
      slp: '250000',
      memento: '1000',
    },
    failureRate: 40, // 40%
  },
  [GeodeCategory.TANQUE]: {
    id: GeodeCategory.TANQUE,
    name: 'Tanque',
    displayName: 'Tanque (Épico)',
    rarity: 'Épico',
    maxSupply: 5000,
    miningPower: 200,
    collectionBonus: 2.0, // 2%
    repairCost: 3, // 3% de producción mensual
    color: '#f59e0b', // amber-500
    defaultCost: {
      axs: '2500',
      slp: '500000',
      memento: '2500',
    },
    failureRate: 50, // 50%
  },
} as const;

// Información de clases de Axie
export const AXIE_CLASS_INFO = {
  [AxieClass.BEAST]: {
    id: AxieClass.BEAST,
    name: 'Beast',
    displayName: 'Bestia',
    icon: '/images/mementos/memento-beast.webp',
    color: '#f59e0b', // amber-500
  },
  [AxieClass.AQUA]: {
    id: AxieClass.AQUA,
    name: 'Aqua',
    displayName: 'Aqua',
    icon: '/images/mementos/memento-aqua.webp',
    color: '#3b82f6', // blue-500
  },
  [AxieClass.BIRD]: {
    id: AxieClass.BIRD,
    name: 'Bird',
    displayName: 'Ave',
    icon: '/images/mementos/memento-bird.webp',
    color: '#ec4899', // pink-500
  },
  [AxieClass.REPTILE]: {
    id: AxieClass.REPTILE,
    name: 'Reptile',
    displayName: 'Reptil',
    icon: '/images/mementos/memento-reptile.webp',
    color: '#a855f7', // purple-500
  },
  [AxieClass.BUG]: {
    id: AxieClass.BUG,
    name: 'Bug',
    displayName: 'Bicho',
    icon: '/images/mementos/memento-bug.webp',
    color: '#ef4444', // red-500
  },
  [AxieClass.PLANT]: {
    id: AxieClass.PLANT,
    name: 'Plant',
    displayName: 'Planta',
    icon: '/images/mementos/memento-plant.webp',
    color: '#22c55e', // green-500
  },
  [AxieClass.MECH]: {
    id: AxieClass.MECH,
    name: 'Mech',
    displayName: 'Mech',
    icon: '/images/mementos/memento-mech.webp',
    color: '#64748b', // slate-500
  },
  [AxieClass.DUSK]: {
    id: AxieClass.DUSK,
    name: 'Dusk',
    displayName: 'Dusk',
    icon: '/images/mementos/memento-dusk.webp',
    color: '#6366f1', // indigo-500
  },
  [AxieClass.DAWN]: {
    id: AxieClass.DAWN,
    name: 'Dawn',
    displayName: 'Dawn',
    icon: '/images/mementos/memento-dawn.webp',
    color: '#f97316', // orange-500
  },
} as const;

// Helper: obtener nombre completo de geoda
export function getGeodeName(category: GeodeCategory, axieClass: AxieClass): string {
  const categoryName = CATEGORY_INFO[category].name;
  const className = AXIE_CLASS_INFO[axieClass].displayName;
  return `${categoryName} ${className}`;
}

// Helper: obtener ruta de video de geoda
export function getGeodeVideoPath(category: GeodeCategory, axieClass: AxieClass): string {
  const categoryName = CATEGORY_INFO[category].name.toLowerCase();
  const categoryNameUpper = CATEGORY_INFO[category].name.toUpperCase();
  
  // Mapeo de clases según los nombres de archivos reales
  // ALTO usa nombres diferentes para DAWN y DUSK
  const classNameMap: Record<AxieClass, string> = {
    [AxieClass.BEAST]: 'BESTIA',
    [AxieClass.AQUA]: 'AQUA',
    [AxieClass.BIRD]: 'AVE',
    [AxieClass.REPTILE]: 'REPTIL',
    [AxieClass.BUG]: 'BICHO',
    [AxieClass.PLANT]: 'PLANTA',
    [AxieClass.MECH]: 'MECH',
    [AxieClass.DUSK]: category === GeodeCategory.ALTO ? 'OSCURIDAD' : 'DUSK',
    [AxieClass.DAWN]: category === GeodeCategory.ALTO ? 'AMANECER' : 'DAWN',
  };
  
  const className = classNameMap[axieClass];
  
  // Formato: "GEODA PETIT BESTIA.mp4"
  return `/images/geodes/${categoryName}/GEODA ${categoryNameUpper} ${className}.mp4`;
}

// Helper: obtener icono de memento por clase
export function getMementoIcon(axieClass: AxieClass): string {
  return AXIE_CLASS_INFO[axieClass].icon;
}

// Helper: verificar si una categoría está disponible (tiene assets)
export function isCategoryAvailable(category: GeodeCategory): boolean {
  // PETIT, ALTO y ANIMAL están disponibles con sus videos
  return category === GeodeCategory.PETIT || 
         category === GeodeCategory.ALTO || 
         category === GeodeCategory.ANIMAL;
}

// Listas para selectores
export const AVAILABLE_CATEGORIES = Object.values(CATEGORY_INFO).filter(cat => 
  isCategoryAvailable(cat.id)
);

export const ALL_AXIE_CLASSES = Object.values(AXIE_CLASS_INFO);
