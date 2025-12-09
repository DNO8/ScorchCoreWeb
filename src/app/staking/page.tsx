'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { useNFTs } from '@/lib/hooks/useNFTs';
import { useMining } from '@/lib/hooks/useMining';
import { useContracts } from '@/lib/hooks/useContracts';
import { Card, Button, Badge, Modal } from '@/components/ui';
import { getMinerVideoPath } from '@/lib/utils/minerNames';
import { ethers } from 'ethers';
import Link from 'next/link';

export default function StakingPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const contracts = useContracts();
  const { miners, isLoadingMiners, reload: reloadMiners } = useNFTs({
    autoLoad: true,
    minerContractAddress: contracts?.coreMinerNFT,
  });

  const [selectedMiner, setSelectedMiner] = useState<any>(null);
  const [showMiningModal, setShowMiningModal] = useState(false);
  const [activeMinerSessions, setActiveMinerSessions] = useState<Map<string, any>>(new Map());
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Redirect si no está conectado
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Cargar sesiones de mining para todos los miners
  const loadMiningSessions = async () => {
    if (!miners.length || !contracts?.miningScheduler) return;

    setIsLoadingSessions(true);
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider('https://saigon-testnet.roninchain.com/rpc');
      const miningSchedulerABI = [
        'function getMiningSession(uint256 minerId) external view returns (address owner, uint256 startTime, uint256 lastClaim, uint256 power, uint256 efficiency, bool isActive, uint256 pendingRewards)'
      ];
      const miningScheduler = new ethers.Contract(contracts.miningScheduler, miningSchedulerABI, provider);

      const sessionsMap = new Map();
      for (const miner of miners) {
        try {
          const session = await miningScheduler.getMiningSession(miner.tokenId);
          if (session.isActive) {
            sessionsMap.set(miner.tokenId.toString(), {
              owner: session.owner,
              startTime: session.startTime,
              lastClaim: session.lastClaim,
              power: session.power,
              efficiency: session.efficiency,
              isActive: session.isActive,
              pendingRewards: session.pendingRewards
            });
          }
        } catch (error) {
          console.error(`Error cargando sesión para miner ${miner.tokenId}:`, error);
        }
      }

      setActiveMinerSessions(sessionsMap);
    } catch (error) {
      console.error('Error cargando sesiones de mining:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Cargar sesiones cuando cambien los miners
  useEffect(() => {
    if (miners.length > 0 && contracts?.miningScheduler) {
      loadMiningSessions();
    }
  }, [miners.length, contracts?.miningScheduler]);

  // Auto-refresh cada 10 segundos
  useEffect(() => {
    if (!miners.length || !contracts?.miningScheduler) return;

    const interval = setInterval(() => {
      loadMiningSessions();
    }, 10000);

    return () => clearInterval(interval);
  }, [miners.length, contracts?.miningScheduler]);

  // Formatear valores
  const formatFCore = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(2);
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const calculateTimeElapsed = (startTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - Number(startTime);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header con botón de volver */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              ← Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">⛏️ Mining Dashboard</h1>
          <p className="text-gray-400">Gestiona tus CoreMiners y obtén recompensas en fCORE</p>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💎</div>
            <Badge variant="success">Activo</Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {miners.filter(m => activeMinerSessions.has(m.tokenId.toString())).length}
          </div>
          <div className="text-sm text-gray-400">CoreMiners Minando</div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">⚡</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{miners.length}</div>
          <div className="text-sm text-gray-400">Total CoreMiners</div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💰</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {Array.from(activeMinerSessions.values())
              .reduce((sum, session) => sum + Number(formatFCore(session.pendingRewards)), 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">fCORE Pendiente</div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📊</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {miners.reduce((sum, m) => sum + Number(m.miningPower), 0)}
          </div>
          <div className="text-sm text-gray-400">Poder Total</div>
        </Card>
      </div>

      {/* CoreMiners List */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Mis CoreMiners</h2>
          <Button variant="outline" size="sm" onClick={async () => {
            await reloadMiners();
            await loadMiningSessions();
          }} disabled={isLoadingMiners || isLoadingSessions}>
            {isLoadingMiners || isLoadingSessions ? 'Cargando...' : '🔄 Actualizar'}
          </Button>
        </div>

        {isLoadingMiners ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Cargando CoreMiners...</p>
          </div>
        ) : miners.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-white mb-2">No tienes CoreMiners</h3>
            <p className="text-gray-400 mb-6">
              Eclosiona geodas para obtener CoreMiners y comenzar a minar fCORE
            </p>
            <Link href="/inventory">
              <Button variant="primary">Ir al Inventario</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {miners.map((miner) => (
              <MinerCard
                key={miner.tokenId.toString()}
                miner={miner}
                session={activeMinerSessions.get(miner.tokenId.toString())}
                onManage={() => {
                  setSelectedMiner(miner);
                  setShowMiningModal(true);
                }}
                formatFCore={formatFCore}
                calculateTimeElapsed={calculateTimeElapsed}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Mining Modal */}
      {showMiningModal && selectedMiner && (
        <MiningModal
          miner={selectedMiner}
          isOpen={showMiningModal}
          onClose={() => {
            setShowMiningModal(false);
            setSelectedMiner(null);
          }}
          onSuccess={async () => {
            await reloadMiners();
            await loadMiningSessions();
            setShowMiningModal(false);
            setSelectedMiner(null);
          }}
        />
      )}
      </div>
    </div>
  );
}

// Componente de Tarjeta de Miner
function MinerCard({ miner, session, onManage, formatFCore, calculateTimeElapsed }: any) {
  const isActive = session?.isActive || false;
  
  // Construir ruta del video
  const classNames = {
    0: 'BESTIA', 
    1: 'AQUA', 
    2: 'AVE', 
    3: 'REPTIL', 
    4: 'BICHO', 
    5: 'PLANTA', 
    6: 'MECH', 
    7: 'DUSK', 
    8: 'DAWN'
  } as const;
  
  const categoryName = 'PETIT';
  const minerType = Number(miner.minerType);
  const className = (classNames as any)[minerType] || 'AQUA';
  const videoPath = getMinerVideoPath(categoryName, className, miner.name);

  return (
    <Card variant="gradient" className="p-4">
      {/* Video del CoreMiner */}
      <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-4 relative">
        <video
          src={videoPath}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        />
        {/* Badge de Estado sobre el video */}
        <div className="absolute top-2 right-2">
          <Badge variant={isActive ? 'success' : 'default'} className="text-xs">
            {isActive ? '⛏️ Minando' : '💤 Inactivo'}
          </Badge>
        </div>
      </div>

      {/* Info del Miner */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white mb-0.5">
          {miner.name}
        </h3>
        <p className="text-xs text-gray-400">CoreMiner #{miner.tokenId.toString()}</p>
      </div>

      {/* Stats compactos */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/40 rounded p-2 border border-gray-700">
          <div className="text-xs text-gray-400 mb-0.5">Poder</div>
          <div className="text-sm font-bold text-orange-500">{miner.miningPower}</div>
        </div>
        <div className="bg-black/40 rounded p-2 border border-gray-700">
          <div className="text-xs text-gray-400 mb-0.5">Eficiencia</div>
          <div className="text-sm font-bold text-green-500">{miner.efficiency}%</div>
        </div>
        {isActive && session && (
          <>
            <div className="bg-black/40 rounded p-2 border border-gray-700">
              <div className="text-xs text-gray-400 mb-0.5">Tiempo</div>
              <div className="text-sm font-bold text-white">
                {calculateTimeElapsed(session.startTime)}
              </div>
            </div>
            <div className="bg-black/40 rounded p-2 border border-gray-700">
              <div className="text-xs text-gray-400 mb-0.5">Pendiente</div>
              <div className="text-sm font-bold text-green-400">
                {formatFCore(session.pendingRewards)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botón de Acción */}
      <Button
        variant={isActive ? 'secondary' : 'primary'}
        size="sm"
        className="w-full text-xs"
        onClick={onManage}
      >
        {isActive ? 'Gestionar' : 'Iniciar Mining'}
      </Button>
    </Card>
  );
}

// Modal de Mining
function MiningModal({ miner, isOpen, onClose, onSuccess }: any) {
  const { address, isConnected } = useWallet();
  const contracts = useContracts();
  const { startMining, claimRewards, stopMining, session, isLoading } = useMining({
    minerId: miner.tokenId,
    autoRefresh: true,
    refreshInterval: 10000,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const handleStartMining = async () => {
    if (!isConnected || !address) {
      alert('⚠️ Por favor conecta tu wallet primero');
      return;
    }
    
    if (!contracts?.miningScheduler) {
      alert('⚠️ Contratos no disponibles. Intenta reconectar tu wallet.');
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('🚀 Iniciando mining para miner:', miner.tokenId.toString());
      console.log('Poder:', miner.miningPower, 'Eficiencia:', miner.efficiency);
      
      await startMining(miner.tokenId, BigInt(miner.miningPower), BigInt(miner.efficiency));
      
      console.log('✅ Mining iniciado exitosamente');
      alert('✅ Mining iniciado exitosamente!');
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error starting mining:', error);
      alert('❌ Error al iniciar mining: ' + (error.message || 'Error desconocido'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setActionLoading(true);
      await claimRewards(miner.tokenId);
      onSuccess();
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      alert('Error al reclamar recompensas: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopMining = async () => {
    try {
      setActionLoading(true);
      await stopMining(miner.tokenId);
      onSuccess();
    } catch (error: any) {
      console.error('Error stopping mining:', error);
      alert('Error al detener mining: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isActive = session?.isActive || false;
  const hasPending = session?.pendingRewards && session.pendingRewards > 0n;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={miner.name}>
      <div className="space-y-6">
        {/* Estado Actual */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">CoreMiner #{miner.tokenId.toString()}</p>
          <div className="text-6xl mb-4">💎</div>
          <Badge variant={isActive ? 'success' : 'default'} className="mb-4">
            {isActive ? '⛏️ Minando Activo' : '💤 Inactivo'}
          </Badge>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
          {!isActive && (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleStartMining}
              disabled={actionLoading || isLoading || !isConnected}
            >
              {actionLoading ? 'Iniciando...' : !isConnected ? '⚠️ Conecta tu Wallet' : '⛏️ Iniciar Mining'}
            </Button>
          )}

          {isActive && hasPending && (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleClaimRewards}
              disabled={actionLoading || isLoading}
            >
              {actionLoading
                ? 'Reclamando...'
                : `💰 Reclamar ${ethers.formatEther(session.pendingRewards)} fCORE`}
            </Button>
          )}

          {isActive && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleStopMining}
              disabled={actionLoading || isLoading}
            >
              {actionLoading ? 'Deteniendo...' : '🛑 Detener Mining'}
            </Button>
          )}
        </div>

        {/* Info Adicional */}
        {isActive && session && (
          <Card variant="glass" className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Inicio:</span>
                <span className="text-white">
                  {new Date(Number(session.startTime) * 1000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Último Claim:</span>
                <span className="text-white">
                  {new Date(Number(session.lastClaim) * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
}
