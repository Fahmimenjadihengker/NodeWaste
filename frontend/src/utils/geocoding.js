export async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        }
      }
    );
    if (!response.ok) {
      throw new Error('Gagal mendeteksi lokasi');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Normalizes an Indonesian region name to match against database entries.
 * Removes common prefixes like "Provinsi", "Kabupaten", "Kota", "Kecamatan".
 * Removes all spaces and non-alphanumeric characters for aggressive matching.
 */
export function normalizeRegionName(name) {
  if (!name) return '';
  
  let normalized = name.toLowerCase()
    // Handle special case for Yogyakarta
    .replace(/special region of yogyakarta/gi, 'yogyakarta')
    // Remove standard prefixes
    .replace(/^(provinsi|prov\.|daerah istimewa|d\.i\.|kota|kabupaten|kab\.|kecamatan|kec\.|kelurahan|desa)\s+/gi, '')
    // Remove standard suffixes (sometimes Nominatim attaches them like "City")
    .replace(/\s+(city|regency|district)$/gi, '');

  return normalized
    .replace(/\s+/g, '') // remove all spaces
    .replace(/[^a-z0-9]/gi, ''); // remove punctuation
}

/**
 * Finds the best matching region from a list based on normalized names.
 */
export function findMatchingRegion(regions, targetName) {
  if (!regions || !targetName) return null;
  
  const targetNorm = normalizeRegionName(targetName);
  
  // Try exact normalized match first
  for (const region of regions) {
    if (normalizeRegionName(region.name) === targetNorm) {
      return region;
    }
  }

  // Fallback: try includes
  for (const region of regions) {
    const regionNorm = normalizeRegionName(region.name);
    if (targetNorm.includes(regionNorm) || regionNorm.includes(targetNorm)) {
      return region;
    }
  }

  return null;
}
