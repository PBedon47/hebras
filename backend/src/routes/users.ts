// src/routes/users.ts
import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

function calcNivel(puntos: number): string {
  if (puntos >= 1200) return "RESERVA";
  if (puntos >= 800)  return "ROBLE";
  if (puntos >= 500)  return "ÁRBOL";
  if (puntos >= 200)  return "BROTE";
  return "SEMILLA";
}

// GET /users/me
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, nombre: true, email: true,
      ciudad: true, puntos: true, nivel: true, createdAt: true,
      postulaciones: {
        include: {
          campana: { include: { ong: { select: { nombre: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
      campanasRealizadas: {
        include: {
          campana: { include: { ong: { select: { nombre: true } } } },
        },
        orderBy: { fecha: "desc" },
      },
    },
  });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  return res.json(user);
});

// PATCH /users/me
const updateSchema = z.object({
  nombre: z.string().min(2).optional(),
  ciudad: z.string().optional(),
});

router.patch("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: parsed.data,
    select: {
      id: true, nombre: true, email: true,
      ciudad: true, puntos: true, nivel: true,
    },
  });
  return res.json(user);
});

// POST /users/me/puntos
router.post("/me/puntos", requireAuth, async (req: AuthRequest, res: Response) => {
  const puntos = parseInt(String(req.body.puntos));
  if (isNaN(puntos) || puntos < 0) {
    return res.status(400).json({ error: "Puntos inválidos" });
  }

  const current = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { puntos: true },
  });
  if (!current) return res.status(404).json({ error: "Usuario no encontrado" });

  const newPuntos = current.puntos + puntos;
  const newNivel  = calcNivel(newPuntos);

  const updated = await prisma.user.update({
    where: { id: req.userId },
    data: { puntos: newPuntos, nivel: newNivel },
    select: { puntos: true, nivel: true },
  });
  return res.json(updated);
});

export default router;