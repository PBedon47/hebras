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

export type Story = {
  id: number;
  user: string;
  image: string;
  color: string;
};

export const STORIES: Story[] = [
  {
    id: 1,
    user: "Techo Perú",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    color: "#0094ff",
  },
  {
    id: 2,
    user: "Recicla Perú",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    color: "#14a800",
  },
  {
    id: 3,
    user: "Manos Unidas",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    color: "#ff7a00",
  },
];

export const POSTS: Post[] = [
  {
    id: 1,
    user: "Ana Torres",
    handle: "@ana",
    time: "hace 2h",
    text: "Hoy ayudamos a familias en SJM ❤️ @TechoPeru",
    likes: 46,
    replies: 12,
    rt: 5,
    avColor: "#7c3aed",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 2,
    user: "Carlos Mendoza",
    handle: "@carlos",
    time: "hace 5h",
    text: "Reforestación en Cusco 🌱",
    likes: 13,
    replies: 8,
    rt: 2,
    avColor: "#16a34a",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
  },
  {
    id: 3,
    user: "Lucía Herrera",
    handle: "@lucia",
    time: "1d",
    text: "Entrega de alimentos ❤️",
    likes: 88,
    replies: 21,
    rt: 14,
    avColor: "#f97316",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
  },
];