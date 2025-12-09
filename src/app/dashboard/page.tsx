'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { useUserData } from '@/lib/hooks/useUserData';
import { Card, Button, Badge, Loading } from '@/components/ui';
import { getMinerVideoPath } from '@/lib/utils/minerNames';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected, balance, balanceSymbol, disconnect } = useWallet();
  const { axies, miners, stats, isLoading: isLoadingData } = useUserData();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'axies' | 'coreminers'>('overview');

  // Redirect si no está conectado
  React.useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loading size="lg" text="Verificando conexión..." />
      </div>
    );
  }

  // Funciones auxiliares para convertir datos
  function getAxieEmoji(axieClass: string): string {
    const emojis: Record<string, string> = {
      Beast: '🐉',
      Plant: '🌿',
      Aquatic: '🐟',
      Bird: '🦅',
      Bug: '🦋',
      Reptile: '🦎',
      Mech: '🤖',
      Dawn: '🌅',
      Dusk: '🌆',
    };
    return emojis[axieClass] || '🎮';
  }

  function getMinerTypeName(type: number): string {
    // minerType del contrato (0-8) representa las clases de Axie
    const types: Record<number, string> = {
      0: 'Bestia',    // Beast
      1: 'Aqua',      // Aqua
      2: 'Ave',       // Bird
      3: 'Reptil',    // Reptile
      4: 'Bicho',     // Bug
      5: 'Planta',    // Plant
      6: 'Mech',      // Mech
      7: 'Dusk',      // Dusk
      8: 'Dawn',      // Dawn
    };
    return types[type] || 'Unknown';
  }

  // Convertir datos reales de la wallet
  // Si no hay axies en la wallet, mostrar array vacío
  const displayAxies = axies.map((axie) => ({
    id: axie.tokenId,
    name: axie.metadata.name,
    class: axie.metadata.class,
    level: axie.metadata.stats.hp > 50 ? 30 : 20, // Nivel basado en stats
    rarity: axie.metadata.stats.hp > 60 ? 'Epic' : axie.metadata.stats.hp > 50 ? 'Rare' : 'Common',
    image: getAxieEmoji(axie.metadata.class),
    isStaked: axie.isStaked,
  }));

  // Convertir datos de mineros
  const displayMiners = miners.map((miner) => {
    // NOTA: El contrato actual solo retorna minerType (0-8) que representa la clase de Axie
    // Por ahora todos los miners son PETIT (stage no viene del contrato)
    // minerType se mapea a las clases de Axie que coinciden con las carpetas
    
    const classNames: Record<number, string> = {
      0: 'BESTIA',   // Beast (aunque PETIT no tiene esta carpeta)
      1: 'AQUA',     // Aqua
      2: 'AVE',      // Bird
      3: 'REPTIL',   // Reptile
      4: 'BICHO',    // Bug
      5: 'PLANTA',   // Plant
      6: 'MECH',     // Mech
      7: 'DUSK',     // Dusk
      8: 'DAWN'      // Dawn (aunque PETIT no tiene esta carpeta)
    };
    
    // Por ahora todos los miners son PETIT (el contrato no almacena categoría)
    const categoryName = 'PETIT';
    const className = classNames[Number(miner.minerType)] || 'AQUA';
    const videoPath = getMinerVideoPath(categoryName, className, miner.name);
    
    return {
      id: miner.tokenId.toString(),
      name: miner.name || 'CoreMiner',
      type: getMinerTypeName(Number(miner.minerType)),
      power: miner.miningPower ? Number(miner.miningPower) : 0,
      status: 'Idle', // TODO: Obtener del contrato de mining
      efficiency: miner.efficiency ? Number(miner.efficiency) : 0,
      dailyOutput: '0', // TODO: Calcular desde el contrato
      videoPath: videoPath,
    };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Profile Hero Section */}
      <section className="relative py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Avatar & Info */}
            <Card variant="glass" className="flex-1 p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl">
                    🔥
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Prospector #{address?.slice(-4)}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <code className="text-sm text-gray-400 bg-gray-900 px-3 py-1 rounded">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </code>
                    <Badge variant="success">Conectado</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Miembro desde:</span>
                      <span className="text-white ml-2 font-medium">Oct 2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    🚪 Cerrar Sesión
                  </Button>
                </div>
              </div>
            </Card>

            {/* Balance Card */}
            <Card variant="gradient" className="lg:w-80 p-8">
              <div className="text-sm text-gray-300 mb-2">Balance de Wallet</div>
              <div className="text-4xl font-bold text-white mb-4">{balance || '0.00'}</div>
              <div className="text-lg text-gray-300 mb-6">{balanceSymbol || 'RON'}</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">$CORE Minado:</span>
                  <span className="text-orange-500 font-bold">{stats.totalCOREMined}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tasa Diaria:</span>
                  <span className="text-green-500 font-bold">+{stats.dailyRate}/día</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-4 border-b border-gray-800 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Vista General
            </button>
            <button
              onClick={() => setActiveTab('axies')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'axies'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎮 Mis Axies ({displayAxies.length})
            </button>
            <button
              onClick={() => setActiveTab('coreminers')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'coreminers'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💎 Mis CoreMiners ({displayMiners.length})
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🎮</div>
              <Badge variant="info">Activo</Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.axiesOwned}</div>
            <div className="text-sm text-gray-400">Axies en Wallet</div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💎</div>
              <Badge variant="success">Minando</Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.coreMinersActive}</div>
            <div className="text-sm text-gray-400">CoreMiners Activos</div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">⛏️</div>
              <Badge variant="warning">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalCOREMined}</div>
            <div className="text-sm text-gray-400">$CORE Minado</div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📈</div>
              <Badge variant="success">24h</Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.dailyRate}</div>
            <div className="text-sm text-gray-400">$CORE / Día</div>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Forge Card */}
          <Card variant="gradient" hover className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-5xl mb-4">🔨</div>
                <h2 className="text-3xl font-bold text-white mb-2">La Forja</h2>
                <p className="text-gray-300">
                  Transmuta tus Axies dormidos en poderosos CoreMiners para comenzar a minar $CORE
                </p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-300">Fase 1: Crear Geoda Cristalina</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">Fase 2: Eclosión del CoreMiner</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-300">Fase 3: Activar Minería</span>
              </div>
            </div>
            <Link href="/forge">
              <Button variant="primary" className="w-full">
                Ir a la Forja →
              </Button>
            </Link>
          </Card>

          {/* Mining Card */}
          <Card variant="gradient" hover className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-5xl mb-4">⛏️</div>
                <h2 className="text-3xl font-bold text-white mb-2">Minería</h2>
                <p className="text-gray-300">
                  Activa tus CoreMiners y configura ciclos de minería para generar $CORE pasivamente
                </p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-300">Ciclos: 1 semana a 3 meses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-300">Mayor duración = Mayor bonus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-300">Rewards automáticos</span>
              </div>
            </div>
            <Link href="/mining">
              <Button variant="primary" className="w-full">
                Ver Minería →
              </Button>
            </Link>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="bordered" hover className="p-6">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">Staking</h3>
            <p className="text-gray-400 text-sm mb-4">
              Stakea tus Axies para generar Poder de Resonancia sin quemarlos
            </p>
            <Link href="/staking">
              <Button variant="outline" className="w-full" size="sm">
                Ver Staking
              </Button>
            </Link>
          </Card>

          <Card variant="bordered" hover className="p-6">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-white mb-2">Marketplace</h3>
            <p className="text-gray-400 text-sm mb-4">
              Compra y vende CoreMiners, Geodas y recursos en el mercado
            </p>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full" size="sm">
                Explorar
              </Button>
            </Link>
          </Card>

          <Card variant="bordered" hover className="p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Inventario</h3>
            <p className="text-gray-400 text-sm mb-4">
              Gestiona tus Axies, CoreMiners, Geodas y otros activos
            </p>
            <Link href="/inventory">
              <Button variant="outline" className="w-full" size="sm">
                Ver Inventario
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card variant="glass" className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-2xl">🔨</span>
                </div>
                <div>
                  <div className="font-medium text-white">Forja Completada</div>
                  <div className="text-sm text-gray-400">CoreMiner Bestia creado exitosamente</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Hace 2 horas</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-2xl">⛏️</span>
                </div>
                <div>
                  <div className="font-medium text-white">Recompensa de Minería</div>
                  <div className="text-sm text-gray-400">+42.5 $CORE reclamados</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Hace 5 horas</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <div className="font-medium text-white">Axie Stakeado</div>
                  <div className="text-sm text-gray-400">3 Axies bloqueados por 30 días</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Hace 1 día</div>
            </div>
          </div>
        </Card>
          </>
        )}

        {/* Axies Tab */}
        {activeTab === 'axies' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Mis Axies</h2>
              <p className="text-gray-400">Gestiona tus Axies y prepáralos para la forja</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAxies.map((axie) => (
                <Card key={axie.id} variant="glass" hover className="p-6">
                  <div className="flex flex-col">
                    <div className="text-7xl text-center mb-4">{axie.image}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{axie.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="info">{axie.class}</Badge>
                      <Badge variant={
                        axie.rarity === 'Legendary' ? 'warning' : 
                        axie.rarity === 'Epic' ? 'success' : 
                        'default'
                      }>
                        {axie.rarity}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Nivel:</span>
                        <span className="text-white font-medium">{axie.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Clase:</span>
                        <span className="text-white font-medium">{axie.class}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                      <Button variant="primary" size="sm" className="flex-1">
                        Forjar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CoreMiners Tab */}
        {activeTab === 'coreminers' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Mis CoreMiners</h2>
              <p className="text-gray-400">Gestiona tus CoreMiners y optimiza la minería</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayMiners.map((miner) => (
                <Card key={miner.id} variant="gradient" className="p-4">
                  {/* Video del CoreMiner - Tamaño completo */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-4">
                    {miner.videoPath ? (
                      <video
                        src={miner.videoPath}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-6xl">
                        💎
                      </div>
                    )}
                  </div>

                  {/* Header compacto */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white mb-0.5">
                      {miner.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">CoreMiner {miner.type}</p>
                      <Badge variant={miner.status === 'Mining' ? 'success' : 'default'} className="text-xs">
                        {miner.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats compactos */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-black/40 rounded p-2 border border-gray-700">
                      <div className="text-xs text-gray-400 mb-0.5">Poder</div>
                      <div className="text-sm font-bold text-orange-500">{miner.power}</div>
                    </div>
                    <div className="bg-black/40 rounded p-2 border border-gray-700">
                      <div className="text-xs text-gray-400 mb-0.5">Eficiencia</div>
                      <div className="text-sm font-bold text-green-500">{miner.efficiency}%</div>
                    </div>
                    <div className="bg-black/40 rounded p-2 border border-gray-700">
                      <div className="text-xs text-gray-400 mb-0.5">Diaria</div>
                      <div className="text-sm font-bold text-white">{miner.dailyOutput}</div>
                    </div>
                  </div>

                  {/* Botones compactos */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      Configurar
                    </Button>
                    <Button 
                      variant={miner.status === 'Mining' ? 'secondary' : 'primary'} 
                      size="sm" 
                      className="flex-1 text-xs"
                    >
                      {miner.status === 'Mining' ? 'Detener' : 'Activar'}
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1 text-xs bg-green-600 hover:bg-green-700">
                      Reclamar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State si no hay miners */}
            {displayMiners.length === 0 && (
              <Card variant="glass" className="p-12 text-center">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-2">No tienes CoreMiners</h3>
                <p className="text-gray-400 mb-6">Forja tus primeros Axies para crear CoreMiners y comenzar a minar $CORE</p>
                <Link href="/forge">
                  <Button variant="primary">Ir a la Forja</Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
