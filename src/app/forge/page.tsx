"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/hooks/useWallet";
import { useMementoBalances } from "@/lib/hooks/useMementoBalances";
import { useContracts } from "@/lib/hooks/useContracts";
import { Card, Button, Badge, Loading, Toast, useToast } from "@/components/ui";
import { GeodeVideo } from "@/components/GeodeVideo";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { GEODE_NFT_ABI, TRANSMUTER_ABI } from "@/lib/abis";
import {
  GeodeCategory,
  AxieClass,
  CATEGORY_INFO,
  AXIE_CLASS_INFO,
  AVAILABLE_CATEGORIES,
  ALL_AXIE_CLASSES,
  getGeodeName,
  getMementoIcon,
} from "@/lib/constants/geodes";
import { ForgeAnimationPanel } from "@/components/features/forge/ForgeAnimationPanel";
import { useForgeStage } from "@/lib/hooks/useForgeStage";

export default function ForgePage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { address, chain } = useAccount();
  const contracts = useContracts();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();
  const {
    balances: mementoBalances,
    isLoading: loadingBalances,
    getBalance,
  } = useMementoBalances();

  // Estados
  const [selectedCategory, setSelectedCategory] = useState<
    GeodeCategory | undefined
  >(undefined);
  const [selectedClass, setSelectedClass] = useState<AxieClass | undefined>(
    undefined,
  );
  const [mementosToUse, setMementosToUse] = useState<number>(0);
  const [forgeStep, setForgeStep] = useState<
    "select" | "approve" | "forge" | "success"
  >("select");
  const [isForging, setIsForging] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [forgedGeodeId, setForgedGeodeId] = useState<bigint | null>(null);
  const [forgeFailed, setForgeFailed] = useState(false);

  // Ref para trackear mementos cuando se aprobó
  const approvedMementosRef = useRef<number>(0);

  // Hook para manejar stages de animación
  const forgeStage = useForgeStage({
    forgeStep,
    selectedCategory,
    selectedClass,
    mementosToUse,
    isForging,
    forgedGeodeId,
    forgeFailed,
  });

  // Información de la geoda seleccionada (con valores por defecto para evitar errores)
  const categoryInfo = selectedCategory
    ? CATEGORY_INFO[selectedCategory]
    : CATEGORY_INFO[GeodeCategory.PETIT];
  const classInfo = selectedClass
    ? AXIE_CLASS_INFO[selectedClass]
    : AXIE_CLASS_INFO[AxieClass.BEAST];
  const geodeName =
    selectedCategory && selectedClass
      ? getGeodeName(selectedCategory, selectedClass)
      : "Selecciona una geoda";

  // Calcular probabilidad de fallo con mementos
  const baseFailureChance = categoryInfo.failureRate;
  const reduction = Math.floor(mementosToUse / 10); // Cada 10 mementos reduce 1%
  const currentFailureChance = Math.max(0, baseFailureChance - reduction);

  // Costos
  const axsCost = categoryInfo.defaultCost.axs;
  const slpCost = categoryInfo.defaultCost.slp;
  const mementoCost = categoryInfo.defaultCost.memento;
  const totalMementoCost = Number(mementoCost) + mementosToUse;

  // Redirect si no está conectado (con delay para evitar reset al cambiar wallet)
  useEffect(() => {
    if (!isConnected) {
      // Delay para permitir cambio de wallet sin redirect inmediato
      const timer = setTimeout(() => {
        if (!isConnected) {
          router.push("/");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, router]);

  // Resetear mementos al cambiar geoda
  useEffect(() => {
    console.log("🔄 Reset triggered:", {
      selectedCategory,
      selectedClass,
      address,
      isConnected,
    });
    setMementosToUse(0);
    setForgeStep("select");
    setForgeFailed(false);
    setForgedGeodeId(null);
    approvedMementosRef.current = 0;
  }, [selectedCategory, selectedClass]);

  // Resetear a approve si cambian los mementos después de aprobar
  useEffect(() => {
    if (
      forgeStep === "forge" &&
      mementosToUse !== approvedMementosRef.current
    ) {
      console.log(
        "🔄 Mementos changed after approval, resetting to approve step",
        {
          current: mementosToUse,
          approved: approvedMementosRef.current,
        },
      );
      setForgeStep("approve");
    }
  }, [mementosToUse, forgeStep]);

  const handleApprove = async () => {
    console.log("🔍 handleApprove called:", {
      address,
      contracts: !!contracts,
      chain: !!chain,
      selectedCategory,
      selectedClass,
      forgeStep,
    });

    if (!address || !contracts || !chain) {
      showError("Wallet no conectada");
      return;
    }

    try {
      setIsApproving(true);
      showInfo("Aprobando tokens...");

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // ABI básico de ERC20
      const ERC20_ABI = [
        "function approve(address spender, uint256 amount) returns (bool)",
      ];

      // Calcular cantidades - costo base + mementos extra (como el contrato)
      const axsAmount = ethers.parseEther(axsCost.toString());
      const slpAmount = ethers.parseEther(slpCost.toString());
      // El contrato necesita: cost.mementoCost + (mementosToUse * 10**18)
      const baseMementoAmount = ethers.parseEther(mementoCost.toString());
      const extraMementoAmount = ethers.parseEther(mementosToUse.toString());
      const mementoAmount = baseMementoAmount + extraMementoAmount;

      const mementoKeyForLog =
        selectedClass !== undefined
          ? [
              "beast",
              "aqua",
              "bird",
              "reptile",
              "bug",
              "plant",
              "mech",
              "dusk",
              "dawn",
            ][selectedClass]
          : "undefined";
      const mementoAddressForLog =
        selectedClass !== undefined
          ? contracts.mementos[
              [
                "beast",
                "aqua",
                "bird",
                "reptile",
                "bug",
                "plant",
                "mech",
                "dusk",
                "dawn",
              ][selectedClass] as keyof typeof contracts.mementos
            ]
          : "undefined";

      console.log("💰 Approval amounts:", {
        axsCost,
        slpCost,
        mementoCost,
        mementosToUse,
        totalMementoCost,
        axsAmount: axsAmount.toString(),
        slpAmount: slpAmount.toString(),
        mementoAmount: mementoAmount.toString(),
        selectedClass,
        mementoKey: mementoKeyForLog,
        mementoAddress: mementoAddressForLog,
      });

      // Mapear clase de Axie a clave de memento
      if (selectedClass === undefined) {
        console.log(
          "❌ selectedClass is undefined in handleApprove, showing error",
        );
        showError("Selecciona una clase de Axie");
        return;
      }
      const mementoKey = [
        "beast",
        "aqua",
        "bird",
        "reptile",
        "bug",
        "plant",
        "mech",
        "dusk",
        "dawn",
      ][selectedClass] as keyof typeof contracts.mementos;
      const mementoAddress = contracts.mementos[mementoKey];

      // Aprobar AXS
      showInfo("Aprobando AXS...");
      const axsContract = new ethers.Contract(
        contracts.axsToken,
        ERC20_ABI,
        signer,
      );
      const axsTx = await axsContract.approve(
        contracts.scorchHeartTransmuter,
        axsAmount,
      );
      await axsTx.wait();

      // Aprobar SLP
      showInfo("Aprobando SLP...");
      const slpContract = new ethers.Contract(
        contracts.slpToken,
        ERC20_ABI,
        signer,
      );
      const slpTx = await slpContract.approve(
        contracts.scorchHeartTransmuter,
        slpAmount,
      );
      await slpTx.wait();

      // Aprobar Memento
      showInfo("Aprobando Mementos...");
      const mementoContract = new ethers.Contract(
        mementoAddress,
        ERC20_ABI,
        signer,
      );
      const mementoTx = await mementoContract.approve(
        contracts.scorchHeartTransmuter,
        mementoAmount,
      );
      await mementoTx.wait();

      // Guardar el valor de mementos aprobado
      approvedMementosRef.current = mementosToUse;
      setForgeStep("forge");
      showSuccess("✅ Tokens aprobados correctamente");
    } catch (error) {
      console.error("Error en aprobación:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al aprobar tokens";
      showError(errorMessage);
    } finally {
      setIsApproving(false);
    }
  };

  const handleForge = async () => {
    console.log("🔍 handleForge called:", {
      address,
      contracts: !!contracts,
      chain: !!chain,
      selectedCategory,
      selectedClass,
      forgeStep,
    });

    if (!address || !contracts || !chain) {
      showError("Wallet no conectada");
      return;
    }

    if (selectedCategory === undefined || selectedClass === undefined) {
      console.log(
        "❌ selectedCategory or selectedClass is undefined in handleForge",
      );
      showError("Selecciona una categoría y clase de geoda");
      return;
    }

    try {
      setIsForging(true);
      showInfo("Forjando geoda...");

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Contrato Transmuter
      const transmuterContract = new ethers.Contract(
        contracts.scorchHeartTransmuter,
        TRANSMUTER_ABI,
        signer,
      );

      // Logging de parámetros de forja
      console.log("🔨 Forge parameters:", {
        selectedCategory,
        selectedClass,
        mementosToUse,
        currentCosts: {
          axsCost,
          slpCost,
          totalMementoCost,
        },
      });

      // Verificar allowances actuales
      const ERC20_ABI = [
        "function allowance(address owner, address spender) view returns (uint256)",
      ];
      const mementoKey = [
        "beast",
        "aqua",
        "bird",
        "reptile",
        "bug",
        "plant",
        "mech",
        "dusk",
        "dawn",
      ][selectedClass] as keyof typeof contracts.mementos;
      const mementoAddress = contracts.mementos[mementoKey];

      const axsContract = new ethers.Contract(
        contracts.axsToken,
        ERC20_ABI,
        provider,
      );
      const slpContract = new ethers.Contract(
        contracts.slpToken,
        ERC20_ABI,
        provider,
      );
      const mementoContract = new ethers.Contract(
        mementoAddress,
        ERC20_ABI,
        provider,
      );

      const axsAllowance = await axsContract.allowance(
        address,
        contracts.scorchHeartTransmuter,
      );
      const slpAllowance = await slpContract.allowance(
        address,
        contracts.scorchHeartTransmuter,
      );
      const mementoAllowance = await mementoContract.allowance(
        address,
        contracts.scorchHeartTransmuter,
      );

      console.log("💳 Current allowances:", {
        mementoKey,
        mementoAddress,
        axsAllowance: axsAllowance.toString(),
        slpAllowance: slpAllowance.toString(),
        mementoAllowance: mementoAllowance.toString(),
        requiredAmounts: {
          axs: ethers.parseEther(axsCost.toString()).toString(),
          slp: ethers.parseEther(slpCost.toString()).toString(),
          memento: ethers.parseEther(totalMementoCost.toString()).toString(),
        },
      });

      // Ejecutar forgeGeode
      const tx = await transmuterContract.forgeGeode(
        selectedCategory,
        selectedClass,
        mementosToUse,
      );

      showInfo("Esperando confirmación de transacción...");
      const receipt = await tx.wait();

      // Verificar si se creó una geoda (buscar evento Transfer del GeodeNFT)
      const geodeNFT = new ethers.Contract(
        contracts.geodeNFT,
        GEODE_NFT_ABI,
        provider,
      );
      const transferEvents = receipt.logs
        .map((log: any) => {
          try {
            return geodeNFT.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((event: any) => event && event.name === "Transfer");

      if (transferEvents.length > 0) {
        const tokenId = transferEvents[0].args.tokenId;
        setForgedGeodeId(tokenId);
        setForgeStep("success");
        setForgeFailed(false);
        showSuccess(
          `¡Geoda ${geodeName} forjada con éxito! Token ID: ${tokenId}`,
        );
      } else {
        // La forja falló por RNG
        setForgeFailed(true);
        showError(
          `La forja falló debido al RNG (${currentFailureChance}% de probabilidad). Los tokens fueron consumidos.`,
        );
      }
    } catch (error) {
      console.error("Error en forja:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al forjar geoda";
      showError(errorMessage);
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4"
          >
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`aspect-square p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                      selectedCategory === cat.id
                        ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25"
                        : "border-gray-700 bg-black/20 hover:border-gray-600 hover:bg-black/30"
                    }`}
                  >
                    <div className="w-12 h-12 mb-3 relative">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="font-bold text-lg mb-1">{cat.name}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      {cat.rarity}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Max: {cat.maxSupply.toLocaleString()}</div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-red-400">⚠️</span>
                        <span>{cat.failureRate}%</span>
                      </div>
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
                    type="button"
                    key={axieClass.id}
                    onClick={() => setSelectedClass(axieClass.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedClass === axieClass.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-700 bg-black/20 hover:border-gray-600"
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
                      <span className="text-xs font-medium">
                        {axieClass.displayName}
                      </span>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-400">💎</span>
                        <span className="font-bold text-green-400">
                          {Math.floor(
                            Number(getBalance(axieClass.id)) / 1e18,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Mementos Extra */}
            <Card variant="glass" className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                3. Mementos Extra (Opcional)
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Cada 10 mementos reduce la probabilidad de fallo en 1%
              </p>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                💎 Disponibles:{" "}
                <span className="font-bold text-green-400">
                  {selectedClass
                    ? Math.floor(
                        Number(getBalance(selectedClass)) / 1e18,
                      ).toLocaleString()
                    : "0"}
                </span>{" "}
                {classInfo.displayName} Mementos
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setMementosToUse(Math.max(0, mementosToUse - 10))
                  }
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
                  type="button"
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

          {/* Panel Derecho: Animación de Forja */}
          <div className="space-y-6">
            {/* Panel de Animación de Forja */}
            <Card variant="gradient" className="p-6">
              <h2 className="text-2xl font-bold mb-4">🔥 Forja en Progreso</h2>

              <ForgeAnimationPanel
                stage={forgeStage.currentStage}
                selectedCategory={selectedCategory}
                selectedClass={selectedClass}
                forgedGeodeId={forgedGeodeId}
                onSuccessModalClose={() => {
                  setForgeStep("select");
                  setForgedGeodeId(null);
                  setMementosToUse(0);
                  setForgeFailed(false);
                  forgeStage.resetToStage1();
                }}
                onFailModalClose={() => {
                  setForgeStep("select");
                  setForgeFailed(false);
                  forgeStage.resetToStage1();
                }}
                className="aspect-video mb-6"
              />

              {/* Información de la Geoda Seleccionada */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{geodeName}</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <Badge
                    variant="info"
                    style={{
                      backgroundColor: categoryInfo.color + "40",
                      borderColor: categoryInfo.color,
                    }}
                  >
                    {categoryInfo.name}
                  </Badge>
                  <Badge
                    variant="default"
                    style={{
                      backgroundColor: classInfo.color + "40",
                      borderColor: classInfo.color,
                    }}
                  >
                    {classInfo.displayName}
                  </Badge>
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
                      src={
                        selectedClass
                          ? getMementoIcon(selectedClass)
                          : getMementoIcon(AxieClass.BEAST)
                      }
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
                  <span className="text-yellow-400">
                    ⚠️ Probabilidad de Fallo
                  </span>
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

              {/* Botones de Acción */}
              {forgeStep === "select" && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setForgeStep("approve")}
                  disabled={
                    selectedCategory === undefined ||
                    selectedClass === undefined
                  }
                >
                  {selectedCategory === undefined
                    ? "Selecciona una categoría"
                    : selectedClass === undefined
                      ? "Selecciona una clase de Axie"
                      : "Continuar →"}
                </Button>
              )}

              {forgeStep === "approve" && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  {isApproving ? "Aprobando..." : "Aprobar Tokens"}
                </Button>
              )}

              {forgeStep === "forge" && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleForge}
                  disabled={isForging}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isForging ? "Forjando..." : "🔨 Forjar Geoda"}
                </Button>
              )}
            </Card>

            {/* Info Compacta de la Categoría */}
            <Card variant="glass" className="p-4">
              <h4 className="font-bold mb-3 text-lg">📊 Estadísticas</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rareza:</span>
                  <span
                    className="font-medium"
                    style={{ color: categoryInfo.color }}
                  >
                    {categoryInfo.rarity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Poder:</span>
                  <span className="font-bold text-green-400">
                    {categoryInfo.miningPower}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply:</span>
                  <span className="font-medium">
                    {categoryInfo.maxSupply.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bonus:</span>
                  <span className="font-medium text-blue-400">
                    {categoryInfo.collectionBonus}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
