export const appNavItems = [
  { label: 'Beranda', to: '/dashboard', icon: 'home' },
  { label: 'Scan', to: '/scan', icon: 'scan', featured: true },
  { label: 'Pet', to: '/pet', icon: 'pet' },
  { label: 'Jadwal', to: '/schedule', icon: 'schedule' },
]

export const mobileAppNavItems = [
  appNavItems[0],
  appNavItems[2],
  appNavItems[1],
  appNavItems[3],
  { label: 'Profile', to: '/profile', icon: 'profile' },
]
