'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { Card, Button, Badge, Loading, Toast, useToast } from '@/components/ui';
import { GeodeVideo } from '@/components/GeodeVideo';
import { HatchRoulette } from '@/components/HatchRoulette';
import { HatchSuccessModal } from '@/components/HatchSuccessModal';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useInventoryFacade } from '@/lib/hooks/useInventoryFacade';
import { useForgeFacade } from '@/lib/hooks/useForgeFacade';
import { useMetadataService } from '@/lib/hooks/useMetadataService';
import { useContractManager } from '@/lib/hooks/useContractManager';
import { createServiceLogger } from '@/lib/utils/logger';
import type { GeodeInventoryInfo } from '@/lib/facades/InventoryFacade';
import type { HatchResult } from '@/components/types/HatchTypes';
import { 
  GeodeCategory,
  AxieClass,
  CATEGORY_INFO,
  AXIE_CLASS_INFO
} from '@/lib/constants/geodes';

const logger = createServiceLogger('InventoryPage');

export default function InventoryPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { address } = useAccount();
  const metadataService = useMetadataService();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();
  const { contractManager } = useContractManager(); // Agregado
  const inventoryFacade = useInventoryFacade();
  const forgeFacade = useForgeFacade(); // Ya no se usa para hatch, pero se mantiene por compatibilidad

  const [geodes, setGeodes] = useState<GeodeInventoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHatchAnimation, setShowHatchAnimation] = useState(false);
  const [hatchingGeodeId, setHatchingGeodeId] = useState<bigint | null>(null);
  const [hatchingGeode, setHatchingGeode] = useState<GeodeInventoryInfo | null>(null);
  const [isTxConfirmed, setIsTxConfirmed] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hatchedMiner, setHatchedMiner] = useState<{
    id: bigint;
    name: string;
    rarity: string;
    power: number;
    videoUrl: string;
    category: GeodeCategory;
    axieClass: AxieClass;
  } | null>(null);

  const loadGeodes = async () => {
    if (!address || !inventoryFacade) {
      logger.debug('Carga de geodas omitida - falta address o facade');
      return;
    }

    logger.info('Iniciando carga de geodas del usuario');
    setIsLoading(true);
    setError(null);

    try {
      const geodesData = await inventoryFacade.getUserGeodes(address);
      logger.info(`Geodas cargadas exitosamente: ${geodesData.length}`);
      setGeodes(geodesData);
    } catch (err) {
      logger.error('Error cargando geodas', err);
      setError(err instanceof Error ? err.message : 'Error loading geodes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address && inventoryFacade) {
      logger.debug('Condiciones OK - cargando geodas');
      loadGeodes();
    }
  }, [isConnected, address, inventoryFacade]);

  // Redirect automático si no hay conexión después de 3 segundos
  useEffect(() => {
    if (!isConnected) {
      const timeout = setTimeout(() => {
        logger.info('No hay conexión - redirigiendo a landing page');
        router.push('/');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, router]);

  // Refresh automático cada 30 segundos
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      logger.debug('Auto-refresh de geodas');
      loadGeodes();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isConnected, address, loadGeodes]);

  const getTimeRemaining = (hatchTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = hatchTime - now;

    if (remaining <= 0) return 'Listo para eclosionar';

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h restantes`;
    }

    return `${hours}h ${minutes}m restantes`;
  };

  const handleHatchGeode = async (geodeId: bigint) => {
    logger.info('Iniciando eclosión de geoda', { geodeId: geodeId.toString() });

    try {
      const geodeToHatch = geodes.find(g => g.id === geodeId);
      
      if (!geodeToHatch) {
        logger.error('Geoda no encontrada', { geodeId: geodeId.toString() });
        return;
      }

      if (!contractManager) {
        logger.error('ContractManager no disponible');
        showError('Sistema no inicializado');
        return;
      }
      
      logger.debug('Configurando animación de eclosión', {
        geodeId: geodeId.toString(),
        fullName: geodeToHatch.fullName
      });

      setHatchingGeodeId(geodeId);
      setHatchingGeode(geodeToHatch);
      setShowHatchAnimation(true);
      setIsTxConfirmed(false);

      setTimeout(async () => {
        try {
          logger.info('🔵 [DEBUG] Iniciando setTimeout de eclosión', { geodeId: geodeId.toString() });
          showInfo('Enviando transacción de eclosión...');
          
          logger.info('🔵 [DEBUG] Obteniendo GeodeHatcher contract');
          // Usar GeodeHatcher en lugar de ForgeFacade
          const geodeHatcher = contractManager.getGeodeHatcher();
          
          logger.info('🔵 [DEBUG] GeodeHatcher obtenido, llamando openGeode...', { 
            geodeId: geodeId.toString(), 
            geodeIdType: typeof geodeId,
            hasOpenGeode: typeof geodeHatcher.openGeode 
          });
          
          let result;
          try {
            logger.info('🔵 [DEBUG] JUSTO ANTES de llamar openGeode');
            result = await geodeHatcher.openGeode(geodeId);
            logger.info('🔵 [DEBUG] JUSTO DESPUES de llamar openGeode', { 
              txHash: result.transaction.hash,
              minerId: result.minerId.toString(),
              success: result.success 
            });
          } catch (openGeodeError) {
            logger.error('🔴 [DEBUG] ERROR en openGeode:', openGeodeError);
            throw openGeodeError;
          }
          
          logger.info('🔵 [DEBUG] openGeode completado', { 
            txHash: result.transaction.hash,
            minerId: result.minerId.toString(),
            success: result.success 
          });
          
          logger.info('Eclosión exitosa', { 
            txHash: result.transaction.hash,
            success: result.success,
            minerId: result.minerId.toString()
          });

          showSuccess(`¡Geoda eclosionada! Minero ID: ${result.minerId} - Tx: ${result.transaction.hash.slice(0, 10)}...`);
          setIsTxConfirmed(true);
          
          logger.debug('Recargando geodas post-eclosión');
          await loadGeodes();
        } catch (contractError) {
          logger.error('Error en eclosión', contractError);
          
          let errorMessage = 'Error al eclosionar geoda';
          if (contractError instanceof Error) {
            if (contractError.message.includes('user rejected') || contractError.message.includes('User rejected')) {
              errorMessage = 'Transacción cancelada por el usuario';
            } else if (contractError.message.includes('insufficient funds')) {
              errorMessage = 'Fondos insuficientes para gas';
            } else {
              errorMessage = contractError.message.substring(0, 100);
            }
          }
          
          showError(errorMessage);
          setShowHatchAnimation(false);
          setHatchingGeodeId(null);
          setHatchingGeode(null);
          setIsTxConfirmed(false);
        }
      }, 500);
      
    } catch (error) {
      logger.error('Error general en proceso de eclosión', error);
      setShowHatchAnimation(false);
      setHatchingGeodeId(null);
      setHatchingGeode(null);
    }
  };

  const handleRouletteComplete = async (result: HatchResult) => {
    logger.info('Ruleta de eclosión completada', {
      minerId: result.minerId.toString(),
      name: result.name,
      rarity: result.rarity
    });
    
    if (!hatchingGeode) return;
    
    const categoryFolders: Record<GeodeCategory, string> = {
      [GeodeCategory.PETIT]: 'PETIT',
      [GeodeCategory.ALTO]: 'ALTO',
      [GeodeCategory.ANIMAL]: 'ANIMAL',
      [GeodeCategory.ULTRAMECH]: 'ULTRAMECH',
      [GeodeCategory.TANQUE]: 'TANK'
    };
    
    const classFolders: Record<AxieClass, string> = {
      [AxieClass.AQUA]: 'AQUA',
      [AxieClass.BIRD]: 'AVE',
      [AxieClass.BUG]: 'BICHO',
      [AxieClass.PLANT]: 'PLANTA',
      [AxieClass.REPTILE]: 'REPTIL',
      [AxieClass.BEAST]: 'BESTIA',
      [AxieClass.MECH]: 'MECH',
      [AxieClass.DUSK]: 'DUSK',
      [AxieClass.DAWN]: 'DAWN'
    };
    
    // Usar video local basado en category, minerType, minerIndex del miner
    const { getLocalMinerVideo } = await import('@/lib/utils/localMinerData');
    const videoUrl = getLocalMinerVideo(
      result.category, 
      result.minerType, 
      result.minerIndex
    );
    
    logger.debug('Video URL local generada', { 
      videoUrl,
      category: result.category,
      minerType: result.minerType,
      minerIndex: result.minerIndex
    });
    
    setHatchedMiner({
      id: hatchingGeodeId!,
      name: result.name,
      rarity: result.rarity,
      power: result.power,
      videoUrl,
      category: hatchingGeode.category,
      axieClass: hatchingGeode.axieClass
    });
    
    logger.debug('Mostrando modal de éxito');
    setTimeout(() => {
      setShowHatchAnimation(false);
      setShowSuccessModal(true);
      setIsTxConfirmed(false);
    }, 1500);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loading size="lg" text="Verificando conexión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                🎒 Mi Inventario
              </h1>
              <p className="text-gray-400 text-lg">
                Geodas Cristalinas y CoreMiners
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="secondary">
                  ← Volver al Dashboard
                </Button>
              </Link>
              <Link href="/forge">
                <Button variant="primary">
                  🔨 Forjar Nueva Geoda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" text="Cargando inventario..." />
          </div>
        )}

        {error && !isLoading && (
          <Card variant="glass" className="p-6 bg-red-900/20 border-red-500">
            <div className="flex items-center gap-3">
              <div className="text-2xl">❌</div>
              <div>
                <div className="font-bold text-red-500">Error</div>
                <div className="text-sm text-gray-300">{error}</div>
              </div>
            </div>
          </Card>
        )}

        {!isLoading && !error && geodes.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <div className="text-6xl mb-6">🥚</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No tienes geodas todavía
            </h2>
            <p className="text-gray-400 mb-6">
              Forja tu primera geoda para comenzar tu aventura en ScorchCore
            </p>
            <Link href="/forge">
              <Button variant="primary" size="lg">
                🔨 Ir a la Forja
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && !error && geodes.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              Mis Geodas ({geodes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {geodes.map((geode) => (
                <Card
                  key={geode.id.toString()}
                  variant={geode.canHatch ? 'gradient' : 'glass'}
                  hover
                  className="p-6"
                >
                  <div className="mb-4 flex items-center justify-center bg-black/20 rounded-lg overflow-hidden" style={{ height: '240px' }}>
                    <GeodeVideo 
                      category={geode.category}
                      axieClass={geode.axieClass}
                      className="h-full w-auto max-w-full object-contain"
                      autoPlay={true}
                    />
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Geoda {geode.fullName}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Badge 
                        variant="info" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: CATEGORY_INFO[geode.category].color + '40',
                          borderColor: CATEGORY_INFO[geode.category].color
                        }}
                      >
                        {geode.categoryName}
                      </Badge>
                      <Badge 
                        variant="default" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: AXIE_CLASS_INFO[geode.axieClass].color + '40',
                          borderColor: AXIE_CLASS_INFO[geode.axieClass].color
                        }}
                      >
                        {geode.className}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID #{geode.id.toString()}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gray-700">
                      <span className="text-gray-400 text-sm">Estado:</span>
                      {geode.isHatched ? (
                        <Badge variant="success">Eclosionada</Badge>
                      ) : geode.canHatch ? (
                        <Badge variant="warning">Lista</Badge>
                      ) : (
                        <Badge variant="info">Incubando</Badge>
                      )}
                    </div>

                    {!geode.isHatched && (
                      <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gray-700">
                        <span className="text-gray-400 text-sm">Tiempo:</span>
                        <span className="text-white text-sm font-medium">
                          {getTimeRemaining(geode.hatchTime)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-gray-700">
                      <span className="text-gray-400 text-sm">Creada:</span>
                      <span className="text-white text-sm">
                        {new Date(geode.createdAt * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!geode.isHatched && geode.canHatch && (
                    <Button
                      variant="primary"
                      className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      onClick={() => handleHatchGeode(geode.id)}
                      disabled={hatchingGeodeId === geode.id}
                    >
                      {hatchingGeodeId === geode.id ? (
                        <>🎲 Eclosionando...</>
                      ) : (
                        <>🐣 Eclosionar Ahora</>
                      )}
                    </Button>
                  )}

                  {geode.isHatched && (
                    <Button variant="outline" className="w-full" disabled>
                      Ya Eclosionada
                    </Button>
                  )}

                  {!geode.isHatched && !geode.canHatch && (
                    <Button variant="outline" className="w-full" disabled>
                      ⏳ Incubando...
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {showHatchAnimation && hatchingGeode && (
        <HatchRoulette
          category={hatchingGeode.category}
          axieClass={hatchingGeode.axieClass}
          isVisible={showHatchAnimation}
          onComplete={handleRouletteComplete}
          loopUntilConfirm={true}
          isConfirmed={isTxConfirmed}
        />
      )}

      {showSuccessModal && hatchedMiner && (
        <HatchSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setHatchedMiner(null);
            setHatchingGeodeId(null);
            setHatchingGeode(null);
          }}
          category={hatchedMiner.category}
          axieClass={hatchedMiner.axieClass}
          minerId={hatchedMiner.id}
          minerName={hatchedMiner.name}
          minerRarity={hatchedMiner.rarity}
          minerPower={hatchedMiner.power}
          minerVideoUrl={hatchedMiner.videoUrl}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
