export const scanClassifications = [
  { key: 'berbahaya', label: 'Berbahaya', colorClass: 'bg-red-700', softClass: 'bg-red-100 text-red-900' },
  { key: 'daurUlang', label: 'Daur Ulang', colorClass: 'bg-leaf-600', softClass: 'bg-[#dce8cf] text-leaf-900' },
  { key: 'dibakar', label: 'Dibakar', colorClass: 'bg-honey', softClass: 'bg-[#fff3cf] text-moss' },
  { key: 'tidakDibakar', label: 'Tidak dibakar', colorClass: 'bg-[#7fa765]', softClass: 'bg-[#f5f1df] text-moss' },
]

export const scanClassificationFilters = [
  { label: 'Berbahaya', value: 'berbahaya' },
  { label: 'Daur Ulang', value: 'daur-ulang' },
  { label: 'Dibakar', value: 'dibakar' },
  { label: 'Tidak dibakar', value: 'tidak-dibakar' },
]

export function normalizeClassificationKey(classification) {
  const key = String(classification || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (key.includes('berbahaya') || key === 'b3') return 'berbahaya'
  if (key.includes('daurulang') || key.includes('recycle')) return 'daurUlang'
  if (key.includes('tidakdibakar') || key.includes('janganbakar')) return 'tidakDibakar'
  if (key.includes('dibakar') || key.includes('bakar')) return 'dibakar'
  return null
}

export function getScanClassification(classification) {
  const key = normalizeClassificationKey(classification)
  return scanClassifications.find((item) => item.key === key) || {
    key: 'unknown',
    label: classification || 'Belum diklasifikasi',
    colorClass: 'bg-moss',
    softClass: 'bg-[#f5f1df] text-moss',
  }
}
