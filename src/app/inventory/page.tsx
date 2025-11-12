'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { Card, Button, Badge, Loading } from '@/components/ui';
import { GeodeVideo } from '@/components/GeodeVideo';
import Link from 'next/link';
import { useAccount, usePublicClient } from 'wagmi';
import { useContracts } from '@/lib/hooks/useContracts';
import { ethers } from 'ethers';
import { GEODE_NFT_ABI, TRANSMUTER_ABI } from '@/lib/abis';
import { 
  GeodeCategory,
  AxieClass,
  CATEGORY_INFO,
  AXIE_CLASS_INFO,
  getGeodeName
} from '@/lib/constants/geodes';

interface GeodeInfo {
  id: bigint;
  category: GeodeCategory;
  axieClass: AxieClass;
  categoryName: string;
  className: string;
  fullName: string;
  owner: string;
  createdAt: number;
  hatchTime: number;
  isHatched: boolean;
  canHatch: boolean;
}

export default function InventoryPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { address, chain } = useAccount();
  const contracts = useContracts();
  const publicClient = usePublicClient();

  const [geodes, setGeodes] = useState<GeodeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug: Ver valores de dependencias
  console.log('📊 Estado del componente Inventory:');
  console.log('  isConnected:', isConnected);
  console.log('  address:', address);
  console.log('  contracts:', contracts);
  console.log('  chain:', chain);

  // Cargar geodas del usuario
  const loadGeodes = async () => {
    console.log('🚀 loadGeodes() llamada');
    console.log('  address:', address);
    console.log('  contracts:', contracts);
    console.log('  chain:', chain);
    
    if (!address || !contracts || !chain) {
      console.log('❌ loadGeodes salió temprano - falta:', {
        address: !address,
        contracts: !contracts,
        chain: !chain
      });
      return;
    }

    console.log('🔄 Iniciando carga de geodas...');
    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 Creando provider con RPC:', chain.rpcUrls.default.http[0]);
      const provider = new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]);

      console.log('📜 Creando contrato GeodeNFT en:', contracts.geodeNFT);
      const geodeContract = new ethers.Contract(
        contracts.geodeNFT,
        GEODE_NFT_ABI,
        provider
      );

      console.log('📜 Creando contrato Transmuter en:', contracts.scorchHeartTransmuter);
      const transmuterContract = new ethers.Contract(
        contracts.scorchHeartTransmuter,
        TRANSMUTER_ABI,
        provider
      );

      // Obtener geodas forjadas por el usuario mediante eventos
      // Ronin testnet limita a máximo 500 bloques por query
      console.log('🔢 Obteniendo block number...');
      const currentBlock = await provider.getBlockNumber();
      console.log(`  Current block: ${currentBlock}`);
      
      // Buscar en los últimos 10000 bloques dividiendo en chunks de 499 bloques
      const totalBlocksToSearch = 10000;
      const chunkSize = 499; // Ronin permite máximo 500 bloques, usamos 499 para estar seguros
      const startBlock = Math.max(0, currentBlock - totalBlocksToSearch);
      
      console.log(`  Buscando eventos desde bloque ${startBlock} hasta ${currentBlock} (${totalBlocksToSearch} bloques)`);
      console.log('🔍 Realizando búsqueda en chunks de 500 bloques...');
      
      let allForgedEvents: any[] = [];
      
      // Dividir en chunks y buscar
      for (let from = startBlock; from <= currentBlock; from += chunkSize + 1) {
        const to = Math.min(from + chunkSize, currentBlock);
        console.log(`  📦 Chunk: bloques ${from} - ${to}`);
        
        const events = await transmuterContract.queryFilter(
          transmuterContract.filters.GeodeForged(address),
          from,
          to
        );
        
        if (events.length > 0) {
          console.log(`    ✅ Encontrados ${events.length} eventos en este chunk`);
          allForgedEvents = allForgedEvents.concat(events);
        }
      }
      
      console.log(`✅ Búsqueda completada! Total de eventos encontrados: ${allForgedEvents.length}`);
      const forgedEvents = allForgedEvents;

      if (forgedEvents.length === 0) {
        setGeodes([]);
        setIsLoading(false);
        return;
      }

      // Extraer IDs de geodas de los eventos
      const geodeIds = forgedEvents.map((event: any) => event.args.tokenId);

      // Obtener info de cada geoda y filtrar las que el usuario aún posee
      const geodesDataPromises = geodeIds.map(async (id: bigint) => {
        try {
          console.log(`🔍 Cargando geoda ${id}...`);
          
          // Verificar si el usuario todavía es dueño de la geoda
          console.log(`  Llamando ownerOf(${id})...`);
          const owner = await geodeContract.ownerOf(id);
          console.log(`  Owner: ${owner}, User: ${address}`);
          
          // Si no es el dueño (puede haber sido quemada), omitir
          if (owner.toLowerCase() !== address.toLowerCase()) {
            console.log(`  ❌ Usuario no es owner, omitiendo`);
            return null;
          }

          console.log(`  Llamando getGeodeInfo(${id})...`);
          const info = await geodeContract.getGeodeInfo(id);
          console.log(`  Info recibida:`, info);
          
          // info ahora devuelve [category, axieClass, forgeDate, creator]
          const category = Number(info[0]) as GeodeCategory;
          const axieClass = Number(info[1]) as AxieClass;
          const forgeDate = Number(info[2]);
          const creator = info[3];
          
          const categoryInfo = CATEGORY_INFO[category];
          const classInfo = AXIE_CLASS_INFO[axieClass];
          const fullName = getGeodeName(category, axieClass);
          
          console.log(`  ✅ Geoda ${id} cargada - ${fullName}, Fecha: ${forgeDate}`);
          
          // Calcular si puede eclosionar (24 horas después de forja)
          const hatchTime = forgeDate + (24 * 3600); // 24 horas en segundos
          const now = Math.floor(Date.now() / 1000);
          const canHatch = now >= hatchTime;

          // TODO: Verificar si ya fue eclosionada buscando eventos
          // Por ahora asumimos que no está hatched (la funcionalidad de hatch no está implementada)
          const isHatched = false;

          return {
            id,
            category,
            axieClass,
            categoryName: categoryInfo.name,
            className: classInfo.displayName,
            fullName,
            owner: creator,
            createdAt: forgeDate,
            hatchTime: hatchTime,
            isHatched,
            canHatch: canHatch && !isHatched,
          };
        } catch (err) {
          // Si falla (ej: geoda quemada), retornar null
          console.error(`❌ Error cargando geoda ${id}:`, err);
          console.log(`Geoda ${id} no disponible (probablemente quemada)`);
          return null;
        }
      });

      const allGeodesData = await Promise.all(geodesDataPromises);
      
      // Filtrar nulls (geodas quemadas o no accesibles)
      const geodesData = allGeodesData.filter((geode) => geode !== null) as GeodeInfo[];

      setGeodes(geodesData);
    } catch (err) {
      console.error('Error loading geodes:', err);
      setError(err instanceof Error ? err.message : 'Error loading geodes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect ejecutado - Intentando cargar geodas...');
    console.log('  Condiciones:', { isConnected, address: !!address, contracts: !!contracts });
    
    if (isConnected && address && contracts) {
      console.log('✅ Todas las condiciones OK - Llamando loadGeodes()');
      loadGeodes();
    } else {
      console.log('❌ Falta alguna condición:', {
        isConnected,
        hasAddress: !!address,
        hasContracts: !!contracts
      });
    }
  }, [isConnected, address, contracts]);

  // Redirect si no está conectado
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

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

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loading size="lg" text="Verificando conexión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                🎒 Mi Inventario
              </h1>
              <p className="text-gray-400 text-lg">
                Geodas Cristalinas y CoreMiners
              </p>
            </div>
            <Link href="/forge">
              <Button variant="primary">
                🔨 Forjar Nueva Geoda
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" text="Cargando inventario..." />
          </div>
        )}

        {/* Error State */}
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

        {/* Empty State */}
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

        {/* Geodes Grid */}
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
                  {/* Video de la Geoda */}
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
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      🐣 Eclosionar Ahora
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
    </div>
  );
}
