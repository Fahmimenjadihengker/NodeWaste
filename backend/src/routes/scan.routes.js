import express from "express";
import multer from "multer";
import { createScan } from "../controllers/scan.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Penyimpanan sementara

router.post("/", authMiddleware, upload.single("image"), createScan);

export default router;
