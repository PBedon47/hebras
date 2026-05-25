// src/routes/ongs.ts
import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

router.get("/", async (req: Request, res: Response) => {
  const search   = str(req.query.search);
  const tipo     = str(req.query.tipo);
  const rating   = str(req.query.rating);
  const distrito = str(req.query.distrito);
  const fecha    = str(req.query.fecha);

  const where: any = {};

  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { tipo:   { contains: search } },
    ];
  }

  if (tipo) where.tipo = tipo;

  if (rating) where.rating = { gte: parseFloat(rating) };

  if (distrito) {
    where.OR = [
      ...(where.OR ?? []),
      { distrito: { contains: distrito } },
      { loc:      { contains: distrito } },
    ];
  }

  if (fecha) {
    const fechaDate = new Date(fecha);
    where.campanas = {
      some: {
        activa: true,
        fechaISO: { lte: fechaDate },
        OR: [
          { fechaISOFin: null },
          { fechaISOFin: { gte: fechaDate } },
        ],
      },
    };
  }

  const ongs = await prisma.ong.findMany({
    where,
    include: {
      campanas: {
        where: { activa: true },
        select: {
          id: true, nombre: true, fecha: true, fechaISO: true,
          fechaISOFin: true, vacantes: true, vacantesOcupadas: true,
          tipo: true, imgKey: true,
        },
      },
      _count: { select: { follows: true } },
    },
    orderBy: { rating: "desc" },
  });

  return res.json(ongs);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const ong = await prisma.ong.findUnique({
    where: { id },
    include: {
      campanas: {
        where: { activa: true },
        orderBy: { fechaISO: "asc" },
      },
      _count: { select: { follows: true } },
    },
  });

  if (!ong) return res.status(404).json({ error: "ONG no encontrada" });

  return res.json(ong);
});

export default router;