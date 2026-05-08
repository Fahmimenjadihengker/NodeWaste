export const appNavItems = [
  { label: 'Beranda', to: '/dashboard', icon: 'home' },
  { label: 'Scan', to: '/scan', icon: 'scan', featured: true },
  { label: 'Pet', to: '/pet', icon: 'pet' },
  { label: 'Peta', to: '/map', icon: 'map' },
]

export const mobileAppNavItems = [
  ...appNavItems,
  { label: 'Profile', to: '/profile', icon: 'profile' },
]
