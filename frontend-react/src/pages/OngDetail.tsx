import { useParams, useNavigate } from "react-router-dom";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";

import techoPeru from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos from "../assets/banco-alimentos.png";
import manosUnidas from "../assets/manos-unidas.png";
import construccionSJM from "../assets/construccion-sjl.png";
import tallerLectura from "../assets/taller-lectura-kids.png";

const ONG_IMGS: Record<number, string> = { 0: techoPeru, 1: caminandoJuntos, 2: bancoAlimentos, 3: manosUnidas };
const CAMP_IMGS: Record<string, string> = {
  "0-0": construccionSJM,
  "0-1": tallerLectura,
};

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
        <img
          src={ONG_IMGS[ong.id]}
          alt={ong.name}
          style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "32px 32px 20px" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>{ong.name}</div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* Left column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ background: C.darkBtn, color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "4px 12px" }}>{ong.tipo}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted, fontWeight: 600 }}>
              <i className="ti ti-map-pin" style={{ fontSize: 14 }} aria-hidden="true" />{ong.loc}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 800, color: C.greenDark, marginLeft: "auto" }}>
              <i className="ti ti-star-filled" style={{ fontSize: 14 }} aria-hidden="true" />{ong.rating}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, border: `1.5px solid ${C.darkBtn}`, background: C.white, color: C.darkBtn, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              <i className="ti ti-world" style={{ fontSize: 15 }} aria-hidden="true" /> SITIO WEB
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, border: "none", background: C.darkBtn, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              <i className="ti ti-brand-whatsapp" style={{ fontSize: 15 }} aria-hidden="true" /> MENSAJE DIRECTO
            </button>
          </div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800, marginBottom: 6 }}>Misión</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 24 }}>{ong.mision}</div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.muted, fontWeight: 800, marginBottom: 12 }}>
            Convocatorias abiertas
            <span style={{ color: C.greenDark, marginLeft: 8 }}>{ong.campanas.length} activa{ong.campanas.length > 1 ? "s" : ""}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ong.campanas.map((c, ci) => (
              <div
                key={c.id}
                onClick={() => navigate(`/ong/${ong.id}/campania/${ci}`)}
                style={{ display: "flex", gap: 14, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer" }}
              >
                <img
                  src={CAMP_IMGS[`${ong.id}-${ci}`] || ONG_IMGS[ong.id]}
                  alt={c.name}
                  style={{ width: 110, height: 90, objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ padding: "12px 14px 12px 0", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                    <span style={{ fontSize: 10, color: C.greenDark, background: "#eef7dc", borderRadius: 20, padding: "2px 8px", fontWeight: 800 }}>{c.tipo}</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, color: C.muted, alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-calendar" style={{ fontSize: 13 }} aria-hidden="true" />{c.fecha}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><i className="ti ti-user" style={{ fontSize: 13 }} aria-hidden="true" />{c.vacantes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — info card */}
        <div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px", position: "sticky", top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Información</div>
            {[
              { icon: "ti-map-pin", label: "Ubicación", val: ong.loc },
              { icon: "ti-category", label: "Área", val: ong.tipo },
              { icon: "ti-users", label: "Voluntarios activos", val: "24" },
              { icon: "ti-star", label: "Calificación", val: `${ong.rating} / 5.0` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0f7e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${row.icon}`} style={{ fontSize: 16, color: C.greenDark }} aria-hidden="true" />
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