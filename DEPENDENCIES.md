# 📦 Dependencias Necesarias para ScorchCore Web

## 🚀 Instalación

Ejecuta el siguiente comando para instalar todas las dependencias:

```bash
npm install wagmi viem @tanstack/react-query @rainbow-me/rainbowkit zustand lucide-react clsx tailwind-merge sonner
```

```bash
npm install -D @types/node
```

---

## 📋 Lista de Dependencias

### **Blockchain & Web3**
- `wagmi` - Hooks de React para Ethereum
- `viem` - Cliente TypeScript para Ethereum
- `@tanstack/react-query` - Gestión de estado asíncrono
- `@rainbow-me/rainbowkit` - Componentes de conexión de wallet

### **Estado Global**
- `zustand` - Gestión de estado ligera

### **UI & Styling**
- `lucide-react` - Iconos
- `clsx` - Utilidad para clases condicionales
- `tailwind-merge` - Merge de clases de Tailwind
- `sonner` - Toast notifications

### **Utilidades**
- `date-fns` - Manipulación de fechas
- `@hookform/resolvers` - Validación de formularios
- `zod` - Validación de esquemas

---

## 🎨 Dependencias Opcionales (Recomendadas)

```bash
npm install framer-motion react-hook-form zod date-fns
```

- `framer-motion` - Animaciones
- `react-hook-form` - Formularios
- `zod` - Validación

---

## ⚙️ Configuración Post-Instalación

1. **Actualizar `tsconfig.json`** ✅ (Ya actualizado a ES2020)
2. **Configurar Wagmi** - Crear `src/config/wagmi.ts`
3. **Configurar RainbowKit** - Crear providers
4. **Configurar Zustand** - Crear stores

---

## 🔗 Próximos Pasos

1. Instalar dependencias
2. Configurar Wagmi y RainbowKit
3. Crear componentes base
4. Implementar hooks de blockchain
