// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  const hash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@hebras.pe" },
    update: {},
    create: {
      nombre: "Mateo Salazar",
      email:  "demo@hebras.pe",
      password: hash,
      ciudad: "Lima",
      puntos: 420,
      nivel:  "BROTE",
    },
  });
  console.log("✅ Usuario demo:", user.email);

  const techo = await prisma.ong.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre:   "Techo Perú",
      tipo:     "SOCIAL",
      loc:      "Lima, Perú",
      distrito: "San Juan de Miraflores",
      rating:   4.9,
      emoji:    "🏗️",
      imgKey:   "techo-peru",
      mision:   "Fomentar el desarrollo comunitario en asentamientos precarios.",
      webUrl:   "https://peru.techo.org/",
      whatsapp: "982231601",
    },
  });

  const caminando = await prisma.ong.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre:   "Caminando Juntos",
      tipo:     "EDUCACIÓN",
      loc:      "Cusco",
      distrito: "Cusco Centro",
      rating:   4.8,
      emoji:    "📖",
      imgKey:   "caminando-juntos",
      mision:   "Mejorar la comprensión lectora en zonas rurales del Cusco.",
      webUrl:   "https://caminando-juntos.joinnus.com/",
      whatsapp: "936666909",
    },
  });

  const banco = await prisma.ong.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nombre:   "Banco de Alimentos",
      tipo:     "SOCIAL",
      loc:      "Lima, Perú",
      distrito: "Miraflores",
      rating:   4.9,
      emoji:    "🥦",
      imgKey:   "banco-alimentos",
      mision:   "Aliviamos el hambre rescatando alimentos en buen estado.",
      webUrl:   "https://bancodealimentosperu.org/",
      whatsapp: "982231601",
    },
  });

  const manos = await prisma.ong.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nombre:   "Manos Unidas",
      tipo:     "DESARROLLO",
      loc:      "Arequipa",
      distrito: "Arequipa Centro",
      rating:   4.7,
      emoji:    "🤝",
      imgKey:   "manos-unidas",
      mision:   "Cultura, primeras infancias y desarrollo integral de comunidades vulnerables.",
      webUrl:   "https://www.facebook.com/ManosUnidasEnSolidaridadPeru",
      whatsapp: "936666909",
    },
  });

  console.log("✅ ONGs creadas");

  await prisma.campana.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 1, ongId: techo.id,
        nombre: "Construcción S.J.M",
        desc:   "Buscamos 20 voluntarios para la construcción de viviendas en San Juan de Miraflores.",
        fecha:  "15-16 de Junio 2026",
        fechaISO:    new Date("2026-06-15"),
        fechaISOFin: new Date("2026-06-16"),
        vacantes: 20, tipo: "Presencial",
        imgKey: "construccion-sjl",
        tasks: JSON.stringify(["Apoyo logístico", "Coordinación de grupos", "Reporte de impacto"]),
      },
      {
        id: 2, ongId: techo.id,
        nombre: "Taller de Lectura Kids",
        desc:   "Taller de lectura para niños de 6 a 10 años en Villa María del Triunfo.",
        fecha:  "Todos los Sábados desde 7 Jun 2026",
        fechaISO: new Date("2026-06-07"),
        vacantes: 10, tipo: "Híbrido",
        imgKey: "taller-lectura-kids",
        tasks: JSON.stringify(["Enseñanza de lectura", "Dinámicas grupales", "Seguimiento de avance"]),
      },
      {
        id: 3, ongId: caminando.id,
        nombre: "Aulas Rurales Cusco",
        desc:   "Apoyo educativo a niños en comunidades rurales del Cusco.",
        fecha:  "5 Julio - 30 Agosto 2026",
        fechaISO:    new Date("2026-07-05"),
        fechaISOFin: new Date("2026-08-30"),
        vacantes: 12, tipo: "Presencial",
        imgKey: "campaña-caminando",
        tasks: JSON.stringify(["Enseñanza", "Tutorías", "Elaboración de material"]),
      },
      {
        id: 4, ongId: banco.id,
        nombre: "Rescate Alimentario Junio",
        desc:   "Clasificación y distribución de alimentos rescatados en mercados de Lima.",
        fecha:  "21-22 Junio 2026",
        fechaISO:    new Date("2026-06-21"),
        fechaISOFin: new Date("2026-06-22"),
        vacantes: 20, tipo: "Presencial",
        imgKey: "campaña-alimentos",
        tasks: JSON.stringify(["Clasificar alimentos", "Empaquetar", "Distribución"]),
      },
      {
        id: 5, ongId: manos.id,
        nombre: "Arte en Comunidad",
        desc:   "Talleres de arte y cultura para niños de zonas vulnerables de Arequipa.",
        fecha:  "12 Agosto 2026",
        fechaISO: new Date("2026-08-12"),
        vacantes: 6, tipo: "Presencial",
        imgKey: "campaña-manos-unidas",
        tasks: JSON.stringify(["Talleres de arte", "Fotografía social", "Gestión cultural"]),
      },
    ],
  });

  console.log("✅ Campañas creadas");

  await prisma.campanaRealizada.createMany({
    skipDuplicates: true,
    data: [
      { userId: user.id, campanaId: 3, horas: 8, pts: 150, rating: 5 },
      { userId: user.id, campanaId: 2, horas: 6, pts: 120, rating: 4 },
    ],
  });

  console.log("✅ Historial creado");
  console.log("🎉 Seed completado!");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });