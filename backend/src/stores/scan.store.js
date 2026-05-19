import prisma from "../config/prisma.js";

function applyLevelProgress(currentLevel, currentXp, gainedXp) {
  const totalXp = currentXp + gainedXp
  const levelGain = Math.floor(totalXp / 100)

  return {
    level: currentLevel + levelGain,
    xp: totalXp % 100,
  }
}

export async function saveScanResult(userId, scanData, points, xp) {
  // Menggunakan Transaction untuk memastikan semua data terupdate secara bersamaan
  return await prisma.$transaction(async (tx) => {
    // 1. Simpan record Scan
    const scan = await tx.scan.create({
      data: {
        userId,
        category: scanData.category,
        label: scanData.label,
        confidence: scanData.confidence,
        imageUrl: scanData.imageUrl,
        ecoPoints: points,
        xpReward: xp,
        isValid: true,
      },
    });

    // 2. Update poin dan XP User
    const currentUser = await tx.user.findUnique({ where: { id: userId } })
    const nextUserProgress = applyLevelProgress(currentUser.level, currentUser.xp, xp)
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        ecoPoints: { increment: points },
        level: nextUserProgress.level,
        xp: nextUserProgress.xp,
      },
    });

    // 3. Update XP Pet milik user (karena Pet otomatis terbuat saat register)
    const pet = await tx.pet.findUnique({ where: { userId } })
    if (pet) {
      const nextPetProgress = applyLevelProgress(pet.level, pet.xp, xp)
      await tx.pet.update({
        where: { id: pet.id },
        data: { level: nextPetProgress.level, xp: nextPetProgress.xp },
      });
    }

    // 4. Catat ke tabel Activity untuk fitur riwayat
    await tx.activity.create({
      data: {
        userId,
        scanId: scan.id,
        type: "SCAN", // Pastikan enum atau tipe di DB sesuai
        title: `Scan ${scan.label}`,
        meta: `+${points} EcoPoints, +${xp} XP`,
        detail: `Kategori: ${scan.category}, confidence ${scan.confidence}%`,
      },
    });

    return { scan, user: updatedUser };
  });
}
