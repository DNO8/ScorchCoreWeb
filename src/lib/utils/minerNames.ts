/**
 * Helper para mapear minerType y minerNameIndex a nombres completos de miners
 * Basado en la tabla de loot y los nombres de los archivos de thumbnails
 */

// Mapeo completo de nombres según minerType (AxieClass) y minerNameIndex (rarity)
// IMPORTANTE: Estos nombres DEBEN coincidir EXACTAMENTE con los archivos de video
// Los nombres de video NO tienen acentos, solo Ñ
const MINER_NAMES: Record<number, string[]> = {
  // BEAST (0) - TODO: No hay carpeta PETIT BESTIA aún
  0: [
    'Cachorro Ágil',
    'Rastreador Tenaz',
    'Cazador Joven',
    'Garra Impaciente',
    'Cría Feroz',
    'Explorador Audaz',
    'Cachorro Alfa'
  ],
  
  // AQUA (1) - Nombres reales de /PETIT/PETIT AQUA/
  1: [
    'Burbuja Eficiente',
    'Chorro Preciso',
    'Corriente de Tsunami',
    'Corriente Ligera',
    'Flujo Sereno',
    'Gota de Rocío',
    'Gota Rápida'
  ],
  
  // BIRD/AVE (2) - Nombres reales de /PETIT/PETIT AVE/
  2: [
    'Ala Veloz',
    'Corriente Ascendente',
    'Gorrión Sónico',
    'Pequeño Raptor',
    'Picotazo Preciso',
    'Pluma Ligera',
    'Polluelo Vigía'
  ],
  
  // REPTILE/REPTIL (3) - Nombres reales de /PETIT/PETIT REPTIL/
  3: [
    'Caimán Soberano',
    'Cría de Caimán',
    'Escama Venenosa',
    'Escudo Resvaladizo',
    'Gecko Astuto',
    'Mordida Rápida',
    'Sangre Fría'
  ],
  
  // BUG/BICHO (4) - Nombres reales de /PETIT/PETIT BICHO/
  4: [
    'Escarabajo Resiliente',
    'Hormiga Exploradora',
    'Larva Protegida',
    'Pupa Eficiente',
    'Zángano Obrero',
    'Zángano Reina',
    'Zumbido Silencioso'
  ],
  
  // PLANT/PLANTA (5) - Nombres reales de /PETIT/PETIT PLANTA/
  5: [
    'Brote Constante',
    'Brote Milenario',
    'Espina Afilada',
    'Flujo de Savia',
    'Hoja Perenne',
    'Rey Joven',
    'Semilla Durmiente'
  ],
  
  // MECH (6) - Nombres reales de /PETIT/PETIT MECH/
  6: [
    'Chispa Precisa',
    'Circuito Estable',
    'Drón de Prospección',
    'Nano Constructor Alfa',
    'Nano Constructor',
    'Núcleo de Titaneo',
    'Pequeño Lobo'
  ],
  
  // DUSK (7) - Nombres reales de /PETIT/PETIT DUSK/
  7: [
    'Brillo Afímero',
    'Cría del Ocaso',
    'Daga de Sombra',
    'Espía Crepuscular',
    'Penumbra Constante',
    'Sombra Asechante',
    'Susurro Nocturno'
  ],
  
  // DAWN (8) - TODO: No hay carpeta PETIT DAWN aún
  8: [
    'Rayo de Alba',
    'Brillo Matutino',
    'Luz Naciente',
    'Aurora Brillante',
    'Amanecer Dorado',
    'Guardián del Alba',
    'Heraldo del Sol'
  ]
};

/**
 * Obtiene el nombre completo de un miner basado en su tipo e índice
 */
export function getMinerName(minerType: number, minerNameIndex: number): string {
  const names = MINER_NAMES[minerType];
  
  if (!names) {
    console.warn(`Unknown minerType: ${minerType}`);
    return `Unknown Miner #${minerType}`;
  }
  
  if (minerNameIndex >= names.length) {
    console.warn(`Invalid minerNameIndex ${minerNameIndex} for minerType ${minerType}`);
    return names[0]; // Fallback al primero
  }
  
  return names[minerNameIndex];
}

/**
 * Obtiene el nombre de la clase de Axie/Miner
 */
export function getMinerTypeName(minerType: number): string {
  const typeNames: Record<number, string> = {
    0: 'Beast',
    1: 'Aqua',
    2: 'Bird',
    3: 'Reptile',
    4: 'Bug',
    5: 'Plant',
    6: 'Mech',
    7: 'Dusk',
    8: 'Dawn'
  };
  
  return typeNames[minerType] || 'Unknown';
}

/**
 * Convierte un nombre de miner a formato de archivo (para videos/thumbnails)
 * Ej: "Chorro Preciso" -> "CHORRO_PRECISO"
 * Nota: Los archivos usan Ñ mayúscula pero NO usan otros acentos (excepto algunos casos especiales)
 * Por seguridad, mantenemos Ñ y convertimos otros acentos
 */
export function getMinerFileName(minerName: string): string {
  return minerName
    .toUpperCase()
    .replace(/\s+/g, '_');
    // Nota: Mantenemos Ñ y otros caracteres especiales tal como están
    // Los archivos usan: PEQUEÑO (con Ñ), CAÑÓN (con Ñ), POLILLA_BOGÓN (con Ó)
}

/**
 * Obtiene la ruta completa del video de un miner
 * Basado en category, class y nombre
 * NOTA: Los videos usan ESPACIOS en los nombres, NO guiones bajos
 * NOTA: Los videos NO tienen acentos (á→A, é→E, etc.)
 */
export function getMinerVideoPath(
  category: string,
  axieClass: string,
  minerName: string
): string {
  // Los videos tienen espacios y NO tienen acentos
  const fileName = minerName
    .toUpperCase()
    .normalize('NFD')                    // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')    // Quitar marcas diacríticas (acentos)
    .replace(/Ñ/g, 'Ñ');                // Mantener Ñ (por si se quitó)
  
  // Para ULTRAMECH, las subcarpetas usan "ULTRA" en lugar de "ULTRAMECH"
  const subfolder = category === 'ULTRAMECH' ? 'ULTRA' : category;
  return `/images/miners/${category}/${subfolder} ${axieClass}/${fileName}.mp4`;
}

/**
 * Determina la rareza basada en el índice del nombre
 */
export function getMinerRarity(minerNameIndex: number): string {
  // Los índices 0-5 son common, el 6 es epic
  if (minerNameIndex === 6) return 'epic';
  if (minerNameIndex >= 4) return 'rare';
  if (minerNameIndex >= 2) return 'uncommon';
  return 'common';
}
