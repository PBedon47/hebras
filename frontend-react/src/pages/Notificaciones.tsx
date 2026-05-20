import Topbar from "../components/Topbar";
import { C } from "../utils/colors";
import { Bell } from "lucide-react";

const notificaciones = [
  {
    id: 1,
    titulo: "Nueva campaña disponible",
    mensaje: "TECHO Perú publicó una nueva oportunidad de voluntariado.",
    hora: "Hace 2 horas",
  },
  {
    id: 2,
    titulo: "Inscripción confirmada",
    mensaje: "Tu participación fue confirmada exitosamente.",
    hora: "Ayer",
  },
];

export default function Notificaciones() {
  return (
    <div>
      <Topbar
  title="Notificaciones"
  showBack
  showSearch={false}
/>

      <div
        style={{
          padding: "28px 32px",
        }}
      >
        {notificaciones.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80,
              color: C.muted,
            }}
          >
            <Bell size={60} />

            <h2
              style={{
                marginTop: 16,
                fontSize: 20,
              }}
            >
              Sin notificaciones
            </h2>

            <p>No tienes mensajes nuevos.</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {notificaciones.map((n) => (
              <div
                key={n.id}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      color: C.greenDark,
                    }}
                  >
                    {n.titulo}
                  </h3>

                  <span
                    style={{
                      fontSize: 12,
                      color: C.muted,
                    }}
                  >
                    {n.hora}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: C.text,
                    fontSize: 14,
                  }}
                >
                  {n.mensaje}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}