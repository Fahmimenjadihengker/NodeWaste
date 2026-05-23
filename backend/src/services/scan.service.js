import { saveScanResult } from "../stores/scan.store.js";
import { classifyWasteImage } from "./ai-classifier.service.js";

export async function processScan(user, file) {
  const ecoPoints = 50;
  const xpReward = 30;
  const aiResult = await classifyWasteImage(file);

  // Gambar belum disimpan permanen sampai storage/Path AI final tersedia.
  const imageUrl = null;

  const result = await saveScanResult(
    user.id,
    {
      category: aiResult.category,
      label: aiResult.label,
      confidence: aiResult.confidence,
      imageUrl: imageUrl,
    },
    ecoPoints,
    xpReward,
  );

  return { ...result, recommendation: aiResult.recommendation };
}
