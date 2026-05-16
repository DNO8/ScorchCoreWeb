"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useCoreMinerMetadata,
  getMiningPower,
  getRarity,
  getMaxSupply,
} from "@/hooks/metadata/useCoreMinerMetadata";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAccount, useReadContract } from "wagmi";
import { createServiceLogger } from "@/lib/utils/logging/logger";
import { GeodeCategory, AxieClass } from "@/lib/constants/geodes";

const log = createServiceLogger("CoreMinerDetail");

interface CoreMinerNFTData {
  category: number;
  minerType: number;
  minerIndex: number;
  power: number;
  owner: string;
  exists: boolean;
}

export default function CoreMinerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const tokenId = params.id as string;

  const [nftData, setNftData] = useState<CoreMinerNFTData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Leer datos del NFT desde el contrato
  // TODO: Implementar lectura real del contrato CoreMinerNFT
  useEffect(() => {
    // Simulación temporal - en producción usar useReadContract
    const loadNFTData = async () => {
      try {
        // Aquí deberías llamar a getMinerData(tokenId) del contrato
        // Por ahora simulo datos
        const mockData: CoreMinerNFTData = {
          category: 0, // PETIT
          minerType: 0, // BEAST
          minerIndex: 0,
          power: 50,
          owner: address || "",
          exists: true,
        };
        setNftData(mockData);
      } catch (error) {
        log.error("Error loading NFT data", { error, tokenId });
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTData();
  }, [tokenId, address]);

  const {
    metadata,
    loading: metadataLoading,
    error,
  } = useCoreMinerMetadata(
    (nftData?.category as GeodeCategory) ?? GeodeCategory.PETIT,
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
    ][nftData?.minerType ?? 0],
    nftData?.minerIndex ?? 0,
  );

  const isOwner =
    address && nftData?.owner.toLowerCase() === address.toLowerCase();

  if (isLoading || metadataLoading) {
    return <LoadingState />;
  }

  if (error || !metadata || !nftData) {
    return <ErrorState tokenId={tokenId} />;
  }

  const power = getMiningPower(metadata);
  const rarity = getRarity(metadata);
  const maxSupply = getMaxSupply(metadata);

  const rarityColors: Record<string, string> = {
    Common: "text-gray-400",
    Rare: "text-blue-400",
    Epic: "text-purple-400",
    Legendary: "text-orange-400",
    Mythic: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400 flex items-center gap-2">
          <Link
            href="/inventory"
            className="hover:text-white transition-colors"
          >
            ← Inventario
          </Link>
          <span>/</span>
          <span className="text-white">CoreMiner #{tokenId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video/Image Panel */}
          <div className="space-y-4">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <video
                src={metadata.animation_url.replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/",
                )}
                autoPlay
                loop
                muted
                controls
                playsInline
                className="w-full rounded-lg"
              />
            </Card>

            {/* Owner info */}
            {isOwner && (
              <Card className="p-4 bg-green-900/20 border-green-500/50">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-green-300">
                    Eres el propietario de este CoreMiner
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{metadata.name}</h1>
              <p className="text-gray-400 text-lg">{metadata.description}</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-linear-to-br from-green-900/30 to-gray-800 border-green-500/30">
                <div className="text-sm text-gray-400 mb-1">Mining Power</div>
                <div className="text-4xl font-bold text-green-400">
                  ⚡ {power}
                </div>
              </Card>

              <Card className="p-6 bg-linear-to-br from-purple-900/30 to-gray-800 border-purple-500/30">
                <div className="text-sm text-gray-400 mb-1">Rarity</div>
                <div className={`text-4xl font-bold ${rarityColors[rarity]}`}>
                  {rarity}
                </div>
              </Card>
            </div>

            {/* All Attributes */}
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Atributos</h2>
              <div className="space-y-2">
                {metadata.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-900/50 p-3 rounded hover:bg-gray-900 transition-colors"
                  >
                    <span className="text-gray-400">{attr.trait_type}</span>
                    <span className="font-semibold text-white">
                      {typeof attr.value === "number" &&
                      attr.display_type === "number"
                        ? attr.value.toLocaleString()
                        : attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            {isOwner && (
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Stakear
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-800"
                >
                  Transferir
                </Button>
              </div>
            )}

            {/* External Links */}
            <Card className="p-4 bg-gray-800/50 border-gray-700">
              <h3 className="text-sm font-semibold mb-3 text-gray-400">
                Enlaces
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href={metadata.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Ver en ScorchCore</span>
                  <span>→</span>
                </a>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${metadata.animation_url.replace("ipfs://", "").split("/")[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Ver metadata en IPFS</span>
                  <span>→</span>
                </a>
                <a
                  href={`https://saigon-app.roninchain.com/token/${process.env.NEXT_PUBLIC_COREMINER_NFT_ADDRESS}/${tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Ver en Ronin Explorer</span>
                  <span>→</span>
                </a>
              </div>
            </Card>

            {/* Token Info */}
            <Card className="p-4 bg-gray-800/30 border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Token ID</div>
                  <div className="font-mono text-white">#{tokenId}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Contract</div>
                  <div className="font-mono text-white text-xs truncate">
                    {process.env.NEXT_PUBLIC_COREMINER_NFT_ADDRESS || "N/A"}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-8">
          {/* Mining History - Placeholder */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Historial de Minería</h2>
            <p className="text-gray-400">
              Próximamente: Historial de rewards, ciclos de minería, y
              estadísticas detalladas.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Cargando CoreMiner...</p>
      </div>
    </div>
  );
}

function ErrorState({ tokenId }: { tokenId: string }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Card className="p-8 bg-red-900/20 border-red-500 max-w-md">
        <div className="text-center">
          <span className="text-6xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold mb-2">CoreMiner no encontrado</h2>
          <p className="text-gray-400 mb-4">
            No se pudo cargar el CoreMiner con Token ID #{tokenId}
          </p>
          <Link href="/inventory">
            <Button>Volver al Inventario</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
