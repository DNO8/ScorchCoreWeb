# 📁 Estructura del Proyecto ScorchCore Web

## 🎯 Arquitectura General

```
ScorchCoreWeb/
├── src/
│   ├── app/                      # Next.js App Router (páginas)
│   │   ├── forge/               # Página de forja de Geodas
│   │   ├── mining/              # Página de minería
│   │   ├── staking/             # Página de staking de Axies
│   │   ├── marketplace/         # Marketplace de NFTs
│   │   ├── inventory/           # Inventario del usuario
│   │   └── profile/             # Perfil del usuario
│   │
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   ├── layout/              # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   └── features/            # Componentes por feature
│   │       ├── forge/           # Componentes de forja
│   │       ├── mining/          # Componentes de minería
│   │       ├── staking/         # Componentes de staking
│   │       ├── marketplace/     # Componentes de marketplace
│   │       ├── inventory/       # Componentes de inventario
│   │       └── profile/         # Componentes de perfil
│   │
│   ├── lib/                     # Utilidades y lógica de negocio
│   │   ├── contracts/           # ABIs y direcciones de contratos
│   │   │   ├── abis/
│   │   │   ├── addresses.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/               # Custom React Hooks
│   │   │   ├── useWallet.ts
│   │   │   ├── useContract.ts
│   │   │   ├── useForge.ts
│   │   │   ├── useMining.ts
│   │   │   └── useStaking.ts
│   │   │
│   │   ├── utils/               # Funciones utilitarias
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── constants/           # Constantes de la app
│   │       ├── game.ts
│   │       ├── routes.ts
│   │       └── config.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── contracts.ts
│   │   ├── game.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── store/                   # Estado global (Zustand/Redux)
│   │   ├── slices/
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── services/                # Servicios externos
│   │   ├── api/                 # API REST
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   │
│   │   └── blockchain/          # Interacción con blockchain
│   │       ├── provider.ts
│   │       ├── signer.ts
│   │       └── transactions.ts
│   │
│   ├── styles/                  # Estilos globales
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   └── config/                  # Configuración de la app
│       ├── env.ts
│       ├── chains.ts
│       └── wagmi.ts
│
└── public/                      # Archivos estáticos
    ├── images/
    │   ├── axies/              # Imágenes de Axies
    │   ├── miners/             # Imágenes de CoreMiners
    │   ├── geodes/             # Imágenes de Geodas
    │   └── ui/                 # Iconos y UI assets
    │
    └── sounds/                 # Efectos de sonido
```

---

## 📦 Descripción de Carpetas

### **`src/app/`** - Páginas de Next.js
Contiene las rutas de la aplicación usando App Router de Next.js 13+.

### **`src/components/`** - Componentes React
- **`ui/`**: Componentes reutilizables (botones, cards, modales)
- **`layout/`**: Componentes de estructura (header, footer, sidebar)
- **`features/`**: Componentes específicos por funcionalidad

### **`src/lib/`** - Lógica de Negocio
- **`contracts/`**: ABIs y direcciones de smart contracts
- **`hooks/`**: Custom hooks para interacción con blockchain
- **`utils/`**: Funciones utilitarias
- **`constants/`**: Constantes de la aplicación

### **`src/types/`** - TypeScript Types
Definiciones de tipos para TypeScript.

### **`src/store/`** - Estado Global
Gestión de estado con Zustand o Redux.

### **`src/services/`** - Servicios
- **`api/`**: Cliente HTTP para backend
- **`blockchain/`**: Interacción con Ronin blockchain

### **`src/styles/`** - Estilos
Estilos globales y temas con Tailwind CSS.

### **`src/config/`** - Configuración
Configuración de entorno, chains, y wagmi.

### **`public/`** - Assets Estáticos
Imágenes, sonidos y otros archivos públicos.

---

## 🚀 Próximos Pasos

1. ✅ Estructura de carpetas creada
2. ⏳ Instalar dependencias necesarias
3. ⏳ Configurar Wagmi y RainbowKit
4. ⏳ Crear componentes base
5. ⏳ Implementar hooks de blockchain
6. ⏳ Desarrollar páginas principales
