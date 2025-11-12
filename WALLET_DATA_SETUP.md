# 🔗 Configuración de Datos Reales de Wallet - ScorchCore

Este documento explica cómo el frontend se conecta a los datos reales de la wallet del usuario, ya sea en testnet o mainnet.

---

## 📊 Cambios Implementados

### 1. **Eliminación de Datos Mock**

Se eliminaron los datos hardcodeados en el dashboard:
- ❌ `mockAxies` (datos de ejemplo de Axies)
- ❌ `mockCoreMiners` (datos de ejemplo de mineros)
- ❌ `userStats` (estadísticas hardcodeadas)

### 2. **Integración con Blockchain**

Se crearon hooks para obtener datos reales:
- ✅ `useUserData` - Obtiene todos los datos del usuario
- ✅ `useNFTs` - Carga Axies y CoreMiners de la wallet
- ✅ `useMiningStats` - Obtiene estadísticas de minería
- ✅ `useContracts` - Gestiona direcciones de contratos por red

---

## 🏗️ Arquitectura

```
useUserData (Hook central)
├── useNFTs
│   ├── useAxies → AxieService → Contrato Axie
│   └── useMiners → MinerService → Contrato CoreMiner
├── useMiningStats → Contrato MiningScheduler
└── useContracts → Configuración por red
```

---

## 📝 Configuración de Contratos

### Archivo Principal: `src/lib/config/contracts.ts`

Este archivo contiene todas las direcciones de contratos para ambas redes:

```typescript
// Mainnet (Chain ID: 2020)
const MAINNET_CONTRACTS = {
  axsToken: '0x97a9107c1793bc407d6f527b77e7fff4d812bece', // Real
  slpToken: '0xa8754b9fa15fc18bb59458815510e40a12cd2014', // Real
  axieNFT: '0x32950db2a7164aE833121501C797D79E7B79d74C', // Real
  
  // ScorchCore (actualizar después del deploy)
  coreToken: '0x0000...',
  coreMinerNFT: '0x0000...',
  miningScheduler: '0x0000...',
  // ... otros contratos
};

// Testnet (Chain ID: 2021)
const TESTNET_CONTRACTS = {
  axsToken: '0x0000...', // MockAXS
  slpToken: '0x0000...', // MockSLP
  // ... contratos de testnet
};
```

---

## 🚀 Cómo Actualizar Direcciones

### Paso 1: Deploy de Contratos

```bash
# En testnet
cd contratos
npx hardhat run scripts/deploy-testnet.js --network roninTestnet

# En mainnet (cuando esté listo)
npx hardhat run scripts/deploy-mainnet.js --network roninMainnet
```

### Paso 2: Actualizar Frontend

Edita `src/lib/config/contracts.ts`:

```typescript
// Para TESTNET
const TESTNET_CONTRACTS: ContractAddresses = {
  // Tokens Mock
  axsToken: '0xABC123...', // Copiar de deployment-testnet.json
  slpToken: '0xDEF456...',
  coreToken: '0xGHI789...',
  
  // NFTs
  axieNFT: '0xJKL012...',
  coreMinerNFT: '0xMNO345...',
  geodeNFT: '0xPQR678...',
  
  // Contratos Core
  scorchHeartTransmuter: '0xSTU901...',
  miningScheduler: '0xVWX234...',
  axieStakingManager: '0xYZA567...',
  
  // Faucets (solo testnet)
  tokenFaucet: '0xBCD890...',
  axieFaucet: '0xEFG123...',
};

// Para MAINNET (usar tokens reales de Axie)
const MAINNET_CONTRACTS: ContractAddresses = {
  // Tokens reales (ya configurados)
  axsToken: '0x97a9107c1793bc407d6f527b77e7fff4d812bece',
  slpToken: '0xa8754b9fa15fc18bb59458815510e40a12cd2014',
  axieNFT: '0x32950db2a7164aE833121501C797D79E7B79d74C',
  
  // ScorchCore tokens
  coreToken: '0xXYZ123...', // Copiar de deployment-mainnet.json
  fCoreToken: '0xABC456...',
  mementoToken: '0xDEF789...',
  
  // NFTs ScorchCore
  coreMinerNFT: '0xGHI012...',
  geodeNFT: '0xJKL345...',
  
  // Contratos Core
  scorchHeartTransmuter: '0xMNO678...',
  miningScheduler: '0xPQR901...',
  axieStakingManager: '0xSTU234...',
};
```

---

## 🔍 Verificación

### 1. Verificar Red Actual

El hook detecta automáticamente la red:

```typescript
const { chain } = useAccount();
// chain.id === 2020 → Mainnet
// chain.id === 2021 → Testnet
```

### 2. Verificar Datos Cargados

En el dashboard, abre la consola del navegador:

```javascript
// Debería mostrar los datos reales
console.log('Axies:', axies);
console.log('Miners:', miners);
console.log('Stats:', stats);
```

