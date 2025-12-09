import React from 'react';
import { 
  GeodeCategory, 
  AxieClass,
  getGeodeVideoPath,
  CATEGORY_INFO,
  AXIE_CLASS_INFO,
  isCategoryAvailable,
  hasGeodeVideos
} from '@/lib/constants/geodes';

interface GeodeVideoProps {
  category: GeodeCategory;
  axieClass: AxieClass;
  className?: string;
  autoPlay?: boolean;
  showFallback?: boolean;
}

/**
 * Componente para renderizar video de geoda con fallback a emoji
 * ACTUALIZADO para sistema de categorías + clases
 */
export function GeodeVideo({ 
  category,
  axieClass,
  className = '',
  autoPlay = true,
  showFallback = true 
}: GeodeVideoProps) {
  const categoryInfo = CATEGORY_INFO[category];
  const classInfo = AXIE_CLASS_INFO[axieClass];
  const videoPath = getGeodeVideoPath(category, axieClass);
  const isAvailable = isCategoryAvailable(category);
  const hasVideos = hasGeodeVideos(category);

  // Debug: mostrar qué video se está cargando
  console.log('🎬 GeodeVideo:', {
    category: categoryInfo.name,
    class: classInfo.displayName,
    videoPath,
    isAvailable,
    hasVideos
  });

  // Si la categoría no está disponible o no tiene videos, mostrar fallback
  if (!isAvailable || !hasVideos) {
    if (!showFallback) return null;
    
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-2">💎</div>
          <p className="text-sm text-gray-400">
            {categoryInfo.name} {classInfo.displayName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Próximamente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <video
        key={videoPath}
        autoPlay={autoPlay}
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
        onError={(e) => {
          console.error('Error loading geode video:', videoPath);
          // Ocultar el video si falla
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src={videoPath} type="video/mp4" />
      </video>
      
      {/* Gradient overlay para mejor apariencia */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${categoryInfo.color}20, transparent)`
        }}
      />
    </div>
  );
}

/**
 * Componente para thumbnail estático (sin autoplay)
 */
export function GeodeThumbnail({ 
  category,
  axieClass,
  className = '' 
}: Omit<GeodeVideoProps, 'autoPlay'>) {
  return (
    <GeodeVideo 
      category={category}
      axieClass={axieClass}
      className={className}
      autoPlay={false}
      showFallback={true}
    />
  );
}

/**
 * Componente para card de geoda con video de fondo
 */
export function GeodeCard({ 
  category,
  axieClass,
  children,
  className = ''
}: {
  category: GeodeCategory;
  axieClass: AxieClass;
  children?: React.ReactNode;
  className?: string;
}) {
  const categoryInfo = CATEGORY_INFO[category];
  
  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0">
        <GeodeVideo 
          category={category}
          axieClass={axieClass}
          className="w-full h-full"
          autoPlay={true}
        />
      </div>
      
      {/* Contenido encima */}
      <div 
        className="relative z-10 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        style={{
          background: `linear-gradient(to top, ${categoryInfo.color}80, ${categoryInfo.color}40, transparent)`
        }}
      >
        {children}
      </div>
    </div>
  );
}
