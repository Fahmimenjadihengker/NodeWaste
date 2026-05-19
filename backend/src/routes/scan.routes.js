import express from "express";
import multer from "multer";
import { createScan } from "../controllers/scan.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_request, file, callback) {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      const error = new Error("Format gambar tidak didukung");
      error.statusCode = 415;
      callback(error);
      return;
    }

    callback(null, true);
  },
});

router.post("/", authMiddleware, requireRole("USER"), upload.single("image"), createScan);

export default router;
