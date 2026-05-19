import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { processScan } from "../services/scan.service.js";
import { HttpError } from "../utils/http-error.js";

// Fungsi untuk memetakan spesifik AI class ke kategori sistem Gamifikasi
function mapClassToCategory(predictedClass) {
  const classStr = predictedClass.toLowerCase();

  const b3Classes = ["baterai", "kabel"];
  const organikClasses = ["biologis", "limbah makanan"];

  if (b3Classes.includes(classStr)) return "B3";
  if (organikClasses.includes(classStr)) return "ORGANIK";

  // Sisanya (botol kaca, kardus, kertas, plastik, dll) masuk ke Anorganik
  return "ANORGANIK";
}

export async function createScan(request, response, next) {
  try {
    if (!request.file) {
      throw new HttpError(400, "Gambar sampah wajib diunggah");
    }

    // 1. Siapkan file gambar ke dalam bentuk Form Data
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(request.file.path),
      request.file.originalname,
    );

    // 2. Tembak ke API AI secara dinamis (menggunakan env variable)
    let aiResponse;
    try {
      const aiServiceUrl =
        process.env.AI_SERVICE_URL || "http://localhost:8000";
      aiResponse = await axios.post(`${aiServiceUrl}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } catch (error) {
      throw new HttpError(
        500,
        "Gagal terhubung ke service AI. Pastikan server ML berjalan.",
      );
    // Mock AI Classifier Logic (Sesuai diskusi sebelumnya)
    const filename = request.file.originalname.toLowerCase();
    let mockResult = {
      category: "Anorganik",
      label: "Botol Plastik",
      confidence: 95,
    };

    if (filename.includes("food")) {
      mockResult = {
        category: "Organik",
        label: "Sisa Makanan",
        confidence: 88,
      };
    } else if (filename.includes("battery")) {
      mockResult = { category: "B3", label: "Baterai Bekas", confidence: 92 };
    }

    const aiData = aiResponse.data;

    if (aiData.status !== "success") {
      throw new HttpError(500, "Service AI gagal memproses gambar");
    }

    // 3. Mapping hasil prediksi ke format bisnis NodeWaste
    const category = mapClassToCategory(aiData.predicted_class);
    // AI mereturn float (contoh: 0.95), kita konversi ke integer persentase (95)
    const confidenceScore = Math.round(aiData.confidence * 100);

    const scanResultPayload = {
      category: category,
      label: aiData.predicted_class,
      confidence: confidenceScore,
    };

    // 4. Masukkan ke Service untuk dihitung poinnya dan disimpan ke DB Prisma
    const data = await processScan(
      request.user,
      request.file,
      scanResultPayload,
    );

    // 5. Cleanup: Hapus file temp dari server Node.js agar disk tidak penuh
    fs.unlinkSync(request.file.path);

    // 6. Kirim respons ke Front-End, termasuk tips daur ulang dari Gemini!
    response.status(201).json({
      success: true,
      message: "Scan berhasil diproses",
      data: {
        ...data,
        ai_recommendation: aiData.recommendation, // Disisipkan langsung untuk UI
      },
    });
  } catch (error) {
    // Jika terjadi error di tengah jalan, pastikan file temp tetap dibersihkan
    if (request.file && fs.existsSync(request.file.path)) {
      fs.unlinkSync(request.file.path);
    }
    next(error);
  }
}
