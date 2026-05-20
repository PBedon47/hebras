export type FAQ = { q: string; a: string };

export const FAQS: FAQ[] = [
  {
    q: "¿Cómo sé si una ONG es confiable?",
    a: "En HEBRAS, la confianza es nuestro hilo principal. Todas las organizaciones pasan por un proceso de verificación riguroso donde evaluamos su impacto social real, transparencia financiera y calidad de gestión. Si ves el sello de 'ONG Verificada' (check azul) en su perfil, significa que cumplen con nuestros estándares de seguridad y ética.",
  },
  {
    q: "¿El voluntariado sirve para prácticas?",
    a: "¡Depende de tu universidad, pero te ayudamos! Al finalizar tu programa, la mayoría de nuestras ONGs aliadas emiten un Certificado de Participación digital que puedes descargar desde tu perfil en HEBRAS. Te recomendamos validar con tu facultad si aceptan voluntariados externos.",
  },
  {
    q: "No tengo experiencia previa, ¿puedo postular?",
    a: "¡Claro que sí! Cada 'hebra' es valiosa. Muchos programas están diseñados precisamente para estudiantes que buscan su primera experiencia. En los filtros de búsqueda, selecciona 'Sin experiencia previa'. Lo más importante es tu compromiso y ganas de aprender.",
  },
  {
    q: "¿Tengo que pagar algo por usar la app?",
    a: "No. El acceso a la plataforma HEBRAS y la postulación a los programas de voluntariado es totalmente gratuito para los estudiantes. En algunos casos excepcionales (voluntariados de viaje a selva o sierra), la ONG podría mencionar gastos de traslado, pero esto siempre estará detallado antes de que postules.",
  },
  {
    q: "¿Qué pasa si la ONG no me responde?",
    a: "Entendemos que tu tiempo es valioso. Si después de 48 horas hábiles no has recibido noticias, el chatbot te notificará y podrás: contactar directamente por WhatsApp Business, solicitar que el equipo de soporte envíe un recordatorio prioritario, o recibir 3 oportunidades similares con respuesta inmediata.",
  },
  {
    q: "¿Cómo restablezco mi contraseña?",
    a: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Te enviaremos un enlace de recuperación a tu correo electrónico registrado.",
  },
  {
    q: "¿Cómo encuentro un voluntariado cerca de mí?",
    a: "La aplicación utiliza filtros de ubicación y disponibilidad horaria para mostrarte las opciones que mejor se adapten a tu rutina diaria.",
  },
  {
    q: "¿Qué necesito para postular?",
    a: "Cada perfil de ONG detalla los requisitos específicos para sus voluntarios; puedes revisarlos directamente en la información puntual de cada organización dentro de la app.",
  },
];

export function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("confiable") || lower.includes("verificada")) return FAQS[0].a;
  if (lower.includes("práctica") || lower.includes("certificado") || lower.includes("horas")) return FAQS[1].a;
  if (lower.includes("experiencia") || lower.includes("primera")) return FAQS[2].a;
  if (lower.includes("gratis") || lower.includes("pagar") || lower.includes("costo")) return FAQS[3].a;
  if (lower.includes("responde") || lower.includes("no contesta")) return FAQS[4].a;
  if (lower.includes("contraseña") || lower.includes("restablecer")) return FAQS[5].a;
  if (lower.includes("cerca") || lower.includes("ubicación")) return FAQS[6].a;
  if (lower.includes("postular") || lower.includes("requisito")) return FAQS[7].a;
  return "Para más información puedes revisar el perfil de cada ONG o contactar a nuestro equipo de soporte desde la app. 😊";
}