# 🔨 Implementación Completa de la Forja - ScorchCore

## ✅ Archivos Creados

### 1. **Servicio de Blockchain**
**`src/services/blockchain/forgeService.ts`**
- Clase `ForgeService` para interactuar con el contrato ScorchHeartTransmuter
- Gestión de tokens ERC20 (AXS, SLP, Memento)
- Funciones para aprobar, forjar y eclosionar geodas

**Funcionalidades:**
- ✅ `getTokenBalances()` - Obtiene balances de tokens del usuario
- ✅ `checkApprovals()` - Verifica si los tokens están aprobados
- ✅ `approveToken()` - Aprueba un token específico
- ✅ `approveAllTokens()` - Aprueba todos los tokens necesarios
- ✅ `forgeGeode()` - Forja una nueva geoda
- ✅ `hatchGeode()` - Eclosiona una geoda para obtener CoreMiner
- ✅ `getUserGeodes()` - Obtiene todas las geodas del usuario
- ✅ `getGeodeInfo()` - Obtiene información de una geoda específica
- ✅ `canHatch()` - Verifica si una geoda puede eclosionar

### 2. **Hook de React**
**`src/lib/hooks/useForge.ts`**
- Hook `useForge()` para usar la forja desde componentes
- Gestión de estado y errores
- Auto-carga de balances al conectar wallet

**Retorna:**
- `balances` - Balances de AXS, SLP, Memento
- `approvals` - Estado de aprobaciones
- `costs` - Costos por tipo de geoda
- `isLoading` - Estado de carga
- `error` - Mensajes de error
- `approveTokens()` - Función para aprobar tokens
- `forgeGeode()` - Función para forjar
- `hatchGeode()` - Función para eclosionar

### 3. **Página de Forja**
**`src/app/forge/page.tsx`**
- UI completa e interactiva
- Selección visual de tipo de geoda
- Muestra balances y costos en tiempo real
- Flujo de 2 pasos: Aprobar tokens → Forjar geoda
- Pantalla de éxito con geode ID
- Validaciones y mensajes de error

---

## 🎨 Características de la UI

### **Header**
- Título con gradiente
- Botón para volver al dashboard
- Cards con balances de tokens (AXS, SLP, Memento)

### **Selección de Geodas**
5 tipos de geodas con:
- 🥚 **Petit** - 10 AXS, 5,000 SLP, 5 Memento (24h incubación)
- 🔮 **Alto** - 25 AXS, 12,000 SLP, 10 Memento (48h incubación)
- 💎 **Animal** - 50 AXS, 25,000 SLP, 20 Memento (72h incubación)
- ⚡ **Ultramech** - 100 AXS, 50,000 SLP, 50 Memento (96h incubación)
- 🔥 **Tanque** - 200 AXS, 100,000 SLP, 100 Memento (120h incubación)

### **Panel de Detalles**
**Lado Izquierdo:**
- Emoji grande de la geoda seleccionada
- Nombre y descripción
- Tiempo de incubación
- Tipo de geoda

**Lado Derecho:**
- Costos detallados por token
- Balance actual vs requerido
- Indicador de "Insuficiente" si no hay fondos
- Botones de acción con estados:
  - "Aprobar Tokens" (si no están aprobados)
  - "Forjar Geoda" (si están aprobados)
  - Loading states durante las transacciones

### **Pantalla de Éxito**
- Animación de celebración 🎉
- Muestra el Geode ID generado
- Tiempo de incubación
- Botones para ver en inventario o forjar otra

---

## 🔧 Configuración Necesaria

### **Actualizar Direcciones de Contratos**

Editar `src/lib/config/contracts.ts`:

```typescript
// Para TESTNET
const TESTNET_CONTRACTS = {
  // ... tokens existentes
  scorchHeartTransmuter: '0x...', // Dirección del Transmuter después del deploy
};

// Para MAINNET (cuando esté listo)
const MAINNET_CONTRACTS = {
  scorchHeartTransmuter: '0x...', // Dirección del Transmuter en mainnet
};
```

---

## 🚀 Flujo de Uso

### **Paso 1: Conectar Wallet**
Usuario conecta su wallet desde la página principal

### **Paso 2: Ir a la Forja**
Desde el dashboard, click en "Ir a la Forja"

