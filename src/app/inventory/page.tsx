"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/hooks/useWallet";
import { useForge } from "@/lib/hooks/useForge";
import { Card, Button, Badge, Loading, Toast, useToast } from "@/components/ui";
import { GeodeVideo } from "@/components/GeodeVideo";
import { HatchRoulette } from "@/components/HatchRoulette";
import { HatchSuccessModal } from "@/components/HatchSuccessModal";
import Link from "next/link";
import { useAccount, usePublicClient } from "wagmi";
import { useContracts } from "@/lib/hooks/useContracts";
import { ethers } from "ethers";
import { GEODE_NFT_ABI, TRANSMUTER_ABI } from "@/lib/abis";
import {
  GeodeCategory,
  AxieClass,
  CATEGORY_INFO,
  AXIE_CLASS_INFO,
  getGeodeName,
} from "@/lib/constants/geodes";

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
  const { hatchGeode, isLoading: isHatching, error: hatchError } = useForge();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

  const [geodes, setGeodes] = useState<GeodeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHatchAnimation, setShowHatchAnimation] = useState(false);
  const [hatchingGeodeId, setHatchingGeodeId] = useState<bigint | null>(null);
  const [hatchingGeode, setHatchingGeode] = useState<GeodeInfo | null>(null);
  const [isTxConfirmed, setIsTxConfirmed] = useState(false);

  // Estados para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hatchedMiner, setHatchedMiner] = useState<{
    id: bigint;
    name: string;
    rarity: string;
    power: number;
    videoPath: string;
    category: GeodeCategory;
    axieClass: AxieClass;
  } | null>(null);

  // Debug: Ver valores de dependencias
  console.log("📊 Estado del componente Inventory:");
  console.log("  isConnected:", isConnected);
  console.log("  address:", address);
  console.log("  contracts:", contracts);
  console.log("  chain:", chain);

  // Cargar geodas del usuario
  const loadGeodes = async () => {
    console.log("🚀 loadGeodes() llamada");
    console.log("  address:", address);
    console.log("  contracts:", contracts);
    console.log("  chain:", chain);

    if (!address || !contracts || !chain) {
      console.log("❌ loadGeodes salió temprano - falta:", {
        address: !address,
        contracts: !contracts,
        chain: !chain,
      });
      return;
    }

    console.log("🔄 Iniciando carga de geodas...");
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "📡 Creando provider con RPC:",
        chain.rpcUrls.default.http[0],
      );
      const provider = new ethers.JsonRpcProvider(
        chain.rpcUrls.default.http[0],
      );

      console.log("📜 Creando contrato GeodeNFT en:", contracts.geodeNFT);
      const geodeContract = new ethers.Contract(
        contracts.geodeNFT,
        GEODE_NFT_ABI,
        provider,
      );

      console.log(
        "📜 Creando contrato Transmuter en:",
        contracts.scorchHeartTransmuter,
      );
      const transmuterContract = new ethers.Contract(
        contracts.scorchHeartTransmuter,
        TRANSMUTER_ABI,
        provider,
      );

      // Obtener geodas forjadas por el usuario mediante eventos
      // Ronin testnet limita a máximo 500 bloques por query
      console.log("🔢 Obteniendo block number...");
      const currentBlock = await provider.getBlockNumber();
      console.log(`  Current block: ${currentBlock}`);

      // Buscar en los últimos 10000 bloques dividiendo en chunks de 499 bloques
      const totalBlocksToSearch = 10000;
      const chunkSize = 499; // Ronin permite máximo 500 bloques, usamos 499 para estar seguros
      const startBlock = Math.max(0, currentBlock - totalBlocksToSearch);

      console.log(
        `  Buscando eventos desde bloque ${startBlock} hasta ${currentBlock} (${totalBlocksToSearch} bloques)`,
      );
      console.log("🔍 Realizando búsqueda en chunks de 500 bloques...");

      let allForgedEvents: any[] = [];

      // Dividir en chunks y buscar
      for (let from = startBlock; from <= currentBlock; from += chunkSize + 1) {
        const to = Math.min(from + chunkSize, currentBlock);
        console.log(`  📦 Chunk: bloques ${from} - ${to}`);

        const events = await transmuterContract.queryFilter(
          transmuterContract.filters.GeodeForged(address),
          from,
          to,
        );

        if (events.length > 0) {
          console.log(
            `    ✅ Encontrados ${events.length} eventos en este chunk`,
          );
          allForgedEvents = allForgedEvents.concat(events);
        }
      }

      console.log(
        `✅ Búsqueda completada! Total de eventos encontrados: ${allForgedEvents.length}`,
      );
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
          console.log(`🔍 Cargando geoda ${id.toString()}...`);

          // Verificar si el usuario todavía es dueño de la geoda
          // Si la geoda fue quemada (eclosionada), ownerOf revertirá
          let owner: string;
          try {
            owner = await geodeContract.ownerOf(id);
          } catch (ownerError: any) {
            // Si falla ownerOf, la geoda no existe (fue quemada)
            if (
              ownerError?.message?.includes("invalid token ID") ||
              ownerError?.message?.includes("nonexistent token")
            ) {
              console.log(
                `  ⚡ Geoda ${id.toString()} fue quemada (eclosionada), omitiendo`,
              );
              return null;
            }
            throw ownerError; // Re-lanzar otros errores
          }

          console.log(`  ✓ Owner: ${owner}`);

          // Si no es el dueño, omitir
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

          console.log(
            `  ✅ Geoda ${id} cargada - ${fullName}, Fecha: ${forgeDate}`,
          );

          // Calcular si puede eclosionar (1 minuto después de forja - PARA PRUEBAS)
          const hatchTime = forgeDate + 60; // 1 minuto en segundos
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
          // Otros errores inesperados (no debería llegar aquí para geodas quemadas)
          console.warn(
            `⚠️ Error inesperado cargando geoda ${id.toString()}:`,
            err,
          );
          return null;
        }
      });

      const allGeodesData = await Promise.all(geodesDataPromises);

      // Filtrar nulls (geodas quemadas o no accesibles)
      const geodesData = allGeodesData.filter(
        (geode) => geode !== null,
      ) as GeodeInfo[];

      setGeodes(geodesData);
    } catch (err) {
      console.error("Error loading geodes:", err);
      setError(err instanceof Error ? err.message : "Error loading geodes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect ejecutado - Intentando cargar geodas...");
    console.log("  Condiciones:", {
      isConnected,
      address: !!address,
      contracts: !!contracts,
    });

    if (isConnected && address && contracts) {
      console.log("✅ Todas las condiciones OK - Llamando loadGeodes()");
      loadGeodes();
    } else {
      console.log("❌ Falta alguna condición:", {
        isConnected,
        hasAddress: !!address,
        hasContracts: !!contracts,
      });
    }
  }, [isConnected, address, contracts]);

  // Redirect si no está conectado
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const getTimeRemaining = (hatchTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = hatchTime - now;

    if (remaining <= 0) return "Listo para eclosionar";

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h restantes`;
    }

    return `${hours}h ${minutes}m restantes`;
  };

  const handleHatchGeode = async (geodeId: bigint) => {
    console.log("🚀 [HATCH] Iniciando proceso de eclosión");
    console.log("🚀 [HATCH] GeodeId:", geodeId.toString());
    console.log("🚀 [HATCH] Estado inicial:", {
      isHatching,
      showHatchAnimation,
      hatchingGeodeId: hatchingGeodeId?.toString(),
      geodesCount: geodes.length,
    });

    try {
      // Encontrar la geoda que se va a eclosionar
      const geodeToHatch = geodes.find((g) => g.id === geodeId);
      console.log("🚀 [HATCH] Geoda encontrada:", geodeToHatch);

      if (!geodeToHatch) {
        console.error("❌ [HATCH] Geoda no encontrada en la lista");
        return;
      }

      console.log("🚀 [HATCH] Configurando estados para animación");
      setHatchingGeodeId(geodeId);
      setHatchingGeode(geodeToHatch);
      setShowHatchAnimation(true);
      setIsTxConfirmed(false); // Reset estado de confirmación

      console.log("🚀 [HATCH] Estados configurados, mostrando ruleta");
      console.log("🚀 [HATCH] Geoda para eclosionar:", {
        id: geodeToHatch.id.toString(),
        category: geodeToHatch.category,
        axieClass: geodeToHatch.axieClass,
        fullName: geodeToHatch.fullName,
        canHatch: geodeToHatch.canHatch,
      });

      // Ejecutar el contrato inmediatamente (la ruleta girará como placeholder)
      console.log("🚀 [HATCH] Ejecutando contrato de eclosión");
      setTimeout(async () => {
        try {
          showInfo("Enviando transacción de eclosión...");

          const result = await hatchGeode(geodeId);
          console.log("✅ [HATCH] Eclosión exitosa:", result);
          console.log("✅ [HATCH] Transaction hash:", result.tx.hash);
          console.log("✅ [HATCH] Miner ID:", result.minerId?.toString());

          // Mostrar datos del miner si están disponibles
          if (result.minerData) {
            // Los valores ya son bigint, convertirlos a string para mostrar
            const tokenId = result.minerData.tokenId.toString();
            const power = result.minerData.power.toString();
            const efficiency = result.minerData.efficiency.toString();
            const isCritical = result.minerData.isCritical;

            console.log("🎉 [HATCH] Miner Stats:", {
              tokenId,
              power,
              efficiency,
              isCritical: isCritical ? "⭐ CRÍTICO" : "Normal",
              rawTypes: {
                tokenId: typeof result.minerData.tokenId,
                power: typeof result.minerData.power,
                efficiency: typeof result.minerData.efficiency,
              },
            });

            showSuccess(
              `¡CoreMiner #${tokenId} eclosionado! ⚡${power} ⚙️${efficiency} ${isCritical ? "⭐" : ""}`,
            );
          } else {
            // Fallback si minerData no está disponible
            const minerId =
              typeof result.minerId === "bigint"
                ? result.minerId.toString()
                : String(result.minerId || "N/A");
            showSuccess(`¡Geoda eclosionada exitosamente! Miner #${minerId}`);
          }

          // Marcar transacción como confirmada para que la ruleta aplique RNG
          console.log("✅ [HATCH] Marcando transacción como confirmada");
          setIsTxConfirmed(true);

          // Recargar geodas después de la eclosión
          console.log("🔄 [HATCH] Recargando geodas...");
          await loadGeodes();
          console.log("✅ [HATCH] Geodas recargadas");
        } catch (contractError: any) {
          console.error("❌ [HATCH] Error en contrato:", contractError);
          console.error("❌ [HATCH] Error details:", {
            message: contractError?.message,
            code: contractError?.code,
            data: contractError?.data,
          });

          // Mostrar error específico
          let errorMessage = "Error al eclosionar geoda";
          if (
            contractError?.message?.includes("user rejected") ||
            contractError?.message?.includes("User rejected")
          ) {
            errorMessage = "Transacción cancelada por el usuario";
          } else if (contractError?.message?.includes("insufficient funds")) {
            errorMessage = "Fondos insuficientes para gas";
          } else if (contractError?.message) {
            errorMessage = contractError.message.substring(0, 100);
          }

          showError(errorMessage);

          // En caso de error (rechazo), cerrar la ruleta
          setShowHatchAnimation(false);
          setHatchingGeodeId(null);
          setHatchingGeode(null);
          setIsTxConfirmed(false);
        }
      }, 500); // Pequeño delay para que la ruleta inicie primero
    } catch (error: any) {
      console.error("❌ [HATCH] Error general en eclosión:", error);
      console.error("❌ [HATCH] Error stack:", error?.stack);
      setShowHatchAnimation(false);
      setHatchingGeodeId(null);
      setHatchingGeode(null);
    }
  };

  const handleRouletteComplete = (result: any) => {
    console.log("🎉 [ROULETTE] Ruleta completada");
    console.log("🎉 [ROULETTE] Resultado:", result);
    console.log("🎉 [ROULETTE] Minero seleccionado:", {
      id: result?.id,
      name: result?.name,
      rarity: result?.rarity,
      power: result?.power,
      probability: result?.probability,
    });

    if (!hatchingGeode) return;

    // Construir path del video del miner
    // Los thumbnails están en: /images/miners-thumbnails/CATEGORY/CATEGORY CLASS/NAME-thumbnail.webp
    // Los videos están en: /images/miners-thumbnails/CATEGORY/CATEGORY CLASS/NAME.mp4
    const categoryFolders: Record<GeodeCategory, string> = {
      [GeodeCategory.PETIT]: "PETIT",
      [GeodeCategory.ALTO]: "ALTO",
      [GeodeCategory.ANIMAL]: "ANIMAL",
      [GeodeCategory.ULTRAMECH]: "ULTRAMECH",
      [GeodeCategory.TANQUE]: "TANK",
    };

    const classFolders: Record<AxieClass, string> = {
      [AxieClass.AQUA]: "AQUA",
      [AxieClass.BIRD]: "AVE",
      [AxieClass.BUG]: "BICHO",
      [AxieClass.PLANT]: "PLANTA",
      [AxieClass.REPTILE]: "REPTIL",
      [AxieClass.BEAST]: "BESTIA",
      [AxieClass.MECH]: "MECH",
      [AxieClass.DUSK]: "DUSK",
      [AxieClass.DAWN]: "DAWN",
    };

    const categoryFolder = categoryFolders[hatchingGeode.category];
    // Para ULTRAMECH, las subcarpetas usan "ULTRA" en lugar de "ULTRAMECH"
    const subfolder =
      hatchingGeode.category === GeodeCategory.ULTRAMECH
        ? "ULTRA"
        : categoryFolder;
    const classFolder = `${subfolder} ${classFolders[hatchingGeode.axieClass]}`;

    // El nombre viene limpio del thumbnail con guiones bajos
    // Los videos tienen espacios, así que convertimos guiones bajos a espacios
    // Ej: "CHORRO_PRECISO" -> "CHORRO PRECISO"
    const minerFileName = result?.name?.replace(/_/g, " ");

    // La ruta correcta es /images/miners/ no /images/miners-thumbnails/
    const videoPath = `/images/miners/${categoryFolder}/${classFolder}/${minerFileName}.mp4`;

    console.log("🎬 [ROULETTE] Video path construido:", videoPath);

    // Guardar datos del miner para el modal
    setHatchedMiner({
      id: hatchingGeodeId!,
      name: result?.name || "CoreMiner",
      rarity: result?.rarity || "common",
      power: result?.power || 0,
      videoPath,
      category: hatchingGeode.category,
      axieClass: hatchingGeode.axieClass,
    });

    // Ocultar ruleta y mostrar modal de éxito
    console.log("🎉 [ROULETTE] Ocultando animación y mostrando modal...");
    setTimeout(() => {
      setShowHatchAnimation(false);
      setShowSuccessModal(true);
      setIsTxConfirmed(false);
    }, 1500); // Esperar 1.5 segundos para que se vea el resultado
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
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="secondary">← Volver al Dashboard</Button>
              </Link>
              <Link href="/forge">
                <Button variant="primary">🔨 Forjar Nueva Geoda</Button>
              </Link>
            </div>
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
                  variant={geode.canHatch ? "gradient" : "glass"}
                  hover
                  className="p-6"
                >
                  {/* Video de la Geoda */}
                  <div
                    className="mb-4 flex items-center justify-center bg-black/20 rounded-lg overflow-hidden"
                    style={{ height: "240px" }}
                  >
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
                          backgroundColor:
                            CATEGORY_INFO[geode.category].color + "40",
                          borderColor: CATEGORY_INFO[geode.category].color,
                        }}
                      >
                        {geode.categoryName}
                      </Badge>
                      <Badge
                        variant="default"
                        className="text-xs"
                        style={{
                          backgroundColor:
                            AXIE_CLASS_INFO[geode.axieClass].color + "40",
                          borderColor: AXIE_CLASS_INFO[geode.axieClass].color,
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
                      onClick={() => handleHatchGeode(geode.id)}
                      disabled={isHatching && hatchingGeodeId === geode.id}
                    >
                      {isHatching && hatchingGeodeId === geode.id ? (
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

      {/* Componente de Ruleta de Eclosión */}
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

      {/* Modal de Éxito de Eclosión */}
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
          minerVideoPath={hatchedMiner.videoPath}
        />
      )}

      {/* Toast de Notificaciones */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
