import express from "express";
import cors from "cors";
import helmet from "helmet";
import activityRoutes from "./routes/activity.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import facilityRoutes from "./routes/facility.routes.js";
import petRoutes from "./routes/pet.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import regionRoutes from "./routes/region.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import scanRoutes from "./routes/scan.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import prisma from "./config/prisma.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import { customCss } from "./config/swaggerTheme.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/security.middleware.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const defaultAllowedOrigins = [
  "http://localhost:5173",
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

function isAllowedOrigin(origin) {
  const normalizedOrigin = normalizeOrigin(origin)
  if (allowedOrigins.includes(normalizedOrigin)) return true

  try {
    const { hostname, protocol } = new URL(normalizedOrigin)
    return protocol === "https:" && hostname.endsWith(".vercel.app") && hostname.startsWith("nodewaste-")
  } catch {
    return false
  }
}

const isApiDocsEnabled = process.env.API_DOCS_ENABLED === "true" || process.env.NODE_ENV !== "production";

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      callback(error);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "NodeWaste backend is healthy",
    data: {
      service: "backend",
    },
  });
});

app.get("/api/health/db", async (_request, response) => {
  try {
    await prisma.user.count();

    response.json({
      success: true,
      message: "Database connection is healthy",
      data: {
        database: "connected",
      },
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

if (isApiDocsEnabled) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "NodeWaste API Docs",
      customCss: customCss,
    }),
  );
}
app.use(errorMiddleware);

export default app;
