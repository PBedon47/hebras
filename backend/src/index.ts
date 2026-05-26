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

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hebras-psi.vercel.app",
      process.env.FRONTEND_URL || "",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intenta de nuevo en 15 minutos" },
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de inicio de sesión, intenta en 15 minutos" },
});

app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "HEBRAS API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/users", usersRoutes);
app.use("/ongs", ongsRoutes);
app.use("/postulaciones", postulacionesRoutes);
app.use("/comunidad", comunidadRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`🚀 HEBRAS API corriendo en http://localhost:${PORT}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV || "development"}`);
});

export default app;