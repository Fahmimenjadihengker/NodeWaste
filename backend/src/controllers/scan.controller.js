import { processScan } from "../services/scan.service.js";
import { HttpError } from "../utils/http-error.js";

export async function createScan(request, response, next) {
  try {
    if (!request.file) {
      throw new HttpError(400, "Gambar sampah wajib diunggah");
    }

    // Mock AI Classifier Logic (Sesuai diskusi sebelumnya)
    const filename = request.file.originalname.toLowerCase();
    let mockResult = {
      category: "ANORGANIK",
      label: "Botol Plastik",
      confidence: 95,
    };

    if (filename.includes("food")) {
      mockResult = {
        category: "ORGANIK",
        label: "Sisa Makanan",
        confidence: 88,
      };
    } else if (filename.includes("battery")) {
      mockResult = { category: "B3", label: "Baterai Bekas", confidence: 92 };
    }

    const data = await processScan(request.user, request.file, mockResult);

    response.status(201).json({
      success: true,
      message: "Scan berhasil diproses dan poin telah ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}
