// src/routes/postulaciones.ts
import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

// GET /postulaciones — mis postulaciones
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const postulaciones = await prisma.postulacion.findMany({
    where: { userId: req.userId },
    include: {
      campana: {
        include: { ong: { select: { nombre: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(postulaciones);
});

// POST /postulaciones — postular a una campaña
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const campanaId = parseInt(String(req.body.campanaId));
  if (isNaN(campanaId)) return res.status(400).json({ error: "campanaId inválido" });

  const campana = await prisma.campana.findUnique({ where: { id: campanaId } });
  if (!campana)        return res.status(404).json({ error: "Campaña no encontrada" });
  if (!campana.activa) return res.status(400).json({ error: "Esta campaña ya no está activa" });

  const cuposLibres = campana.vacantes - campana.vacantesOcupadas;
  if (cuposLibres <= 0) return res.status(400).json({ error: "No hay cupos disponibles" });

  const existing = await prisma.postulacion.findUnique({
    where: { userId_campanaId: { userId: req.userId!, campanaId } },
  });
  if (existing) return res.status(409).json({ error: "Ya postulaste a esta campaña" });

  const postulacion = await prisma.postulacion.create({
    data: { userId: req.userId!, campanaId, estado: "pendiente" },
    include: {
      campana: { include: { ong: { select: { nombre: true } } } },
    },
  });
  return res.status(201).json(postulacion);
});

// PATCH /postulaciones/:id/estado — aprobar o rechazar
router.patch("/:id/estado", requireAuth, async (req: AuthRequest, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const { estado } = req.body as { estado: "aprobada" | "rechazada" };
  if (!["aprobada", "rechazada"].includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  const postulacion = await prisma.postulacion.update({
    where: { id },
    data: { estado },
  });

  if (estado === "aprobada") {
    await prisma.user.update({
      where: { id: postulacion.userId },
      data: { puntos: { increment: 50 } },
    });
  }

  return res.json(postulacion);
});

export default router;