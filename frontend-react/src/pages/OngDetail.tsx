import { useParams, useNavigate } from "react-router-dom";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";

// ── Imágenes ONG (banner) ─────────────────────────────────
import techoPeru       from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos  from "../assets/banco-alimentos.png";
import manosUnidas     from "../assets/manos-unidas.png";

// ── Imágenes de CAMPAÑAS ──────────────────────────────────
// Techo Perú → construcción S.J.M usa construccion S.J.L.png
import construccionSJM  from "../assets/construccion-sjl.png";
// Taller de lectura → caminando juntos (voluntarios educación)
import tallerLectura    from "../assets/taller-lectura-kids.png";
// Banco de Alimentos → campaña alimentos
import campanaAlimentos from "../assets/campaña-alimentos.png";
// Manos Unidas → manos unidas
import campanaManosUnidas from "../assets/campaña-manos-unidas.png";
// Aulas Rurales Cusco → caminando juntos
import aulasRurales     from "../assets/campaña-caminando.png";

const ONG_IMGS: Record<string, string> = {
  "techo-peru":       techoPeru,
  "caminando-juntos": caminandoJuntos,
  "banco-alimentos":  bancoAlimentos,
  "manos-unidas":     manosUnidas,
};

// Mapa: "ongId-campanaId" → imagen
const CAMP_IMGS: Record<string, string> = {
  "0-0": construccionSJM,   // Techo Perú → Contrucción S.J.M
  "0-1": tallerLectura,     // Techo Perú → Taller Lectura Kids
  "1-0": aulasRurales,      // Caminando Juntos → Aulas Rurales
  "2-0": campanaAlimentos,  // Banco de Alimentos → Rescate Alimentario
  "3-0": campanaManosUnidas,// Manos Unidas → Arte en Comunidad
};

// ── Links reales ──────────────────────────────────────────
const ONG_WEB: Record<number, string> = {
  0: "https://peru.techo.org/",
  1: "https://caminando-juntos.joinnus.com/",
  2: "https://bancodealimentosperu.org/",
  3: "https://www.facebook.com/ManosUnidasEnSolidaridadPeru/?locale=es_LA",
};

const WA_NUMBERS = ["982231601", "936666909"];

function getWA(ongId: number) {
  return `https://wa.me/51${WA_NUMBERS[ongId % WA_NUMBERS.length]}?text=Hola,%20me%20interesa%20el%20voluntariado`;
}

export default function OngDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ong = ONGS[Number(id)];
  if (!ong) return null;

  return (
    <div>
      <Topbar showBack title={ong.name} showSearch={false} />

      {/* Banner */}
      <div style={{ position: "relative" }}>
        <img src={ONG_IMGS[ong.imgKey]} alt={ong.name}
          style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
          padding: "32px 32px 20px",
        }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 26 }}>{ong.name}</div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>

        {/* ── Columna izquierda ── */}
        <div>
          {/* Tags + rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ background: C.darkBtn, color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "4px 12px" }}>
              {ong.tipo}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted, fontWeight: 600 }}>
              <i className="ti ti-map-pin" style={{ fontSize: 14 }} />{ong.loc}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 800, color: C.greenDark, marginLeft: "auto" }}>
              <i className="ti ti-star-filled" style={{ fontSize: 14, color: "#f59e0b" }} />{ong.rating}
            </span>
          </div>

          {/* Botones con links reales */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <a
              href={ONG_WEB[ong.id]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 50,
                border: `1.5px solid ${C.darkBtn}`, background: C.white,
                color: C.darkBtn, fontWeight: 800, fontSize: 13,
                cursor: "pointer", textDecoration: "none",
              }}
            >
              <i className="ti ti-world" style={{ fontSize: 15 }} /> SITIO WEB
            </a>
            <a
              href={getWA(ong.id)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 50,
                border: "none", background: C.darkBtn,
                color: "#fff", fontWeight: 800, fontSize: 13,
                cursor: "pointer", textDecoration: "none",
              }}
            >
              <i className="ti ti-brand-whatsapp" style={{ fontSize: 15 }} /> MENSAJE DIRECTO
            </a>
          </div>

          {/* Misión */}
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800, marginBottom: 6 }}>Misión</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>{ong.mision}</div>

          {/* Convocatorias */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800 }}>
              Convocatorias Abiertas
            </div>
            <span style={{ fontSize: 11, color: C.greenDark, fontWeight: 800 }}>
              {ong.campanas.length} activa{ong.campanas.length > 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ong.campanas.map((c, ci) => (
              <div
                key={c.id}
                onClick={() => navigate(`/ong/${ong.id}/campania/${ci}`)}
                style={{
                  display: "flex", gap: 14, background: C.white,
                  borderRadius: 14, border: `1px solid ${C.border}`,
                  overflow: "hidden", cursor: "pointer",
                  transition: "border-color .15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.greenDark}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.border}
              >
                <img
                  src={CAMP_IMGS[`${ong.id}-${ci}`]}
                  alt={c.name}
                  style={{ width: 110, height: 90, objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ padding: "12px 14px 12px 0", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                    <span style={{ fontSize: 10, color: C.greenDark, background: "#eef7dc", borderRadius: 20, padding: "2px 8px", fontWeight: 800 }}>
                      {c.tipo}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, color: C.muted, alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-calendar" style={{ fontSize: 13 }} />
                      {c.fecha}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-user" style={{ fontSize: 13 }} />
                      {c.vacantes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Columna derecha: tarjeta info ── */}
        <div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, position: "sticky", top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Información</div>
            {[
              { icon: "ti-map-pin",  label: "Ubicación",          val: ong.loc },
              { icon: "ti-category", label: "Área",               val: ong.tipo },
              { icon: "ti-users",    label: "Voluntarios activos", val: "24" },
              { icon: "ti-star",     label: "Calificación",        val: `${ong.rating} / 5.0` },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0f7e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${row.icon}`} style={{ fontSize: 16, color: C.greenDark }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{row.label}</div>
                  <div style={{ fontWeight: 700 }}>{row.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}