import { useParams, useNavigate } from "react-router-dom";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";

// Imágenes campañas — nombres EXACTOS de tu carpeta assets
import imgConstruccion  from "../assets/construccion-sjl.png";
import imgTaller        from "../assets/taller-lectura-kids.png";
import imgBancoAli      from "../assets/campaña-alimentos.png";
import imgManosUnidas   from "../assets/campaña-manos-unidas.png";
import imgCaminando     from "../assets/campaña-caminando.png";

// Imágenes banner ONGs (fallback)
import techoPeru       from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos  from "../assets/banco-alimentos.png";
import manosUnidas     from "../assets/manos-unidas.png";

const ONG_IMGS: Record<string, string> = {
  "techo-peru":       techoPeru,
  "caminando-juntos": caminandoJuntos,
  "banco-alimentos":  bancoAlimentos,
  "manos-unidas":     manosUnidas,
};

const CAMP_IMGS: Record<string, string> = {
  "0-0": imgConstruccion,
  "0-1": imgTaller,
  "1-0": imgCaminando,
  "2-0": imgBancoAli,
  "3-0": imgManosUnidas,
};

export default function Campania() {
  const { id, cid } = useParams();
  const navigate    = useNavigate();
  const ong  = ONGS[Number(id)];
  const camp = ong?.campanas[Number(cid)];
  if (!ong || !camp) return null;

  const campKey  = `${id}-${cid}`;
  const campImg  = CAMP_IMGS[campKey] || ONG_IMGS[ong.imgKey];

  return (
    <div>
      <Topbar showBack title={camp.name} showSearch={false} />

      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>

        {/* ── Columna izquierda ── */}
        <div>
          {/* Badge convocatoria */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: C.green, color: C.darkBtn,
              fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "6px 16px",
            }}>
              <i className="ti ti-circle-check" style={{ fontSize: 14 }} aria-hidden="true" />
              CONVOCATORIA ABIERTA
            </div>
          </div>

          {/* Imagen de campaña */}
          <img
            src={campImg}
            alt={camp.name}
            style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 16, marginBottom: 20, display: "block" }}
            onError={e => { (e.currentTarget as HTMLImageElement).src = ONG_IMGS[ong.imgKey]; }}
          />

          {/* Descripción */}
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            {camp.desc}
          </div>

          {/* Tareas */}
          <div style={{ background: "#f8faf0", border: `1px dashed ${C.green}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: C.greenDark, marginBottom: 12 }}>
              Lo que harás:
            </div>
            {camp.tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8, color: C.text }}>
                <i className="ti ti-circle-check" style={{ fontSize: 15, color: C.green, flexShrink: 0 }} aria-hidden="true" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Columna derecha: tarjeta sticky ── */}
        <div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, position: "sticky", top: 80 }}>

            {/* Nombre ONG */}
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: C.text }}>
              {ong.name}
            </div>

            {/* Info filas */}
            {[
              { icon: "ti-calendar", label: "Fecha",     val: camp.fecha },
              { icon: "ti-user",     label: "Vacantes",  val: camp.vacantes },
              { icon: "ti-map-pin",  label: "Modalidad", val: camp.tipo },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 13 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f0f7e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${row.icon}`} style={{ fontSize: 17, color: C.greenDark }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{row.label}</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{row.val}</div>
                </div>
              </div>
            ))}

            {/* Calificación con estrella */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, fontSize: 13 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f0f7e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-star-filled" style={{ fontSize: 17, color: "#f59e0b" }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Calificación ONG</div>
                <div style={{ fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="ti ti-star-filled" style={{ fontSize: 14, color: "#f59e0b" }} aria-hidden="true" />
                  {ong.rating} / 5.0
                </div>
              </div>
            </div>

            {/* Botón postular */}
            <button
                onClick={() => navigate("/home")}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  border: "none",
                  borderRadius: 50,
                  background: C.green,
                  color: C.darkBtn,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <i
                  className="ti ti-send"
                  style={{ fontSize: 16 }}
                  aria-hidden="true"
                />
                POSTULAR A ESTA CAMPAÑA
              </button>
          </div>
        </div>

      </div>
    </div>
  );
}