### **Paso 3: Obtener Tokens (solo testnet)**
```bash
# Usar los faucets para obtener tokens de prueba
npx hardhat run scripts/claim-tokens.js --network roninTestnet
```

### **Paso 4: Seleccionar Geoda**
- Usuario selecciona el tipo de geoda
- Sistema muestra costos y verifica balances

### **Paso 5: Aprobar Tokens**
- Click en "Aprobar Tokens"
- Se aprueban AXS, SLP y Memento
- Transacción en blockchain

### **Paso 6: Forjar Geoda**
- Click en "Forjar Geoda"
- Se queman los tokens
- Se crea la geoda
- Se muestra el Geode ID

### **Paso 7: Esperar Incubación**
- Geoda debe esperar el tiempo de incubación
- Puede verse en el inventario

### **Paso 8: Eclosionar (futuro)**
- Después del tiempo de incubación
- Función `hatchGeode()` para obtener CoreMiner

---

## 📊 Costos por Tipo de Geoda

| Geoda | AXS | SLP | Memento | Incubación |
|-------|-----|-----|---------|------------|
| Petit | 10 | 5,000 | 5 | 24 horas |
| Alto | 25 | 12,000 | 10 | 48 horas |
| Animal | 50 | 25,000 | 20 | 72 horas |
| Ultramech | 100 | 50,000 | 50 | 96 horas |
| Tanque | 200 | 100,000 | 100 | 120 horas |

---

## 🧪 Testing en Testnet

### 1. **Deploy Contratos**
```bash
cd contratos
npx hardhat run scripts/deploy-testnet.js --network roninTestnet
```

### 2. **Actualizar Direcciones**
Copiar las direcciones del deploy a `src/lib/config/contracts.ts`

### 3. **Obtener Tokens de Prueba**
```bash
npx hardhat run scripts/claim-tokens.js --network roninTestnet
```

### 4. **Probar Forja**
1. Conectar wallet en testnet
2. Ir a /forge
3. Seleccionar "Geoda Petit" (la más barata)
4. Aprobar tokens
5. Forjar geoda
6. Verificar que se creó correctamente

### 5. **Verificar en Inventario** (futuro)
Ver la geoda en el inventario del usuario

---

## 🎯 Próximos Pasos

### Corto Plazo (Inmediato)
- [ ] Deploy contratos en testnet
- [ ] Actualizar direcciones en `contracts.ts`
- [ ] Obtener tokens de faucet
- [ ] Probar forja completa
- [ ] Verificar eventos emitidos

### Mediano Plazo
- [ ] Crear página de inventario
- [ ] Implementar función de eclosión
- [ ] Mostrar geodas pendientes de eclosión
- [ ] Sistema de notificaciones cuando una geoda puede eclosionar
- [ ] Ver CoreMiners generados

### Largo Plazo
- [ ] Sistema de preview de CoreMiners antes de eclosionar
- [ ] Animaciones de forja y eclosión
- [ ] Historial de forjas
- [ ] Estadísticas de colección

---

## 📝 Notas Técnicas

### **Gestión de Transacciones**
- Usa ethers v6 con wagmi v2
- Las transacciones esperan confirmación antes de continuar
- Eventos parseados del contrato para obtener IDs

### **Manejo de Errores**
- Errores de blockchain capturados y mostrados al usuario
- Validación de balances antes de permitir forja
- Validación de aprobaciones

### **Estados de Carga**
- Loading states durante aprobar y forjar
- Deshabilita botones durante transacciones
- Feedback visual claro del progreso

---

## 🔐 Seguridad

### **Validaciones**
- ✅ Verifica balance suficiente antes de aprobar
- ✅ Verifica aprobaciones antes de forjar
- ✅ Solo permite forjar si wallet está conectada
- ✅ Validación de tipos de geoda válidos

### **Buenas Prácticas**
- ✅ Aprobación de cantidad exacta (no infinita)
- ✅ Verificación de eventos en transacciones
- ✅ Manejo de errores robusto
- ✅ No expone claves privadas

---

## 📚 Documentación de Contratos

Revisar:
- `contratos/mocks/README.md` - Documentación de mocks
- `contratos/mocks/QUICK_START.md` - Guía rápida de deploy
- `contratos/optimized/README.md` - Documentación de contratos optimizados

---

**Versión:** 1.0  
**Fecha:** 6 de Noviembre, 2025  
**Estado:** ✅ Listo para testing en testnet
