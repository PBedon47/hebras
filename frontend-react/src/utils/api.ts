// src/utils/api.ts
// Cliente HTTP para comunicarse con el backend HEBRAS

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Token helpers ──────────────────────────────────────────
export const token = {
  get: () => localStorage.getItem("hebras_token"),
  set: (t: string) => localStorage.setItem("hebras_token", t),
  remove: () => localStorage.removeItem("hebras_token"),
};

// ── Fetch base con auth ────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const t = token.get();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error del servidor");
  }

  return data as T;
}

// ─── AUTH ──────────────────────────────────────────────────
export const authApi = {
  register: (body: {
    nombre: string;
    email: string;
    password: string;
    ciudad?: string;
  }) =>
    apiFetch<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── USERS ────────────────────────────────────────────────
export const usersApi = {
  me: () => apiFetch<UserFull>("/users/me"),

  update: (body: { nombre?: string; ciudad?: string }) =>
    apiFetch<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// ─── ONGs ─────────────────────────────────────────────────
export const ongsApi = {
  list: (params?: {
    search?: string;
    tipo?: string;
    rating?: string;
    distrito?: string;
    fecha?: string;
  }) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v)) as Record<string, string>
    ).toString();
    return apiFetch<OngWithCampanas[]>(`/ongs${q ? `?${q}` : ""}`);
  },

  get: (id: number) => apiFetch<OngWithCampanas>(`/ongs/${id}`),
};

// ─── POSTULACIONES ────────────────────────────────────────
export const postulacionesApi = {
  list: () => apiFetch<Postulacion[]>("/postulaciones"),

  create: (campanaId: number) =>
    apiFetch<Postulacion>("/postulaciones", {
      method: "POST",
      body: JSON.stringify({ campanaId }),
    }),
};

// ─── COMUNIDAD ────────────────────────────────────────────
export const comunidadApi = {
  posts: () => apiFetch<PostFull[]>("/comunidad/posts"),

  createPost: (body: { texto: string; imagen?: string }) =>
    apiFetch<PostFull>("/comunidad/posts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  toggleLike: (postId: number) =>
    apiFetch<{ liked: boolean }>(`/comunidad/posts/${postId}/like`, {
      method: "POST",
    }),

  comment: (postId: number, texto: string) =>
    apiFetch<Comment>(`/comunidad/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ texto }),
    }),

  ongs: () => apiFetch<OngComunidad[]>("/comunidad/ongs"),

  toggleFollow: (ongId: number) =>
    apiFetch<{ siguiendo: boolean }>(`/comunidad/ongs/${ongId}/follow`, {
      method: "POST",
    }),
};

// ─── TIPOS ────────────────────────────────────────────────
export interface User {
  id: number;
  nombre: string;
  email: string;
  ciudad?: string;
  puntos: number;
  nivel: string;
}

export interface UserFull extends User {
  postulaciones: Postulacion[];
  campanasRealizadas: CampanaRealizada[];
}

export interface Campana {
  id: number;
  ongId: number;
  nombre: string;
  desc: string;
  fecha: string;
  fechaISO: string;
  fechaISOFin?: string;
  vacantes: number;
  vacantesOcupadas: number;
  tipo: string;
  imgKey: string;
  tasks: string; // JSON string
}

export interface OngWithCampanas {
  id: number;
  nombre: string;
  tipo: string;
  loc: string;
  distrito: string;
  rating: string;
  emoji: string;
  imgKey: string;
  mision: string;
  webUrl?: string;
  whatsapp?: string;
  campanas: Campana[];
  _count: { follows: number };
}

export interface OngComunidad {
  id: number;
  nombre: string;
  tipo: string;
  imgKey: string;
  siguiendo: boolean;
  seguidores: number;
}

export interface Postulacion {
  id: number;
  userId: number;
  campanaId: number;
  estado: "pendiente" | "aprobada" | "rechazada";
  pts: number;
  createdAt: string;
  campana: Campana & { ong: { nombre: string } };
}

export interface CampanaRealizada {
  id: number;
  horas: number;
  pts: number;
  rating: number;
  fecha: string;
  campana: Campana & { ong: { nombre: string } };
}

export interface PostFull {
  id: number;
  texto: string;
  imagen?: string;
  createdAt: string;
  user: { id: number; nombre: string };
  _count: { likes: number; comments: number };
  comments: Array<{
    id: number;
    texto: string;
    user: { id: number; nombre: string };
  }>;
}

export interface Comment {
  id: number;
  texto: string;
  postId: number;
  user: { id: number; nombre: string };
}