### 3. Verificar Contratos

```typescript
import { getContractAddresses, isValidAddress } from '@/lib/config/contracts';

const contracts = getContractAddresses(2021); // testnet
console.log('CoreMiner Address:', contracts.coreMinerNFT);
console.log('Is valid?', isValidAddress(contracts.coreMinerNFT));
```

---

## 📊 Datos Mostrados

### Dashboard Overview

**Estadísticas principales:**
- **Axies en Wallet** → `stats.axiesOwned` (de blockchain)
- **CoreMiners Activos** → `stats.coreMinersActive` (de blockchain)
- **$CORE Minado** → `stats.totalCOREMined` (del contrato MiningScheduler)
- **Tasa Diaria** → `stats.dailyRate` (calculado desde contratos)

### Tab Axies

Muestra todos los Axies reales del usuario:
- Obtenidos desde el contrato de Axie NFT
- Metadatos desde API de Axie Infinity
- Estado de staking verificado on-chain

### Tab CoreMiners

Muestra todos los CoreMiners reales del usuario:
- Obtenidos desde el contrato CoreMinerNFT
- Stats on-chain (power, efficiency, level)
- Estado de minería desde MiningScheduler

---

## ⚙️ Configuración Avanzada

### Variables de Entorno

Crea `.env.local`:

```bash
# WalletConnect Project ID (requerido)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id

# RPC personalizado (opcional)
NEXT_PUBLIC_RONIN_RPC=https://api.roninchain.com/rpc
NEXT_PUBLIC_TESTNET_RPC=https://saigon-testnet.roninchain.com/rpc

# Addresses personalizadas (opcional, sobreescribe contracts.ts)
NEXT_PUBLIC_CORE_MINER_ADDRESS=0x...
```

### Usar RPC Personalizado

Edita `src/services/nft/axieService.ts`:

```typescript
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RONIN_RPC || 'https://api.roninchain.com/rpc'
);
```

---

## 🐛 Troubleshooting

### Problema: No se cargan los Axies

**Causa:** Contrato de Axie no configurado o red incorrecta

**Solución:**
```typescript
// Verificar en contracts.ts
const contracts = getContractAddresses(chain.id);
console.log('Axie NFT:', contracts.axieNFT);
// Debe ser: 0x32950db2... para mainnet
```

### Problema: Stats muestran 0

**Causa:** Contratos de ScorchCore no deployados

**Solución:**
1. Verificar que las direcciones en `contracts.ts` no sean `0x0000...`
2. Si aún no están deployados, es normal que muestre 0

### Problema: "Contract not deployed yet"

**Causa:** Los contratos tienen address zero (`0x0000...`)

**Solución:**
1. Esto es normal durante desarrollo
2. Deploy los contratos siguiendo `contratos/mocks/QUICK_START.md`
3. Actualiza las direcciones en `contracts.ts`

---

## 🎯 Checklist de Testing

### Testnet
- [ ] Deploy contratos mock
- [ ] Actualizar direcciones en `contracts.ts`
- [ ] Obtener tokens del faucet
- [ ] Mintear Axies de prueba
- [ ] Verificar que dashboard muestra datos correctos
- [ ] Probar forja de CoreMiner
- [ ] Verificar stats de minería

### Mainnet
- [ ] Deploy contratos producción
- [ ] Actualizar direcciones mainnet en `contracts.ts`
- [ ] Verificar conexión con Axies reales
- [ ] Testing exhaustivo en testnet primero
- [ ] Auditoría de seguridad
- [ ] Deploy frontend

---

## 📚 Archivos Relacionados

```
ScorchCoreWeb/
├── src/
│   ├── lib/
│   │   ├── config/
│   │   │   └── contracts.ts          # ⭐ Direcciones de contratos
│   │   └── hooks/
│   │       ├── useContracts.ts       # Hook para obtener contratos
│   │       ├── useUserData.ts        # Hook central de datos
│   │       ├── useNFTs.ts            # Hook para NFTs
│   │       └── useMiningStats.ts     # Hook para mining
│   ├── services/
│   │   └── nft/
│   │       ├── axieService.ts        # Servicio Axie NFT
│   │       └── minerService.ts       # Servicio CoreMiner
│   └── app/
│       └── dashboard/
│           └── page.tsx              # Dashboard con datos reales
└── WALLET_DATA_SETUP.md             # Este archivo
```

---

## 🚦 Estado Actual

### ✅ Implementado
- Sistema de configuración por red
- Hooks para obtener datos reales
- Servicios para NFTs
- Dashboard actualizado con datos reales

### 🔄 En Progreso
- Deploy de contratos en testnet
- Testing con datos reales
- Optimización de carga de datos

### ⏳ Pendiente
- Deploy en mainnet
- Caché de datos
- Actualizaciones en tiempo real (eventos)

---

**Versión:** 1.0  
**Última actualización:** 6 de Noviembre, 2025  
**Mantenedor:** ScorchCore Team
