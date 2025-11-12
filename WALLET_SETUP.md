# 🦊 Configuración de Wallet con RainbowKit y Wagmi

## ✅ Implementación Completada

Se ha integrado exitosamente **RainbowKit** y **Wagmi** para conectar wallets de Ronin en ScorchCore Protocol.

---

## 📦 Dependencias Instaladas

```bash
✅ wagmi - Hooks de React para Ethereum/Ronin
✅ viem - Cliente TypeScript para blockchain
✅ @tanstack/react-query - Gestión de estado asíncrono
✅ @rainbow-me/rainbowkit - UI para conexión de wallets
```

---

## 🏗️ Estructura Creada

### **1. Configuración de Wagmi** (`src/lib/config/wagmi.ts`)
- ✅ Definición de Ronin Mainnet (Chain ID: 2020)
- ✅ Definición de Ronin Testnet Saigon (Chain ID: 2021)
- ✅ RPC URLs configurados
- ✅ Block explorers configurados
- ✅ RainbowKit config inicializado

### **2. Web3Provider** (`src/lib/providers/Web3Provider.tsx`)
- ✅ WagmiProvider wrapper
- ✅ QueryClientProvider para react-query
- ✅ RainbowKitProvider con tema dark customizado
- ✅ Colores brand (Orange #f97316)

### **3. Header Actualizado** (`src/components/layout/Header.tsx`)
- ✅ Integrado ConnectButton de RainbowKit
- ✅ Muestra balance en pantallas grandes
- ✅ Avatar en móviles
- ✅ Indicador de chain con icono

### **4. Layout Principal** (`src/app/layout.tsx`)
- ✅ Web3Provider envolviendo toda la app
- ✅ Metadata SEO para ScorchCore
- ✅ Fuente Inter configurada
- ✅ Idioma español (lang="es")

### **5. Hook Personalizado** (`src/lib/hooks/useWallet.ts`)
- ✅ useWallet() - Hook para acceder a datos de wallet
- ✅ Retorna: address, isConnected, chain, balance, disconnect

---

## 🔧 Configuración Requerida

### **Paso 1: Obtener WalletConnect Project ID**

1. Ve a https://cloud.walletconnect.com/
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia tu **Project ID**

### **Paso 2: Crear archivo `.env.local`**

Crea el archivo en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
```

> ⚠️ **Importante**: No subas este archivo a git (ya está en .gitignore)

---

## 🚀 Uso del Wallet

### **En Componentes**

```tsx
import { useWallet } from '@/lib/hooks/useWallet';

export function MiComponente() {
  const { address, isConnected, balance, disconnect } = useWallet();

  if (!isConnected) {
    return <p>Por favor conecta tu wallet</p>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} RON</p>
      <button onClick={() => disconnect()}>Desconectar</button>
    </div>
  );
}
```

### **Hooks Disponibles de Wagmi**

```tsx
import { 
  useAccount,        // Información de la cuenta
  useBalance,        // Balance del usuario
  useConnect,        // Conectar wallet
  useDisconnect,     // Desconectar wallet
  useContractRead,   // Leer contratos
  useContractWrite,  // Escribir contratos
  useWaitForTransaction // Esperar transacción
} from 'wagmi';
```

---

## 🎨 Personalización del Tema

El tema de RainbowKit está configurado con los colores de ScorchCore:

```tsx
darkTheme({
  accentColor: '#f97316',        // Orange-500
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
})
```

---

## 🌐 Redes Configuradas

### **Ronin Mainnet**
- Chain ID: `2020`
- RPC: `https://api.roninchain.com/rpc`
- Explorer: `https://app.roninchain.com`
- Currency: RON

### **Ronin Testnet (Saigon)**
- Chain ID: `2021`
- RPC: `https://saigon-testnet.roninchain.com/rpc`
- Explorer: `https://saigon-app.roninchain.com`
- Currency: RON
- Testnet: ✅

---

## 📝 Próximos Pasos

### **1. Integrar Smart Contracts**
```typescript
// src/lib/contracts/scorchCore.ts
export const SCORCH_CORE_ADDRESS = '0x...';
export const SCORCH_CORE_ABI = [...];
```

### **2. Crear Hooks de Contratos**
```typescript
// src/lib/hooks/useForge.ts
// src/lib/hooks/useMining.ts
// src/lib/hooks/useStaking.ts
```

### **3. Implementar Funcionalidades**
- Forjar Axies → CoreMiners
- Minar $CORE tokens
- Staking de Axies
- Sistema de recompensas

### **4. Agregar Transacciones**
- Toast notifications (sonner)
- Loading states
- Error handling
- Transaction history

---

## 🐛 Troubleshooting

### **Error: "Project ID is required"**
- Verifica que `.env.local` existe y tiene el Project ID correcto
- Reinicia el servidor de desarrollo: `npm run dev`

### **Error: "Chain not configured"**
- Asegúrate de que Ronin está en la configuración de Wagmi
- Verifica que el chain ID sea correcto (2020 o 2021)

### **Wallet no se conecta**
- Verifica que tienes una wallet compatible instalada (MetaMask, etc.)
- Intenta con el modo testnet primero
- Revisa la consola del navegador para errores

---

## 📚 Recursos

- [Wagmi Docs](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Ronin Documentation](https://docs.roninchain.com/)
- [Viem Docs](https://viem.sh/)

---

## ✨ Features Implementadas

✅ Conexión a Ronin Mainnet y Testnet  
✅ UI moderna con RainbowKit  
✅ Tema dark personalizado (orange/red)  
✅ Responsive design (mobile + desktop)  
✅ Balance display automático  
✅ Chain switcher  
✅ Disconnect functionality  
✅ TypeScript support completo  

---

**🔥 ScorchCore Protocol está listo para conectar wallets de Ronin!**
