import { useParams, useNavigate } from "react-router-dom";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";

import construccionSJM from "../assets/construccion-sjl.png";
import tallerLectura from "../assets/taller-lectura-kids.png";

const CAMP_IMGS: Record<string, string> = {
  "0-0": construccionSJM,
  "0-1": tallerLectura,
};

export default function Campania() {
  const { id, cid } = useParams();
  const navigate = useNavigate();
    
  const ong = ONGS[Number(id)];
  const camp = ong?.campanas[Number(cid)];
  if (!ong || !camp) return null;

  return (
    <div>
      <Topbar showBack title={camp.name} showSearch={false} />
      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
        {/* Left */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.green, color: C.darkBtn, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "6px 16px", marginBottom: 16 }}>
            <i className="ti ti-circle-check" style={{ fontSize: 14 }} aria-hidden="true" />
            CONVOCATORIA ABIERTA
          </div>

          <img
            src={CAMP_IMGS[`${id}-${cid}`] || ""}
            alt={camp.name}
            style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 14, marginBottom: 20, display: "block" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />

          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{camp.desc}</div>

          <div style={{ background: "#f8faf0", border: `1px dashed ${C.green}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: C.greenDark, marginBottom: 12 }}>Lo que harás:</div>
            {camp.tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 8, color: C.text }}>
                <i className="ti ti-circle-check" style={{ fontSize: 15, color: C.green }} aria-hidden="true" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — sticky card */}
        <div>
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, position: "sticky", top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{ong.name}</div>
            {[
              { icon: "ti-calendar", label: "Fecha", val: camp.fecha },
              { icon: "ti-user", label: "Vacantes", val: camp.vacantes },
              { icon: "ti-map-pin", label: "Modalidad", val: camp.tipo },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 13 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f0f7e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${row.icon}`} style={{ fontSize: 17, color: C.greenDark }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{row.label}</div>
                  <div style={{ fontWeight: 800 }}>{row.val}</div>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate("/perfil")}
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
                fontFamily: "'Nunito',sans-serif",
                marginTop: 4
              }}
            >
              POSTULAR A ESTA CAMPAÑA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}