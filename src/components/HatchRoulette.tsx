'use client';

import { useState, useEffect, useRef } from 'react';
import { GeodeCategory, AxieClass } from '@/lib/constants/geodes';
import { gsap } from 'gsap';
import { thumbnailNames } from './thumbnailMappings';

interface HatchRouletteProps {
  category: GeodeCategory;
  axieClass: AxieClass;
  isVisible: boolean;
  onComplete: (result: any) => void;
  loopUntilConfirm?: boolean;
  isConfirmed?: boolean;
}

// Obtener nombres de thumbnails según tipo de geoda
const getThumbnails = (category: GeodeCategory, axieClass: AxieClass): string[] => {
  const categoryMap: Record<number, string> = {
    [GeodeCategory.PETIT]: 'PETIT',
    [GeodeCategory.ALTO]: 'ALTO',
    [GeodeCategory.ANIMAL]: 'ANIMAL',
    [GeodeCategory.ULTRAMECH]: 'ULTRAMECH',
    [GeodeCategory.TANQUE]: 'TANK'
  };

  const classMap: Record<number, string> = {
    [AxieClass.AQUA]: 'AQUA',
    [AxieClass.BIRD]: 'AVE',
    [AxieClass.BUG]: 'BICHO',
    [AxieClass.DUSK]: 'DUSK',
    [AxieClass.MECH]: 'MECH',
    [AxieClass.PLANT]: 'PLANTA',
    [AxieClass.REPTILE]: 'REPTIL',
    [AxieClass.BEAST]: 'BESTIA',
    [AxieClass.DAWN]: 'DAWN'
  };

  const categoryFolder = categoryMap[category];
  // Para ULTRAMECH, las subcarpetas usan "ULTRA" en lugar de "ULTRAMECH"
  const subfolder = category === GeodeCategory.ULTRAMECH ? 'ULTRA' : categoryFolder;
  const classFolder = `${subfolder} ${classMap[axieClass]}`;
  const basePath = `/images/miners-thumbnails/${categoryFolder}/${classFolder}`;

  // Usar el mapping importado desde thumbnailMappings.ts
  // El mapping contiene todos los thumbnails para PETIT, ALTO, ANIMAL, ULTRAMECH y TANK
  // Para ULTRAMECH, las claves en el mapping usan "ULTRA" no "ULTRAMECH"
  const key = `${subfolder}_${classMap[axieClass]}`;
  
  // Si no hay thumbnails mapeados, retornar array vacío
  const files = thumbnailNames[key];
  
  if (!files) {
    console.warn(`⚠️ No hay thumbnails mapeados para ${key}`);
    return [];
  }

  return files.map(f => `${basePath}/${f}`);
};

// Datos de mineros según manual de forja
interface MinerData {
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
  power: number;
}

