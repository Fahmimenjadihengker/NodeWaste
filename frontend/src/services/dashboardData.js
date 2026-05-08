export const dashboardData = {
  stats: {
    ecoPoints: 165,
    xp: 130,
    nextLevelXp: 250,
    level: 2,
    streak: 3,
    totalScans: 12,
    validScans: 10,
  },
  pet: {
    name: 'Leafy',
    level: 2,
    mood: 'Happy',
    health: 86,
    happiness: 78,
    hunger: 34,
    cleanliness: 72,
  },
  categories: [
    { label: 'Organik', value: 4, color: 'bg-leaf-600' },
    { label: 'Anorganik', value: 5, color: 'bg-[#7fa765]' },
    { label: 'B3', value: 1, color: 'bg-honey' },
  ],
  activities: [
    { title: 'Scan Botol Plastik', meta: '+15 EcoPoints, +10 XP', time: 'Hari ini' },
    { title: 'Leafy diberi makan', meta: '-20 EcoPoints', time: 'Kemarin' },
    { title: 'Scan Sisa Makanan', meta: '+10 EcoPoints, +10 XP', time: '2 hari lalu' },
  ],
  scanActivity: {
    weekly: [
      { label: 'Sen', valid: 2, categories: { organik: 1, anorganik: 1, b3: 0 } },
      { label: 'Sel', valid: 1, categories: { organik: 0, anorganik: 1, b3: 0 } },
      { label: 'Rab', valid: 3, categories: { organik: 1, anorganik: 2, b3: 0 } },
      { label: 'Kam', valid: 1, categories: { organik: 1, anorganik: 0, b3: 0 } },
      { label: 'Jum', valid: 2, categories: { organik: 0, anorganik: 1, b3: 1 } },
      { label: 'Sab', valid: 1, categories: { organik: 0, anorganik: 1, b3: 0 } },
      { label: 'Min', valid: 2, categories: { organik: 1, anorganik: 1, b3: 0 } },
    ],
    monthly: [
      { label: 'M1', valid: 8, categories: { organik: 3, anorganik: 4, b3: 1 } },
      { label: 'M2', valid: 6, categories: { organik: 2, anorganik: 4, b3: 0 } },
      { label: 'M3', valid: 10, categories: { organik: 4, anorganik: 5, b3: 1 } },
      { label: 'M4', valid: 7, categories: { organik: 3, anorganik: 3, b3: 1 } },
    ],
  },
}
