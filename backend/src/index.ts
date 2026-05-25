// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import ongsRoutes from "./routes/ongs";
import postulacionesRoutes from "./routes/postulaciones";
import comunidadRoutes from "./routes/comunidad";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Seguridad ──────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Rate limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intenta de nuevo en 15 minutos" },
});
app.use(limiter);

// Rate limit más estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de inicio de sesión, intenta en 15 minutos" },
});

// ── Body parser ────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "HEBRAS API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Rutas ──────────────────────────────────────────────────
app.use("/auth", authLimiter, authRoutes);
app.use("/users", usersRoutes);
app.use("/ongs", ongsRoutes);
app.use("/postulaciones", postulacionesRoutes);
app.use("/comunidad", comunidadRoutes);

// ── 404 handler ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ── Error handler global ──────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ── Iniciar servidor ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 HEBRAS API corriendo en http://localhost:${PORT}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV || "development"}`);
});

export default app;