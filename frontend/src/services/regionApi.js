const regionApiBaseUrl = 'https://wilayah.id/api'

async function fetchRegion(path) {
  const response = await fetch(`${regionApiBaseUrl}${path}`)
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Data wilayah belum bisa dimuat.')
  }

  return payload?.data || []
}

export function getProvinces() {
  return fetchRegion('/provinces.json')
}

export function getRegencies(provinceCode) {
  if (!provinceCode) return Promise.resolve([])
  return fetchRegion(`/regencies/${provinceCode}.json`)
}

export function getDistricts(regencyCode) {
  if (!regencyCode) return Promise.resolve([])
  return fetchRegion(`/districts/${regencyCode}.json`)
}
