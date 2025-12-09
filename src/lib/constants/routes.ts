// Application routes

export const ROUTES = {
  HOME: '/',
  FORGE: '/forge',
  MINING: '/mining',
  STAKING: '/staking',
  MARKETPLACE: '/marketplace',
  INVENTORY: '/inventory',
  PROFILE: '/profile',
} as const;

export const NAV_ITEMS = [
  { label: 'Forja', href: ROUTES.FORGE, icon: '🔥' },
  { label: 'Minería', href: ROUTES.MINING, icon: '⛏️' },
  { label: 'Staking', href: ROUTES.STAKING, icon: '💎' },
  { label: 'Marketplace', href: ROUTES.MARKETPLACE, icon: '🛒' },
  { label: 'Inventario', href: ROUTES.INVENTORY, icon: '🎒' },
  { label: 'Perfil', href: ROUTES.PROFILE, icon: '👤' },
] as const;
