# 🔨 ScorchCore Web - Forja de Geodas y Minería de CoreMiners

**ScorchCore Web** es una aplicación descentralizada (dApp) construida con **Next.js** que permite a los usuarios participar en el ecosistema de minería de **ScorchCore Protocol**. Los usuarios pueden forjar geodas cristalinas únicas, eclosionarlas en CoreMiners, y gestionar su inventario de activos NFT.

## 📚 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#%EF%B8%8F-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Setup](#-instalación-y-setup)
- [Configuración de Contratos](#%EF%B8%8F-configuración-de-contratos)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Integración Web3](#-integración-web3)
- [Testing](#-testing)
- [Build y Deployment](#-build-y-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contribuir](#-contribuir)

## 🎮 Características Principales

### 1. **Forja de Geodas** 🔥
- Combina tres tipos de tokens (AXS, SLP, Mementos) para crear Geodas
- 5 categorías de rareza (Petit, Alto, Animal, Ultramech, Tanque)
- 9 clases de Axie (Beast, Aqua, Bird, Reptile, Bug, Plant, Mech, Dusk, Dawn)
- Sistema de probabilidad de fallo con opción de usar Mementos extras para reducir riesgo
- Animaciones en tiempo real durante el proceso de forja
- 45 variantes únicas de Geodas (5 × 9)

### 2. **Eclosión de CoreMiners** 🥚
- Las Geodas eclosionan en CoreMiners tras 24 horas
- Cada CoreMiner hereda el poder de minería de su Geoda
- Bonificación de colección por variedad de tipos
- Sistema de reparación y durabilidad

### 3. **Inventario NFT** 📦
- Gestiona tu colección de Geodas y CoreMiners
- Visualiza estadísticas de cada NFT
- Controla el estado de eclosión y disponibilidad
- Seguimiento de tokens en tiempo real

### 4. **Mining (Minería)** ⛏️
- Los CoreMiners generan rendimiento diario
- Ciclos de minería configurables (1 semana a 3 meses)
- Bonificación por ciclos más largos
- Sistema de alimentación para CoreMiners Voraz

### 5. **Dashboard de Usuario** 📊
- Resumen de activos
- Estadísticas de minería
- Balance de tokens
- Historial de transacciones

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Web3 React hooks
- **Ethers.js** - Blockchain interactions
- **Biome** - Linting y formatting

### Smart Contracts (Integración)
- **ScorchHeartTransmuter** - Contrato principal de forja
- **GeodeNFT** - Contrato de NFTs de Geodas
- **CoreMinerNFT** - Contrato de NFTs de CoreMiners
- **ERC20 Tokens** - AXS, SLP, Mementos

### Blockchain
- **Ronin Network** (Mainnet y Testnet Saigon)
- **MetaMask** o wallet Web3 compatible

## 📁 Estructura del Proyecto

```
ScorchCoreWeb/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing/Home
│   │   ├── forge/                # Página de forja
│   │   ├── inventory/            # Inventario de NFTs
│   │   ├── dashboard/            # Dashboard del usuario
│   │   ├── layout.tsx            # Layout principal
│   │   └── globals.css           # Estilos globales
│   ├── components/
│   │   ├── features/
│   │   │   ├── forge/            # Componentes de forja
│   │   │   └── profile/          # Componentes de perfil
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── ui/                   # Componentes reutilizables (Button, Card, etc)
│   │   └── GeodeVideo.tsx        # Reproductor de videos de Geodas
│   ├── lib/
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useWallet.ts      # Gestión de wallet
│   │   │   ├── useContracts.ts   # Instancias de contratos
│   │   │   ├── useForge.ts       # Lógica de forja
│   │   │   ├── useMementoBalances.ts
│   │   │   └── useForgeStage.ts  # Estados de animación
│   │   ├── config/
│   │   │   ├── contracts.ts      # Direcciones de contratos
│   │   │   └── wagmi.ts          # Configuración de Wagmi
│   │   ├── constants/
│   │   │   ├── geodes.ts         # Info de Geodas y clases
│   │   │   ├── game.ts           # Constantes del juego
│   │   │   └── routes.ts         # Rutas de la app
│   │   ├── abis/                 # ABIs de contratos
│   │   └── types/                # Tipos TypeScript
│   ├── services/
│   │   ├── blockchain/
│   │   │   └── forgeService.ts   # Servicios blockchain
│   │   └── nft/
│   │       ├── axieService.ts
│   │       └── minerService.ts
│   └── styles/                   # Estilos globales
├── public/
│   └── images/                   # Assets estáticos
├── biome.json                    # Configuración de Biome
├── tsconfig.json                 # Configuración TypeScript
├── next.config.ts                # Configuración Next.js
├── package.json                  # Dependencias
└── README.md                     # Este archivo
```

## 🚀 Instalación y Setup

### Requisitos Previos
- **Node.js 18+**
- **npm** o **yarn**
- **MetaMask** o wallet Web3 compatible
- Red blockchain configurada (testnet recomendado)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd ScorchCoreWeb
```

2. **Instalar dependencias:**
```bash
npm install
# o
yarn install
```

3. **Ejecutar el servidor de desarrollo:**

```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador:**

Navega a [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuración de Contratos

Este proyecto utiliza un sistema de **direcciones hardcodeadas con type-safety** en lugar de variables de entorno (`.env`). Esta decisión arquitectónica se tomó por las siguientes razones:

### ¿Por qué no usamos `.env` para direcciones de contratos?

| Aspecto | Variables de Entorno | Hardcoded (actual) |
|---------|---------------------|--------------------|
| **Seguridad** | No aplica - direcciones son públicas en blockchain | No aplica |
| **Type-safety** | ❌ Sin validación TypeScript | ✅ Tipado completo |
| **Simplicidad** | Requiere configuración manual | ✅ Funciona out-of-the-box |
| **Multi-red** | Manual por entorno | ✅ Automático por chainId |

### Arquitectura de Configuración

Las direcciones de contratos están centralizadas en `src/lib/config/contracts.ts`:

```typescript
// Selección automática por red
export function getContractAddresses(chainId: number): ContractAddresses {
  switch (chainId) {
    case 2020: return MAINNET_CONTRACTS;  // Ronin Mainnet
    case 2021: return TESTNET_CONTRACTS;  // Ronin Testnet (Saigon)
    default: return TESTNET_CONTRACTS;
  }
}
```

### Redes Soportadas

| Red | Chain ID | Estado |
|-----|----------|--------|
| Ronin Mainnet | 2020 | Pendiente deploy |
| Ronin Testnet (Saigon) | 2021 | ✅ Activo |

### Modificar Direcciones de Contratos

Para actualizar direcciones (ej: nuevo deploy):

1. Editar `src/lib/config/contracts.ts`
2. Modificar el objeto `TESTNET_CONTRACTS` o `MAINNET_CONTRACTS`
3. Rebuild y redeploy la aplicación

> **Nota**: Las URLs de RPC están configuradas en `src/lib/config/wagmi.ts`

## 📖 Uso de la Aplicación

### Forjar una Geoda

1. Conecta tu wallet MetaMask
2. Navega a **Forja** desde el menú
3. Selecciona:
   - Categoría de Geoda (rareza)
   - Clase de Axie
   - Mementos extras (opcional, reduce probabilidad de fallo)
4. Revisa los costos y probabilidades
5. Haz clic en "Continuar"
6. Aprueba los tokens (AXS, SLP, Memento)
7. Haz clic en "Forjar Geoda"
8. Espera confirmación de la transacción

### Eclosionar una Geoda

1. Navega a **Inventario**
2. Busca la Geoda (debe tener al menos 24 horas de antigüedad)
3. Si está disponible, haz clic en el botón "Eclosionar"
4. Espera confirmación - se creará un CoreMiner

### Gestionar Inventario

1. En **Inventario** ves todas tus Geodas y CoreMiners
2. Cada NFT muestra:
   - Tipo y rareza
   - Poder de minería
   - Estado (Normal, Dañado, etc)
   - Fecha de creación
3. Filtra y ordena por categoría o estado

### Dashboard

En el **Dashboard** encontrarás:
- Resumen de tu cartera
- Estadísticas de minería
- Balances de tokens
- Historial de actividad

## 🔌 Integración Web3

### Hooks Disponibles

```typescript
// Gestionar wallet
const { isConnected, address } = useWallet();

// Obtener instancias de contratos
const contracts = useContracts();

// Balances de Mementos
const { balances, getBalance } = useMementoBalances();

// Datos del usuario
const { userData } = useUserData();

// Hook de forja
const forgeStage = useForgeStage({...});
```

### Flujo de Transacciones

1. **Aprobación** - Usuario aprueba gasto de tokens
2. **Ejecución** - Transacción se envía al contrato
3. **Confirmación** - Se espera confirmación de bloque
4. **Verificación** - Se consultan eventos para verificar éxito

## 🧪 Testing

Para ejecutar tests:

```bash
npm run test
```

## 📝 Linting y Formatting

El proyecto usa **Biome** para linting y formatting:

```bash
# Verificar errores
npm run lint

# Formatear código
npm run format
```

## 🚢 Build y Deployment

### Build de Producción

```bash
npm run build
npm start
```

### Deploy en Vercel

```bash
vercel deploy
```

O conectar el repositorio a Vercel y habilitar auto-deployment en push.

## 📚 Documentación Adicional

- **Game Constants**: Ver `src/lib/constants/game.ts`
- **Geodes Info**: Ver `src/lib/constants/geodes.ts`
- **Smart Contract ABIs**: Ver `src/lib/abis/index.ts`

## 🐛 Troubleshooting

### Problema: "Wallet no conectada"
- **Causa**: MetaMask no instalado o red incorrecta
- **Solución**: Instala MetaMask y agrega Ronin Network manualmente o usa el botón de cambio de red en la app

### Problema: "Red no soportada"
- **Causa**: Wallet conectada a una red diferente a Ronin
- **Solución**: Cambia a Ronin Testnet (Chain ID: 2021) o Mainnet (Chain ID: 2020)

### Problema: "Tokens insuficientes"
- **Causa**: Balance insuficiente de AXS, SLP o Mementos
- **Solución**: En testnet, usa el faucet integrado en la app o contacta al equipo

### Problema: "Transacción rechazada"
- **Causa**: Tokens no aprobados o gas insuficiente
- **Solución**: 
  1. Verifica que hayas aprobado los tokens (AXS, SLP, Memento)
  2. Asegúrate de tener RON suficiente para gas

### Problema: "Contrato no encontrado"
- **Causa**: Direcciones de contratos incorrectas o red equivocada
- **Solución**: Verifica que estés en la red correcta y que `contracts.ts` tenga las direcciones actualizadas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📧 Contacto

Para preguntas o soporte, contacta a: soporte@scorchcore.xyz

---

**Última actualización**: 21 Diciembre 2025  
**Versión**: 1.0.0  
**Red Principal**: Ronin Network
