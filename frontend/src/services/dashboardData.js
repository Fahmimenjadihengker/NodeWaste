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
      { label: 'Sen', valid: 2, invalid: 1 },
      { label: 'Sel', valid: 1, invalid: 0 },
      { label: 'Rab', valid: 3, invalid: 1 },
      { label: 'Kam', valid: 1, invalid: 1 },
      { label: 'Jum', valid: 2, invalid: 0 },
      { label: 'Sab', valid: 1, invalid: 0 },
      { label: 'Min', valid: 2, invalid: 1 },
    ],
    monthly: [
      { label: 'M1', valid: 8, invalid: 2 },
      { label: 'M2', valid: 6, invalid: 1 },
      { label: 'M3', valid: 10, invalid: 3 },
      { label: 'M4', valid: 7, invalid: 2 },
    ],
  },
}
