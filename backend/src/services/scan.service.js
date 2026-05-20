import { saveScanResult } from "../stores/scan.store.js";

export async function processScan(user, file, mockResult) {
  // Logika poin berdasarkan kategori sampah
  const pointMap = {
    ORGANIK: 10,
    ANORGANIK: 15,
    B3: 20,
  };

  const ecoPoints = pointMap[mockResult.category] || 0;
  const xpReward = 10; // Standar XP per scan

  // Simulasi URL gambar (nanti bisa diganti dengan upload ke Supabase Storage)
  const imageUrl = `uploads/${file.filename}`;

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
