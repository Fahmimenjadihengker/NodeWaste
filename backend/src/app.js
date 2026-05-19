import express from "express";
import cors from "cors";
import activityRoutes from "./routes/activity.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import facilityRoutes from "./routes/facility.routes.js";
import petRoutes from "./routes/pet.routes.js";
import profileRoutes from "./routes/profile.routes.js";
<<<<<<< HEAD
import scanRoutes from "./routes/scan.routes.js"; // Menambahkan import rute AI
=======
import regionRoutes from "./routes/region.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import scanRoutes from "./routes/scan.routes.js";
import driverRoutes from "./routes/driver.routes.js";
>>>>>>> refs/remotes/origin/main
import prisma from "./config/prisma.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173", // Sangat penting untuk beberapa versi browser/Vite
  "http://localhost:5000", // Mengizinkan Swagger UI untuk mengakses dirinya sendiri
  "https://nodewaste.vercel.app",
];

function normalizeOrigin(origin) {
  return origin.replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
}

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.CORS_ORIGIN || "").split(","),
]
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Mengizinkan pengiriman token/cookie antar port
  }),
);
app.use(express.json());

// --- HEALTH CHECKS ---
app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "NodeWaste backend is healthy",
    data: { service: "backend" },
  });
});

app.get("/api/health/db", async (_request, response) => {
  try {
    await prisma.user.count();
    response.json({
      success: true,
      message: "Database connection is healthy",
      data: { database: "connected" },
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    response.status(500).json({
      success: false,
      message: "Database connection failed",
      data: {
        database: "disconnected",
        error: error.code || error.name || "UNKNOWN_ERROR",
      },
    });
  }
});

<<<<<<< HEAD
// --- SWAGGER UI ---
=======
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/recycling-facilities", facilityRoutes);

// Dokumentasi Swagger UI
>>>>>>> refs/remotes/origin/main
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "NodeWaste API Docs",
  }),
);
<<<<<<< HEAD

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/recycling-facilities", facilityRoutes);
app.use("/api/scans", scanRoutes); // Mendaftarkan rute klasifikasi AI

// --- ERROR HANDLING ---
// Aturan Express: Error Middleware WAJIB berada di urutan paling bawah
=======
>>>>>>> refs/remotes/origin/main
app.use(errorMiddleware);

export default app;
