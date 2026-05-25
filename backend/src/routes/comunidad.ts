// src/routes/comunidad.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

// ─── POSTS ────────────────────────────────────────────────

router.get("/posts", async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { id: true, nombre: true } },
      _count: { select: { likes: true, comments: true } },
      comments: {
        take: 3,
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, nombre: true } } },
      },
    },
  });
  return res.json(posts);
});

const postSchema = z.object({
  texto:  z.string().min(1).max(500),
  imagen: z.string().url().optional(),
});

router.post("/posts", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const post = await prisma.post.create({
    data: { userId: req.userId!, ...parsed.data },
    include: {
      user: { select: { id: true, nombre: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  return res.status(201).json(post);
});

// ─── LIKES ────────────────────────────────────────────────

router.post("/posts/:id/like", requireAuth, async (req: AuthRequest, res: Response) => {
  const postId = parseInt(String(req.params.id));
  if (isNaN(postId)) return res.status(400).json({ error: "ID inválido" });

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: req.userId!, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  }

  await prisma.like.create({ data: { userId: req.userId!, postId } });
  return res.json({ liked: true });
});

// ─── COMENTARIOS ──────────────────────────────────────────

router.post("/posts/:id/comments", requireAuth, async (req: AuthRequest, res: Response) => {
  const postId = parseInt(String(req.params.id));
  if (isNaN(postId)) return res.status(400).json({ error: "ID inválido" });

  const texto = str(req.body.texto);
  if (!texto) return res.status(400).json({ error: "El comentario no puede estar vacío" });

  const comment = await prisma.comment.create({
    data: { userId: req.userId!, postId, texto },
    include: { user: { select: { id: true, nombre: true } } },
  });
  return res.status(201).json(comment);
});

// ─── FOLLOWS ──────────────────────────────────────────────

router.get("/ongs", requireAuth, async (req: AuthRequest, res: Response) => {
  const ongs = await prisma.ong.findMany({
    include: {
      _count:  { select: { follows: true } },
      follows: { where: { userId: req.userId } },
    },
  });

  const result = ongs.map((o) => ({
    id:         o.id,
    nombre:     o.nombre,
    tipo:       o.tipo,
    loc:        o.loc,
    imgKey:     o.imgKey,
    siguiendo:  o.follows.length > 0,
    seguidores: o._count.follows,
  }));

  return res.json(result);
});

router.post("/ongs/:id/follow", requireAuth, async (req: AuthRequest, res: Response) => {
  const ongId = parseInt(String(req.params.id));
  if (isNaN(ongId)) return res.status(400).json({ error: "ID inválido" });

  const existing = await prisma.follow.findUnique({
    where: { userId_ongId: { userId: req.userId!, ongId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return res.json({ siguiendo: false });
  }

  await prisma.follow.create({ data: { userId: req.userId!, ongId } });
  return res.json({ siguiendo: true });
});

export default router;