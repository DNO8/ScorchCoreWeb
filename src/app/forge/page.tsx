'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { useMementoBalances } from '@/lib/hooks/useMementoBalances';
import { useContracts } from '@/lib/hooks/useContracts';
import { Card, Button, Badge, Loading, Toast, useToast } from '@/components/ui';
import { GeodeVideo } from '@/components/GeodeVideo';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { GEODE_NFT_ABI, TRANSMUTER_ABI } from '@/lib/abis';
import {
  GeodeCategory,
  AxieClass,
  CATEGORY_INFO,
  AXIE_CLASS_INFO,
  AVAILABLE_CATEGORIES,
  ALL_AXIE_CLASSES,
  getGeodeName,
  getMementoIcon,
} from '@/lib/constants/geodes';

export default function ForgePage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { address, chain } = useAccount();
  const contracts = useContracts();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();
  const { balances: mementoBalances, isLoading: loadingBalances, getBalance } = useMementoBalances();

  // Estados
  const [selectedCategory, setSelectedCategory] = useState<GeodeCategory>(GeodeCategory.PETIT);
  const [selectedClass, setSelectedClass] = useState<AxieClass>(AxieClass.BEAST);
  const [mementosToUse, setMementosToUse] = useState<number>(0);
  const [forgeStep, setForgeStep] = useState<'select' | 'approve' | 'forge' | 'success'>('select');
  const [isForging, setIsForging] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [forgedGeodeId, setForgedGeodeId] = useState<bigint | null>(null);

  // Información de la geoda seleccionada
  const categoryInfo = CATEGORY_INFO[selectedCategory];
  const classInfo = AXIE_CLASS_INFO[selectedClass];
  const geodeName = getGeodeName(selectedCategory, selectedClass);

  // Calcular probabilidad de fallo con mementos
  const baseFailureChance = categoryInfo.failureRate;
  const reduction = Math.floor(mementosToUse / 10); // Cada 10 mementos reduce 1%
  const currentFailureChance = Math.max(0, baseFailureChance - reduction);

  // Costos
  const axsCost = categoryInfo.defaultCost.axs;
  const slpCost = categoryInfo.defaultCost.slp;
  const mementoCost = categoryInfo.defaultCost.memento;
  const totalMementoCost = Number(mementoCost) + mementosToUse;

  // Redirect si no está conectado
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Resetear mementos al cambiar geoda
  useEffect(() => {
    setMementosToUse(0);
    setForgeStep('select');
  }, [selectedCategory, selectedClass]);

  const handleApprove = async () => {
    if (!address || !contracts || !chain) {
      showError('Wallet no conectada');
      return;
    }

    try {
      setIsApproving(true);
      showInfo('Aprobando tokens...');

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // ABI básico de ERC20
      const ERC20_ABI = [
        'function approve(address spender, uint256 amount) returns (bool)',
      ];

      // Calcular cantidades
      const axsAmount = ethers.parseEther(axsCost.toString());
      const slpAmount = ethers.parseEther(slpCost.toString());
      const mementoAmount = ethers.parseEther(totalMementoCost.toString());

      // Mapear clase de Axie a clave de memento
      const mementoKey = ['beast', 'aqua', 'bird', 'reptile', 'bug', 'plant', 'mech', 'dusk', 'dawn'][selectedClass] as keyof typeof contracts.mementos;
      const mementoAddress = contracts.mementos[mementoKey];

      // Aprobar AXS
      showInfo('Aprobando AXS...');
      const axsContract = new ethers.Contract(contracts.axsToken, ERC20_ABI, signer);
      const axsTx = await axsContract.approve(contracts.scorchHeartTransmuter, axsAmount);
      await axsTx.wait();

      // Aprobar SLP
      showInfo('Aprobando SLP...');
      const slpContract = new ethers.Contract(contracts.slpToken, ERC20_ABI, signer);
      const slpTx = await slpContract.approve(contracts.scorchHeartTransmuter, slpAmount);
      await slpTx.wait();

      // Aprobar Memento
      showInfo('Aprobando Mementos...');
      const mementoContract = new ethers.Contract(mementoAddress, ERC20_ABI, signer);
      const mementoTx = await mementoContract.approve(contracts.scorchHeartTransmuter, mementoAmount);
      await mementoTx.wait();

      setForgeStep('forge');
      showSuccess('✅ Tokens aprobados correctamente');
    } catch (err: any) {
      console.error('Error en aprobación:', err);
      showError(err.message || 'Error al aprobar tokens');
    } finally {
      setIsApproving(false);
    }
  };

  const handleForge = async () => {
    if (!address || !contracts || !chain) {
      showError('Wallet no conectada');
      return;
    }

    try {
      setIsForging(true);
      showInfo('Forjando geoda...');

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Contrato Transmuter
      const transmuterContract = new ethers.Contract(
        contracts.scorchHeartTransmuter,
        TRANSMUTER_ABI,
        signer
      );

      // Ejecutar forgeGeode
      const tx = await transmuterContract.forgeGeode(
        selectedCategory,
        selectedClass,
        mementosToUse
      );

      showInfo('Esperando confirmación de transacción...');
      const receipt = await tx.wait();

      // Verificar si se creó una geoda (buscar evento Transfer del GeodeNFT)
      const geodeNFT = new ethers.Contract(contracts.geodeNFT, GEODE_NFT_ABI, provider);
      const transferEvents = receipt.logs
        .map((log: any) => {
          try {
            return geodeNFT.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((event: any) => event && event.name === 'Transfer');

      if (transferEvents.length > 0) {
        const tokenId = transferEvents[0].args.tokenId;
        setForgedGeodeId(tokenId);
        setForgeStep('success');
        showSuccess(`¡Geoda ${geodeName} forjada con éxito! Token ID: ${tokenId}`);
      } else {
        // La forja falló por RNG
        showError(`La forja falló debido al RNG (${currentFailureChance}% de probabilidad). Los tokens fueron consumidos.`);
        setForgeStep('select');
      }
    } catch (err: any) {
      console.error('Error en forja:', err);
      showError(err.message || 'Error al forjar geoda');
    } finally {
      setIsForging(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold mb-2">🔨 Forja de Geodas</h1>
          <p className="text-gray-400">
            Combina recursos para crear geodas cristalinas únicas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel Izquierdo: Selectores */}
          <div className="space-y-6">
            {/* Selector de Categoría */}
            <Card variant="glass" className="p-6">
              <h2 className="text-2xl font-bold mb-4">1. Categoría de Geoda</h2>
              <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === cat.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-700 bg-black/20 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{cat.displayName}</div>
                        <div className="text-sm text-gray-400">Max Supply: {cat.maxSupply.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Fallo base: {cat.failureRate}%
                        </div>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Selector de Clase de Axie */}
            <Card variant="glass" className="p-6">
              <h2 className="text-2xl font-bold mb-4">2. Clase de Axie</h2>
              <div className="grid grid-cols-3 gap-3">
                {ALL_AXIE_CLASSES.map((axieClass) => (
                  <button
                    key={axieClass.id}
                    onClick={() => setSelectedClass(axieClass.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedClass === axieClass.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-700 bg-black/20 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={axieClass.icon}
                        alt={axieClass.displayName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="text-xs font-medium">{axieClass.displayName}</span>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-400">💎</span>
                        <span className="font-bold text-green-400">
                          {Math.floor(Number(getBalance(axieClass.id)) / 1e18).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Mementos Extra */}
            <Card variant="glass" className="p-6">
              <h2 className="text-2xl font-bold mb-4">3. Mementos Extra (Opcional)</h2>
              <p className="text-sm text-gray-400 mb-2">
                Cada 10 mementos reduce la probabilidad de fallo en 1%
              </p>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                💎 Disponibles: <span className="font-bold text-green-400">{Math.floor(Number(getBalance(selectedClass)) / 1e18).toLocaleString()}</span> {classInfo.displayName} Mementos
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMementosToUse(Math.max(0, mementosToUse - 10))}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  disabled={mementosToUse === 0}
                >
                  -10
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{mementosToUse}</div>
                  <div className="text-xs text-gray-400">mementos extra</div>
                </div>
                <button
                  onClick={() => setMementosToUse(mementosToUse + 10)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +10
                </button>
              </div>

              {mementosToUse > 0 && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <div className="text-sm text-green-400">
                    ✓ Reducción de fallo: -{reduction}%
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Panel Derecho: Preview y Acción */}
          <div className="space-y-6">
            {/* Preview de Geoda */}
            <Card variant="gradient" className="p-6">
              <h2 className="text-2xl font-bold mb-4">Vista Previa</h2>
              
              <div className="mb-6">
                <div className="aspect-square bg-black/40 rounded-lg overflow-hidden mb-4">
                  <GeodeVideo
                    key={`${selectedCategory}-${selectedClass}`}
                    category={selectedCategory}
                    axieClass={selectedClass}
                    className="w-full h-full"
                    autoPlay={true}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{geodeName}</h3>
                  <div className="flex justify-center gap-2 mb-3">
                    <Badge
                      variant="info"
                      style={{
                        backgroundColor: categoryInfo.color + '40',
                        borderColor: categoryInfo.color,
                      }}
                    >
                      {categoryInfo.name}
                    </Badge>
                    <Badge
                      variant="default"
                      style={{
                        backgroundColor: classInfo.color + '40',
                        borderColor: classInfo.color,
                      }}
                    >
                      {classInfo.displayName}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Costos */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/axies/axs-icon.webp"
                      alt="AXS"
                      width={24}
                      height={24}
                    />
                    <span>AXS</span>
                  </div>
                  <span className="font-bold">{axsCost}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/axies/slp-icon.webp"
                      alt="SLP"
                      width={24}
                      height={24}
                    />
                    <span>SLP</span>
                  </div>
                  <span className="font-bold">{slpCost}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Image
                      src={getMementoIcon(selectedClass)}
                      alt="Memento"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>Memento {classInfo.displayName}</span>
                  </div>
                  <span className="font-bold">{totalMementoCost}</span>
                </div>
              </div>

              {/* Probabilidad de Fallo */}
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-400">⚠️ Probabilidad de Fallo</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {currentFailureChance}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${currentFailureChance}%` }}
                  />
                </div>
              </div>

              {/* Botón de Acción */}
              {forgeStep === 'select' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setForgeStep('approve')}
                >
                  Continuar →
                </Button>
              )}

              {forgeStep === 'approve' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  {isApproving ? 'Aprobando...' : 'Aprobar Tokens'}
                </Button>
              )}

              {forgeStep === 'forge' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleForge}
                  disabled={isForging}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isForging ? 'Forjando...' : '🔨 Forjar Geoda'}
                </Button>
              )}

              {forgeStep === 'success' && forgedGeodeId && (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-6xl mb-2">🎉</div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                      ¡Éxito!
                    </h3>
                    <p className="text-gray-400">
                      Geoda #{forgedGeodeId.toString()} forjada
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Link href="/inventory">
                      <Button variant="primary" fullWidth>
                        Ver en Inventario
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        setForgeStep('select');
                        setForgedGeodeId(null);
                        setMementosToUse(0);
                      }}
                    >
                      Forjar Otra
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Info de la Categoría */}
            <Card variant="glass" className="p-4">
              <h4 className="font-bold mb-3 text-lg">📊 Estadísticas de la Geoda</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Información General</div>
                  <ul className="text-sm text-gray-300 space-y-1.5">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Max Supply:</span>
                      <span className="font-medium">{categoryInfo.maxSupply.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Rareza:</span>
                      <span className="font-medium" style={{ color: categoryInfo.color }}>
                        {categoryInfo.rarity}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Tiempo de eclosión:</span>
                      <span className="font-medium">24 horas</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="text-xs text-gray-500 mb-1">CoreMiner Resultante</div>
                  <ul className="text-sm text-gray-300 space-y-1.5">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Poder de Minado:</span>
                      <span className="font-bold text-green-400">{categoryInfo.miningPower}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Bonus de Colección:</span>
                      <span className="font-medium text-blue-400">{categoryInfo.collectionBonus}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Costo de Reparación:</span>
                      <span className="font-medium text-orange-400">{categoryInfo.repairCost}%</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="text-xs text-gray-500 mb-1">Tipo de Memento Requerido</div>
                  <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                    <Image
                      src={getMementoIcon(selectedClass)}
                      alt={classInfo.displayName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium" style={{ color: classInfo.color }}>
                      {classInfo.displayName}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast */}
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
