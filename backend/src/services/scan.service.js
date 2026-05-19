import { saveScanResult } from "../stores/scan.store.js";

export async function processScan(user, file, mockResult) {
  const ecoPoints = 50;
  const xpReward = 30;

  // Gambar belum disimpan permanen sampai storage/Path AI final tersedia.
  const imageUrl = null;

  const result = await saveScanResult(
    user.id,
    {
      category: mockResult.category,
      label: mockResult.label,
      confidence: mockResult.confidence,
      imageUrl: imageUrl,
    },
    ecoPoints,
    xpReward,
  );

  return result;
}
