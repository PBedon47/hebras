export type Campania = {
  id: number;
  name: string;
  desc: string;
  fecha: string;          // texto visible
  fechaISO: string;       // "YYYY-MM-DD" para filtrar
  fechaISOFin?: string;   // si dura varios días
  vacantes: string;
  tipo: "Presencial" | "Híbrido" | "Virtual";
  tasks: string[];
  imgKey: string;
};

export type ONG = {
  id: number;
  name: string;
  tipo: string;
  loc: string;
  distrito: string;       // para filtrar por distrito
  rating: string;
  emoji: string;
  mision: string;
  campanas: Campania[];
  imgKey: string;
};

export const ONGS: ONG[] = [
  {
    id: 0,
    name: "Techo Perú",
    tipo: "SOCIAL",
    loc: "Lima, Perú",
    distrito: "San Juan de Miraflores",
    rating: "4.9",
    emoji: "🏗️",
    imgKey: "techo-peru",
    mision:
      "Fomentar el desarrollo comunitario en asentamientos precarios mediante la construcción de viviendas y proyectos de habilitación social.",
    campanas: [
      {
        id: 0,
        name: "Contrucción S.J.M",
        desc: "Buscamos 20 voluntarios para la construcción de viviendas de emergencia en San Juan de Miraflores.",
        fecha: "15-16 de Junio 2026",
        fechaISO: "2026-06-15",
        fechaISOFin: "2026-06-16",
        vacantes: "8 disponibles",
        tipo: "Presencial",
        imgKey: "campaña-construccion",
        tasks: ["Apoyo logístico", "Coordinación de grupos", "Reporte de impacto"],
      },
      {
        id: 1,
        name: "Taller de Lectura Kids",
        desc: "Taller de lectura para niños de 6 a 10 años en Villa María del Triunfo.",
        fecha: "Todos los Sábados desde 7 Jun 2026",
        fechaISO: "2026-06-07",
        vacantes: "1 cupo",
        tipo: "Híbrido",
        imgKey: "campaña-caminando",
        tasks: ["Enseñanza de lectura", "Dinámicas grupales", "Seguimiento de avance"],
      },
    ],
  },
  {
    id: 1,
    name: "Caminando Juntos",
    tipo: "EDUCACIÓN",
    loc: "Cusco",
    distrito: "Cusco Centro",
    rating: "4.8",
    emoji: "📖",
    imgKey: "caminando-juntos",
    mision:
      "Mejorar la comprensión lectora en zonas rurales del Cusco mediante programas educativos innovadores.",
    campanas: [
      {
        id: 0,
        name: "Aulas Rurales Cusco",
        desc: "Apoyo educativo a niños en comunidades rurales del Cusco.",
        fecha: "5 Julio - 30 Agosto 2026",
        fechaISO: "2026-07-05",
        fechaISOFin: "2026-08-30",
        vacantes: "12 disponibles",
        tipo: "Presencial",
        imgKey: "campaña-caminando",
        tasks: ["Enseñanza", "Tutorías", "Elaboración de material"],
      },
    ],
  },
  {
    id: 2,
    name: "Banco de Alimentos",
    tipo: "SOCIAL",
    loc: "Lima, Perú",
    distrito: "Miraflores",
    rating: "4.9",
    emoji: "🥦",
    imgKey: "banco-alimentos",
    mision:
      "Aliviamos el hambre rescatando alimentos en buen estado para distribuirlos a quienes más lo necesitan.",
    campanas: [
      {
        id: 0,
        name: "Rescate Alimentario Junio",
        desc: "Clasificación y distribución de alimentos rescatados en mercados de Lima.",
        fecha: "21-22 Junio 2026",
        fechaISO: "2026-06-21",
        fechaISOFin: "2026-06-22",
        vacantes: "20 disponibles",
        tipo: "Presencial",
        imgKey: "campaña-alimentos",
        tasks: ["Clasificar alimentos", "Empaquetar", "Distribución"],
      },
    ],
  },
  {
    id: 3,
    name: "Manos Unidas",
    tipo: "DESARROLLO",
    loc: "Arequipa",
    distrito: "Arequipa Centro",
    rating: "4.7",
    emoji: "🤝",
    imgKey: "manos-unidas",
    mision:
      "Cultura, primeras infancias y promoción del desarrollo integral de comunidades vulnerables.",
    campanas: [
      {
        id: 0,
        name: "Arte en Comunidad",
        desc: "Talleres de arte y cultura para niños de zonas vulnerables de Arequipa.",
        fecha: "12 Agosto 2026",
        fechaISO: "2026-08-12",
        vacantes: "6 disponibles",
        tipo: "Presencial",
        imgKey: "campaña-manos-unidas",
        tasks: ["Talleres de arte", "Fotografía social", "Gestión cultural"],
      },
    ],
  },
];