// Mapeo de mineros según tipo de geoda (basado en manual.txt)
const getMinerData = (category: GeodeCategory, axieClass: AxieClass): MinerData[] => {
  const key = `${category}_${axieClass}`;
  
  // Mapeo completo de nombres reales según manual.txt
  const minerNames: Record<string, MinerData[]> = {
    // PETIT BEAST (0_0)
    '0_0': [
      { name: 'Cachorro Ágil', rarity: 'common', probability: 20, power: 50 },
      { name: 'Rastreador Tenaz', rarity: 'common', probability: 20, power: 60 },
      { name: 'Cazador Joven', rarity: 'common', probability: 18, power: 70 },
      { name: 'Garra Impaciente', rarity: 'common', probability: 16, power: 80 },
      { name: 'Cría Feroz', rarity: 'common', probability: 13, power: 90 },
      { name: 'Explorador Audaz', rarity: 'common', probability: 12, power: 100 },
      { name: 'Cachorro Alfa', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT AQUA (0_1)
    '0_1': [
      { name: 'Gota Rápida', rarity: 'common', probability: 20, power: 50 },
      { name: 'Corriente Ligera', rarity: 'common', probability: 20, power: 60 },
      { name: 'Burbuja Eficiente', rarity: 'common', probability: 18, power: 70 },
      { name: 'Chorro Preciso', rarity: 'common', probability: 16, power: 80 },
      { name: 'Flujo Sereno', rarity: 'common', probability: 13, power: 90 },
      { name: 'Gota de Rocío', rarity: 'common', probability: 12, power: 100 },
      { name: 'Corriente de Tsunami', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT BIRD (0_2)
    '0_2': [
      { name: 'Ala Veloz', rarity: 'common', probability: 20, power: 50 },
      { name: 'Corriente Ascendente', rarity: 'common', probability: 20, power: 60 },
      { name: 'Pluma Ligera', rarity: 'common', probability: 18, power: 70 },
      { name: 'Picotazo Preciso', rarity: 'common', probability: 16, power: 80 },
      { name: 'Pequeño Raptor', rarity: 'common', probability: 13, power: 90 },
      { name: 'Polluelo Vigía', rarity: 'common', probability: 12, power: 100 },
      { name: 'Gorrión Sónico', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT BUG (0_3)
    '0_3': [
      { name: 'Zángano Obrero', rarity: 'common', probability: 20, power: 50 },
      { name: 'Hormiga Exploradora', rarity: 'common', probability: 20, power: 60 },
      { name: 'Pupa Eficiente', rarity: 'common', probability: 18, power: 70 },
      { name: 'Zumbido Silencioso', rarity: 'common', probability: 16, power: 80 },
      { name: 'Escarabajo Resiliente', rarity: 'common', probability: 13, power: 90 },
      { name: 'Larva Protegida', rarity: 'common', probability: 12, power: 100 },
      { name: 'Zángano Reina', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT PLANT (0_4)
    '0_4': [
      { name: 'Brote Constante', rarity: 'common', probability: 20, power: 50 },
      { name: 'Raíz Joven', rarity: 'common', probability: 20, power: 60 },
      { name: 'Hoja Perenne', rarity: 'common', probability: 18, power: 70 },
      { name: 'Espina Afilada', rarity: 'common', probability: 16, power: 80 },
      { name: 'Flujo de Savia', rarity: 'common', probability: 13, power: 90 },
      { name: 'Semilla Durmiente', rarity: 'common', probability: 12, power: 100 },
      { name: 'Brote Milenario', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT REPTILE (0_5)
    '0_5': [
      { name: 'Escama Venenosa', rarity: 'common', probability: 20, power: 50 },
      { name: 'Gecko Astuto', rarity: 'common', probability: 20, power: 60 },
      { name: 'Escudo Resbaladizo', rarity: 'common', probability: 18, power: 70 },
      { name: 'Mordida Rápida', rarity: 'common', probability: 16, power: 80 },
      { name: 'Sangre Fría', rarity: 'common', probability: 13, power: 90 },
      { name: 'Cría de Caimán', rarity: 'common', probability: 12, power: 100 },
      { name: 'Caimán Soberano', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT MECH (0_6)
    '0_6': [
      { name: 'Nano-Constructor', rarity: 'common', probability: 20, power: 50 },
      { name: 'Dron de Prospección', rarity: 'common', probability: 20, power: 60 },
      { name: 'Pequeño Lobo', rarity: 'common', probability: 18, power: 70 },
      { name: 'Chispa Precisa', rarity: 'common', probability: 16, power: 80 },
      { name: 'Circuito Estable', rarity: 'common', probability: 13, power: 90 },
      { name: 'Tornillo de Titanio', rarity: 'common', probability: 12, power: 100 },
      { name: 'Nano-Constructor Alfa', rarity: 'epic', probability: 1, power: 500 }
    ],
    // PETIT DUSK (0_7)
    '0_7': [
      { name: 'Susurro Nocturno', rarity: 'common', probability: 20, power: 50 },
      { name: 'Espía Crepuscular', rarity: 'common', probability: 20, power: 60 },
      { name: 'Brillo Efímero', rarity: 'common', probability: 18, power: 70 },
      { name: 'Daga de Sombra', rarity: 'common', probability: 16, power: 80 },
      { name: 'Penumbra Constante', rarity: 'common', probability: 13, power: 90 },
      { name: 'Cría del Ocaso', rarity: 'common', probability: 12, power: 100 },
      { name: 'Sombra Acechante', rarity: 'epic', probability: 1, power: 500 }
    ],
  };

  // Si existe mapeo específico, usarlo
  if (minerNames[key]) {
    return minerNames[key];
  }
  
  // Fallback por categoría (patrón de rarezas genérico)
  switch (category) {
    case GeodeCategory.PETIT: // 0
      return [
        { name: 'Miner 1', rarity: 'common', probability: 20, power: 50 },
        { name: 'Miner 2', rarity: 'common', probability: 20, power: 60 },
        { name: 'Miner 3', rarity: 'common', probability: 18, power: 70 },
        { name: 'Miner 4', rarity: 'common', probability: 16, power: 80 },
        { name: 'Miner 5', rarity: 'common', probability: 13, power: 90 },
        { name: 'Miner 6', rarity: 'common', probability: 12, power: 100 },
        { name: 'Epic Miner', rarity: 'epic', probability: 1, power: 500 }
      ];
      
    case GeodeCategory.ALTO: // 1
      // Alto: 2 Comunes + 2 Poco Comunes + 2 Raros + 1 Épico
      return [
        { name: 'Miner 1', rarity: 'common', probability: 20, power: 100 },
        { name: 'Miner 2', rarity: 'common', probability: 20, power: 110 },
        { name: 'Miner 3', rarity: 'common', probability: 18, power: 120 },
        { name: 'Miner 4', rarity: 'common', probability: 16, power: 130 },
        { name: 'Miner 5', rarity: 'rare', probability: 13, power: 140 },
        { name: 'Miner 6', rarity: 'rare', probability: 12, power: 150 },
        { name: 'Epic Miner', rarity: 'epic', probability: 1, power: 750 }
      ];
      
    case GeodeCategory.ANIMAL: // 2
      // Animal: 2 Poco Comunes + 2 Raros + 2 Ultra Raros + 1 Épico
      return [
        { name: 'Miner 1', rarity: 'common', probability: 20, power: 120 },
        { name: 'Miner 2', rarity: 'common', probability: 20, power: 140 },
        { name: 'Miner 3', rarity: 'rare', probability: 18, power: 160 },
        { name: 'Miner 4', rarity: 'rare', probability: 16, power: 180 },
        { name: 'Miner 5', rarity: 'rare', probability: 13, power: 200 },
        { name: 'Miner 6', rarity: 'rare', probability: 12, power: 220 },
        { name: 'Epic Miner', rarity: 'epic', probability: 1, power: 1000 }
      ];
      
    case GeodeCategory.ULTRAMECH: // 3
      // Ultramech: 2 Poco Comunes + 2 Raros + 2 Ultra Raros + 1 Épico
      return [
        { name: 'Miner 1', rarity: 'common', probability: 20, power: 120 },
        { name: 'Miner 2', rarity: 'common', probability: 20, power: 140 },
        { name: 'Miner 3', rarity: 'rare', probability: 18, power: 160 },
        { name: 'Miner 4', rarity: 'rare', probability: 16, power: 180 },
        { name: 'Miner 5', rarity: 'rare', probability: 13, power: 200 },
        { name: 'Miner 6', rarity: 'rare', probability: 12, power: 220 },
        { name: 'Epic Miner', rarity: 'epic', probability: 1, power: 1000 }
      ];
      
    case GeodeCategory.TANQUE: // 4
      // Tanque: 2 Raros + 4 Ultra Raros + 1 Legendario
      return [
        { name: 'Miner 1', rarity: 'rare', probability: 20, power: 150 },
        { name: 'Miner 2', rarity: 'rare', probability: 20, power: 170 },
        { name: 'Miner 3', rarity: 'rare', probability: 18, power: 190 },
        { name: 'Miner 4', rarity: 'rare', probability: 16, power: 210 },
        { name: 'Miner 5', rarity: 'rare', probability: 13, power: 230 },
        { name: 'Miner 6', rarity: 'rare', probability: 12, power: 250 },
        { name: 'Legendary Miner', rarity: 'legendary', probability: 1, power: 1500 }
      ];
      
    default:
      // Fallback genérico para tipos no definidos
      return [
        { name: 'Common 1', rarity: 'common', probability: 20, power: 50 },
        { name: 'Common 2', rarity: 'common', probability: 20, power: 60 },
        { name: 'Common 3', rarity: 'common', probability: 18, power: 70 },
        { name: 'Common 4', rarity: 'common', probability: 16, power: 80 },
        { name: 'Rare 1', rarity: 'rare', probability: 13, power: 90 },
        { name: 'Rare 2', rarity: 'rare', probability: 12, power: 100 },
        { name: 'Epic', rarity: 'epic', probability: 1, power: 500 }
      ];
  }
};

// Colores por rareza
const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: 'bg-gray-500',
    rare: 'bg-purple-500',
    epic: 'bg-red-500',
    legendary: 'bg-yellow-500'
  };
  
  return colors[rarity] || 'bg-gray-500';
};


export function HatchRoulette({ category, axieClass, isVisible, onComplete, loopUntilConfirm = false, isConfirmed = false }: HatchRouletteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const hasAppliedRNG = useRef<boolean>(false); // Para evitar doble ejecución del RNG
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Thumbnail seleccionado
  const thumbnails = getThumbnails(category, axieClass);
  const minerData = getMinerData(category, axieClass);
  
  // Extraer nombres reales de los thumbnails (sin -thumbnail.webp)
  const realMinerNames = thumbnails.map(path => {
    const fileName = path.split('/').pop() || '';
    // Quitar -thumbnail.webp o -thumbnaiL.webp (case insensitive) y reemplazar _ por espacios
    return fileName
      .replace(/-thumbnail\.webp$/i, '') // Case insensitive
      .replace(/_/g, ' ');
  });

  // Cleanup y reset
  useEffect(() => {
    console.log('🟢 [ROULETTE] Componente montado');
    
    // Resetear flag y selectedIndex cuando el componente se vuelve a mostrar
    if (isVisible) {
      hasAppliedRNG.current = false;
      setSelectedIndex(null);
    }
    
    return () => {
      console.log('🔴 [ROULETTE] Componente desmontando, matando animación GSAP');
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      hasAppliedRNG.current = false; // Reset al desmontar
      setSelectedIndex(null); // Reset selectedIndex
    };
  }, [isVisible]);

  // Placeholder infinito con GSAP
  useEffect(() => {
    if (!isVisible || !containerRef.current) {
      console.log('⚠️ [ROULETTE] No visible o sin ref, no iniciando');
      return;
    }
    if (animationRef.current) {
      console.log('⚠️ [ROULETTE] Animación ya existe, no duplicando');
      return;
    }

    console.log('🎲 [ROULETTE] Iniciando placeholder infinito con GSAP');
    console.log('🎲 [ROULETTE] Thumbnails count:', thumbnails.length);
    
    // Animar continuamente hacia la izquierda
    // Con 7 thumbnails de 208px cada uno = 1456px por ciclo completo
    const cycleDistance = thumbnails.length * 208;
    
    animationRef.current = gsap.to(containerRef.current, {
      x: -cycleDistance, // mover 1 ciclo completo
      duration: 2.5, // 2.5 segundos por ciclo 
      ease: 'none', // velocidad constante
      repeat: -1, // repetir infinitamente
      modifiers: {
        x: (x: string) => {
          // Wrap seamless: resetear a 0 cuando completa un ciclo
          const numX = parseFloat(x);
          return `${numX % -cycleDistance}px`;
        }
      },
      onRepeat: () => {
        console.log('� [ROULETTE] Ciclo completado, continuando...');
      }
    });
    
    console.log('✅ [ROULETTE] Animación GSAP creada');

  }, [isVisible, thumbnails.length]);

  // Cuando se confirma: aplicar RNG y desacelerar
  useEffect(() => {
    if (!isConfirmed || !loopUntilConfirm) return;
    if (!animationRef.current || !containerRef.current) return;
    if (hasAppliedRNG.current) return; // Evitar doble ejecución

    console.log('✅ [ROULETTE] Contrato confirmado, aplicando RNG');
    hasAppliedRNG.current = true; // Marcar como ejecutado
    
    // Detener animación placeholder
    animationRef.current.kill();
    animationRef.current = null;

    // Sistema RNG basado en probabilidades del manual
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedIndex = 0;
    
    for (let i = 0; i < minerData.length; i++) {
      cumulative += minerData[i].probability;
      if (random < cumulative) {
        selectedIndex = i;
        break;
      }
    }
    
    const selectedMiner = minerData[selectedIndex];
    const realMinerName = realMinerNames[selectedIndex] || selectedMiner.name;
    console.log('🎯 [ROULETTE] Minero seleccionado:', realMinerName, 'rareza:', selectedMiner.rarity);

    // Calcular posición final centrada
    const thumbnailWidth = 192; // w-48
    const gap = 16; // space-x-4
    const containerPadding = 16; // p-4
    const thumbnailTotalWidth = thumbnailWidth + gap; // 208px
    const cycleDistance = minerData.length * thumbnailTotalWidth;
    
    // Obtener el centro del contenedor
    const rouletteContainer = containerRef.current.parentElement;
    if (!rouletteContainer) return;
    const containerCenter = rouletteContainer.getBoundingClientRect().width / 2;
    
    // Calcular la posición absoluta del thumbnail seleccionado en el ciclo 20
    // Ciclo 20: 20 vueltas completas + el índice seleccionado
    const targetCycle = 20;
    const thumbnailAbsoluteIndex = (targetCycle * minerData.length) + selectedIndex;
    
    // Posición del borde izquierdo del thumbnail
    const thumbnailLeftPosition = containerPadding + (thumbnailAbsoluteIndex * thumbnailTotalWidth);
    
    // Posición del centro del thumbnail
    const thumbnailCenterPosition = thumbnailLeftPosition + (thumbnailWidth / 2);
    
    // Para centrar: mover el contenedor de forma que el centro del thumbnail esté en el centro del viewport
    const finalPosition = thumbnailCenterPosition - containerCenter;
    
    console.log('🎯 [ROULETTE] Cálculo simplificado:', {
      selectedIndex,
      targetCycle,
      thumbnailAbsoluteIndex,
      thumbnailCenterPosition,
      containerCenter,
      finalPosition
    });
    
    // Animación de desaceleración: empieza rápido (1s) y desacelera gradualmente
    animationRef.current = gsap.to(containerRef.current, {
      x: -finalPosition,
      duration: 5, // 5 segundos total de desaceleración
      ease: 'power4.out', // desaceleración fuerte al final
      onComplete: () => {
        console.log('✅ [ROULETTE] Animación completada');
        // Resaltar el thumbnail seleccionado
        setSelectedIndex(selectedIndex);
        
        setTimeout(() => {
          onComplete({
            id: selectedIndex,
            name: realMinerName, // Usar nombre real del archivo
            rarity: selectedMiner.rarity,
            power: selectedMiner.power
          });
        }, 1500); // Dar tiempo para ver el efecto
      }
    });

  }, [isConfirmed, loopUntilConfirm, onComplete, minerData, realMinerNames]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 max-w-4xl w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          🐣 Eclosionando Geoda...
        </h2>
        
        {/* Ruleta - Placeholder infinito */}
        <div className="relative overflow-hidden rounded-lg bg-gray-800 p-4 h-80">
          <div
            ref={containerRef}
            className="flex space-x-4"
            style={{
              willChange: 'transform'
            }}
          >
            {/* Repetir thumbnails 100 veces = suficiente para placeholder */}
            {Array.from({ length: 100 }).map((_, copyIndex) => (
              thumbnails.map((thumbPath, thumbIndex) => {
                const isSelected = selectedIndex === thumbIndex && copyIndex === 20; // Solo resaltar en ciclo 20 (donde cae)
                return (
                  <div
                    key={`${copyIndex}-${thumbIndex}`}
                    className={`shrink-0 w-48 flex flex-col transition-all duration-500 ${
                      isSelected ? 'scale-110 z-30' : ''
                    }`}
                  >
                    <div className={`h-64 rounded-t-lg overflow-hidden bg-gray-700 ${
                      isSelected ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse' : ''
                    }`}>
                      <img
                        src={thumbPath}
                        alt={`Miner ${thumbIndex}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Barra de rareza */}
                    <div className={`h-2 rounded-b-lg ${getRarityColor(minerData[thumbIndex % minerData.length]?.rarity || 'common')}`}></div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-400">Esperando confirmación...</p>
        </div>
      </div>
    </div>
  );
}
