import { processScan } from "../services/scan.service.js";
import { HttpError } from "../utils/http-error.js";

export async function createScan(request, response, next) {
  try {
    if (!request.file) {
      throw new HttpError(400, "Gambar sampah wajib diunggah");
    }

    const data = await processScan(request.user, request.file);

    response.status(201).json({
      success: true,
      message: "Scan berhasil diproses dan poin telah ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}
