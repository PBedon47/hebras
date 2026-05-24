import { useParams, useNavigate } from "react-router-dom";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";

// ── Banners ONG ───────────────────────────────────────────
import techoPeru       from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos  from "../assets/banco-alimentos.png";
import manosUnidas     from "../assets/manos-unidas.png";

// ── Imágenes campañas: nombres EXACTOS de assets ──────────
import imgConstruccion  from "../assets/construccion-sjl.png";
import imgTaller        from "../assets/taller-lectura-kids.png";
import imgBancoAli      from "../assets/campaña-alimentos.png";
import imgManosUnidas   from "../assets/campaña-manos-unidas.png";
import imgCaminando     from "../assets/campaña-caminando.png";

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

const ONG_WEB: Record<number, string> = {
  0: "https://peru.techo.org/",
  1: "https://caminando-juntos.joinnus.com/",
  2: "https://bancodealimentosperu.org/",
  3: "https://www.facebook.com/ManosUnidasEnSolidaridadPeru/?locale=es_LA",
};

const WA_NUMBERS = ["982231601", "936666909"];
function getWA(id: number) {
  return `https://wa.me/51${WA_NUMBERS[id % WA_NUMBERS.length]}?text=Hola,%20me%20interesa%20el%20voluntariado`;
}

/* ── Badge azul verificado ─────────────────────────────── */
function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <path d="M11 1.5C11.7 1.5 12.35 2.1 12.9 2.5C13.45 2.9 14.1 3.1 14.75 2.95C15.4 2.8 16.1 3.05 16.55 3.5C17 3.95 17.25 4.65 17.1 5.3C16.95 5.95 17.15 6.6 17.55 7.15C17.95 7.7 18.55 8.35 18.55 11C18.55 13.65 17.95 14.3 17.55 14.85C17.15 15.4 16.95 16.05 17.1 16.7C17.25 17.35 17 18.05 16.55 18.5C16.1 18.95 15.4 19.2 14.75 19.05C14.1 18.9 13.45 19.1 12.9 19.5C12.35 19.9 11.7 20.5 11 20.5C10.3 20.5 9.65 19.9 9.1 19.5C8.55 19.1 7.9 18.9 7.25 19.05C6.6 19.2 5.9 18.95 5.45 18.5C5 18.05 4.75 17.35 4.9 16.7C5.05 16.05 4.85 15.4 4.45 14.85C4.05 14.3 3.45 13.65 3.45 11C3.45 8.35 4.05 7.7 4.45 7.15C4.85 6.6 5.05 5.95 4.9 5.3C4.75 4.65 5 3.95 5.45 3.5C5.9 3.05 6.6 2.8 7.25 2.95C7.9 3.1 8.55 2.9 9.1 2.5C9.65 2.1 10.3 1.5 11 1.5Z" fill="#1d9bf0"/>
      <path d="M7.5 11.5L9.8 13.8L14.5 8.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ── Fila de info con icono ─────────────────────────────── */
function InfoRow({ icon, label, val, iconColor }: {
  icon: string; label: string; val: React.ReactNode; iconColor?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: "#eef7dc",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`ti ${icon}`} style={{ fontSize: 18, color: iconColor || C.greenDark }} aria-hidden="true" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 1 }}>{val}</div>
      </div>
    </div>
  );
}

export default function OngDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const ong      = ONGS[Number(id)];
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
          background: "linear-gradient(transparent, rgba(0,0,0,0.62))",
          padding: "32px 32px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 26 }}>{ong.name}</div>
            <VerifiedBadge size={24} />
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>

        {/* ── Columna izquierda ── */}
        <div>
          {/* Tipo + ubicación + rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ background: C.darkBtn, color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "4px 12px" }}>
              {ong.tipo}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted, fontWeight: 600 }}>
              <i className="ti ti-map-pin" style={{ fontSize: 14 }} aria-hidden="true" />{ong.loc}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: C.greenDark, marginLeft: "auto" }}>
              <i className="ti ti-star-filled" style={{ fontSize: 15, color: "#f59e0b" }} aria-hidden="true" />{ong.rating}
            </span>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <a href={ONG_WEB[ong.id]} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, border: `1.5px solid ${C.darkBtn}`, background: C.white, color: C.darkBtn, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
              <i className="ti ti-world" style={{ fontSize: 15 }} aria-hidden="true" /> SITIO WEB
            </a>
            <a href={getWA(ong.id)} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, border: "none", background: C.darkBtn, color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
              <i className="ti ti-brand-whatsapp" style={{ fontSize: 15 }} aria-hidden="true" /> MENSAJE DIRECTO
            </a>
          </div>

          {/* Misión */}
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800, marginBottom: 6 }}>Misión</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>{ong.mision}</div>

          {/* Convocatorias */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800 }}>Convocatorias Abiertas</div>
            <span style={{ fontSize: 11, color: C.greenDark, fontWeight: 800 }}>
              {ong.campanas.length} activa{ong.campanas.length > 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ong.campanas.map((c, ci) => (
              <div key={c.id}
                onClick={() => navigate(`/ong/${ong.id}/campania/${ci}`)}
                style={{ display: "flex", gap: 0, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", transition: "border-color .15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.greenDark}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.border}
              >
                <img
                  src={CAMP_IMGS[`${ong.id}-${ci}`]}
                  alt={c.name}
                  style={{ width: 110, height: 90, objectFit: "cover", flexShrink: 0, display: "block" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = ONG_IMGS[ong.imgKey]; }}
                />
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                    <span style={{ fontSize: 10, color: C.greenDark, background: "#eef7dc", borderRadius: 20, padding: "2px 8px", fontWeight: 800, flexShrink: 0 }}>{c.tipo}</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.muted, alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-calendar" style={{ fontSize: 13 }} aria-hidden="true" />{c.fecha}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-user" style={{ fontSize: 13 }} aria-hidden="true" />{c.vacantes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Columna derecha: tarjeta Info ── */}
        <div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 20px 8px", position: "sticky", top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Información</div>

            {/* Iconos exactos como en la imagen del usuario */}
            <InfoRow icon="ti-map-pin"       label="Ubicación"           val={ong.loc} />
            <InfoRow icon="ti-users"         label="Área"                val={ong.tipo} />
            <InfoRow icon="ti-users-group"   label="Voluntarios activos" val="24 activos" />
            <InfoRow icon="ti-clock"         label="Horarios"            val="Fines de semana" />
            <InfoRow icon="ti-certificate"   label="Certificado"         val="Digital · PDF" />
            <InfoRow
              icon="ti-star"
              label="Calificación"
              iconColor="#f59e0b"
              val={
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <i className="ti ti-star-filled" style={{ fontSize: 14, color: "#f59e0b" }} aria-hidden="true" />
                  {ong.rating} / 5.0
                </span>
              }
            />
          </div>
        </div>

      </div>
    </div>
  );
}