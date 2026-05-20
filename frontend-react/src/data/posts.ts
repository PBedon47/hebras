export type Post = {
  id: number;
  user: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
  replies: number;
  rt: number;
  avColor: string;
  image?: string;
};

export type Following = {
  id: number;
  name: string;
  categoria: string;
  followers: number;
  siguiendo: boolean;
  avColor: string;
  icon: string;
};

export const POSTS: Post[] = [
  {
    id: 1,
    user: "Ana Torres",
    handle: "@anators_v",
    time: "hace 2 horas",
    text:
      "¡Increíble experiencia hoy con @TechoPeru construyendo viviendas en SJM! Gracias a todos los voluntarios que se sumaron. 🏡🌱 #Voluntariado #Hebras",
    avColor: "#b146d1",
    likes: 46,
    replies: 12,
    rt: 5,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    user: "Carlos Mendoza",
    handle: "@carlos_m",
    time: "hace 5 horas",
    text:
      "¿Alguien más va al proyecto de Reforestación este fin de semana en Cusco? 🌳🌿",
    avColor: "#5d980d",
    likes: 13,
    replies: 8,
    rt: 2,
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    user: "Lucía Herrera",
    handle: "@luch",
    time: "hace 1 día",
    text:
      "Hoy compartimos alimentos con más de 100 familias ❤️ Gracias a todos los voluntarios.",
    avColor: "#ff9800",
    likes: 88,
    replies: 21,
    rt: 14,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
  },
];

export const FOLLOWING: Following[] = [
  {
    id: 1,
    name: "Techo Perú",
    categoria: "Social",
    followers: 12842,
    siguiendo: false,
    avColor: "#1e88e5",
    icon: "T",
  },

  {
    id: 2,
    name: "Recicla Perú",
    categoria: "Medio Ambiente",
    followers: 8376,
    siguiendo: false,
    avColor: "#14b800",
    icon: "♻",
  },

  {
    id: 3,
    name: "Manos Unidas",
    categoria: "Salud",
    followers: 5421,
    siguiendo: false,
    avColor: "#ff8800",
    icon: "♥",
  },

  {
    id: 4,
    name: "Educa Jóvenes",
    categoria: "Educación",
    followers: 7215,
    siguiendo: false,
    avColor: "#8b5cf6",
    icon: "📘",
  },

  {
    id: 5,
    name: "Patitas Felices",
    categoria: "Animales",
    followers: 4120,
    siguiendo: false,
    avColor: "#f4b400",
    icon: "🐾",
  },
];