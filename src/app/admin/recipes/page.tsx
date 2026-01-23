'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/hooks/useWallet';
import { useRecipes, useAdminRole } from '@/lib/hooks/useRecipes';
import { Loading, Button, Badge } from '@/components/ui';
import { RecipeManagerTable } from '@/components/recipe/RecipeManagerTable';
import { AddRecipeModal } from '@/components/recipe/AddRecipeModal';
import Link from 'next/link';

export default function RecipesAdminPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { isAdmin, isLoading: isLoadingAdmin } = useAdminRole();
  const { recipes, stats, isLoading, refresh, setRecipe, toggleRecipe, isSaving } = useRecipes();
  
  const [showAddModal, setShowAddModal] = useState(false);

  // Redirect si no está conectado
  React.useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected || isLoadingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loading size="lg" text="Verificando permisos..." />
      </div>
    );
  }

  // Access denied si no es admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">🚫 Acceso Denegado</h1>
            <p className="text-gray-300 mb-6">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <Link href="/dashboard">
              <Button variant="primary">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            ← Volver al Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🔨 Gestión de Recetas</h1>
              <p className="text-gray-400">
                Panel de administración para configurar recetas de forja
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              disabled={isSaving}
            >
              + Nueva Receta
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="text-sm text-gray-400 mb-1">Total Recetas</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="text-sm text-gray-400 mb-1">Activas</div>
              <div className="text-3xl font-bold text-green-400">{stats.active}</div>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="text-sm text-gray-400 mb-1">Inactivas</div>
              <div className="text-3xl font-bold text-orange-400">{stats.inactive}</div>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="text-sm text-gray-400 mb-1">Por Categoría</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="default" className="text-xs">
                  Common: {stats.byCategory[0]}
                </Badge>
                <Badge variant="primary" className="text-xs">
                  Rare: {stats.byCategory[1]}
                </Badge>
                <Badge variant="success" className="text-xs">
                  Epic: {stats.byCategory[2]}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Recipes Table */}
        {isLoading ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-12">
            <Loading size="lg" text="Cargando recetas..." />
          </div>
        ) : (
          <RecipeManagerTable
            recipes={recipes}
            onToggle={async (recipe) => {
              await toggleRecipe(
                recipe.category,
                recipe.minerType,
                recipe.minerIndex,
                !recipe.isActive
              );
            }}
            onRefresh={refresh}
            isLoading={isSaving}
          />
        )}

        {/* Add Recipe Modal */}
        <AddRecipeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={async (data) => {
            const result = await setRecipe(
              data.category,
              data.minerType,
              data.minerIndex,
              data.maxSupply,
              data.isActive
            );
            if (result.success) {
              setShowAddModal(false);
            }
            return result;
          }}
        />
      </div>
    </div>
  );
}
