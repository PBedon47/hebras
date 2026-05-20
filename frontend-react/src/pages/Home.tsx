import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";
import { ls } from "../utils/storage";

// ── Imágenes de ONGs ──────────────────────────────────────
import techoPeru       from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos  from "../assets/banco-alimentos.png";
import manosUnidas     from "../assets/manos-unidas.png";

// ── Fondo hero ────────────────────────────────────────────
import fondoHebras from "../assets/fondo-hebras.png";

const ONG_IMGS: Record<string, string> = {
  "techo-peru":       techoPeru,
  "caminando-juntos": caminandoJuntos,
  "banco-alimentos":  bancoAlimentos,
  "manos-unidas":     manosUnidas,
};

// ── Opciones de ubicación ─────────────────────────────────
const UBICACIONES = [
  { group: "Lima", items: [
    "Lima Centro",
    "Miraflores",
    "San Isidro",
    "Barranco",
    "Surco",
    "La Molina",
    "San Juan de Miraflores",
    "Villa El Salvador",
    "Villa María del Triunfo",
    "Ate",
    "Comas",
    "Los Olivos",
    "San Martín de Porres",
    "Callao",
  ]},
  { group: "Cusco", items: [
    "Cusco Centro",
    "San Blas",
    "Wanchaq",
    "San Sebastián",
    "San Jerónimo",
    "Poroy",
  ]},
  { group: "Otras ciudades", items: [
    "Arequipa Centro",
    "Trujillo",
    "Piura",
    "Iquitos",
    "Huancayo",
  ]},
];

// ── Helper: si una campaña cubre una fecha dada ───────────
function campanaCubreFecha(fechaISO: string, fechaISOFin: string | undefined, filtro: string): boolean {
  if (!filtro) return true;
  const f  = new Date(filtro);
  const ini = new Date(fechaISO);
  const fin  = fechaISOFin ? new Date(fechaISOFin) : ini;
  return f >= ini && f <= fin;
}

// ── Estilos compartidos ───────────────────────────────────
const selectStyle: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: 50,
  border: `1px solid ${C.border}`,
  background: C.white,
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "'Nunito', sans-serif",
  cursor: "pointer",
  outline: "none",
  color: C.text,
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: 28,
};

export default function Home() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const params     = new URLSearchParams(location.search);
  const search     = params.get("search")?.toLowerCase() || "";

  const user      = ls.get("hebras_user", { nombre: "Mateo Salazar" });
  const firstName = user.nombre?.split(" ")[0] || "Mateo";

  const [ubicacion, setUbicacion] = useState("");
  const [area,      setArea]      = useState("");
  const [rating,    setRating]    = useState(0);
  const [fecha,     setFecha]     = useState("");

  // ── Filtrado ─────────────────────────────────────────────
  const ongsFiltradas = useMemo(() => {
    return ONGS.filter((o) => {
      // búsqueda por texto
      const okSearch = !search ||
        o.name.toLowerCase().includes(search) ||
        o.tipo.toLowerCase().includes(search);

      // filtro área
      const okArea = !area || o.tipo === area;

      // filtro rating
      const okRating = !rating || Number(o.rating) >= rating;

      // filtro ubicación (distrito o ciudad)
      const okUbicacion = !ubicacion ||
        o.distrito === ubicacion ||
        o.loc.toLowerCase().includes(ubicacion.toLowerCase());

      // filtro fecha: la ONG pasa si AL MENOS UNA campaña cubre la fecha
      const okFecha = !fecha ||
        o.campanas.some(c => campanaCubreFecha(c.fechaISO, c.fechaISOFin, fecha));

      return okSearch && okArea && okRating && okUbicacion && okFecha;
    });
  }, [search, area, rating, ubicacion, fecha]);

  const hayFiltros = ubicacion || area || rating || fecha;

  return (
    <div>
      <Topbar />

      {/* ── HERO con fondo ───────────────────────────────── */}
      <div
        style={{
          backgroundImage: `url(${fondoHebras})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "40px 32px 32px",
          position: "relative",
        }}
      >
        {/* overlay suave para legibilidad */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(245,243,232,0.72)",
          backdropFilter: "blur(1px)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Saludo */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 38,
              color: C.greenDark,
              lineHeight: 1.1,
            }}>
              Bienvenido, {firstName}
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 5, fontWeight: 600 }}>
              Encuentra tu próxima oportunidad de voluntariado
            </div>
          </div>

          {/* ── Filtros ───────────────────────────────────── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

            {/* Ubicación con grupos */}
            <div style={{ position: "relative" }}>
              <select
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                style={selectStyle}
              >
                <option value="">📍 Ubicación</option>
                {UBICACIONES.map(g => (
                  <optgroup key={g.group} label={`── ${g.group}`}>
                    {g.items.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:11, color:C.muted }}>▾</span>
            </div>

            {/* Área */}
            <div style={{ position: "relative" }}>
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                style={selectStyle}
              >
                <option value="">🗂 Área</option>
                <option value="SOCIAL">Social</option>
                <option value="EDUCACIÓN">Educación</option>
                <option value="DESARROLLO">Desarrollo</option>
                <option value="SALUD">Salud</option>
                <option value="MEDIO AMBIENTE">Medio Ambiente</option>
              </select>
              <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:11, color:C.muted }}>▾</span>
            </div>

            {/* Calificación */}
            <div style={{ position: "relative" }}>
              <select
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                style={selectStyle}
              >
                <option value={0}>⭐ Calificación</option>
                <option value={4}>4.0+</option>
                <option value={4.5}>4.5+</option>
                <option value={4.8}>4.8+</option>
              </select>
              <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", fontSize:11, color:C.muted }}>▾</span>
            </div>

            {/* Fecha — filtra campañas que incluyen ese día */}
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                style={{ ...selectStyle, paddingRight: 14, color: fecha ? C.text : C.muted }}
              />
            </div>

            {/* Limpiar filtros */}
            {hayFiltros && (
              <button
                onClick={() => { setUbicacion(""); setArea(""); setRating(0); setFecha(""); }}
                style={{
                  padding: "9px 14px", borderRadius: 50,
                  border: `1px solid ${C.border}`,
                  background: "#fee2e2", color: "#dc2626",
                  fontSize: 12, fontWeight: 800, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {/* Indicador de filtro de fecha activo */}
          {fecha && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.greenDark, fontWeight: 700 }}>
              Mostrando ONGs con campañas disponibles el{" "}
              {new Date(fecha + "T12:00:00").toLocaleDateString("es-PE", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ──────────────────────────── */}
      <div style={{ padding: "28px 32px" }}>

        {/* Título sección */}
        <div style={{
          fontWeight: 800, fontSize: 17, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <i className="ti ti-sparkles" style={{ fontSize: 18, color: C.greenDark }} aria-hidden="true" />
            {fecha
              ? `Campañas disponibles · ${ongsFiltradas.length} resultado${ongsFiltradas.length !== 1 ? "s" : ""}`
              : "Recomendados para Ti"
            }
          </span>
          {hayFiltros && (
            <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>
              {ongsFiltradas.length} de {ONGS.length} ONGs
            </span>
          )}
        </div>

        {/* Grid de ONGs */}
        {ongsFiltradas.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: C.white, borderRadius: 16,
            border: `1px solid ${C.border}`, color: C.muted,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: C.text }}>
              No encontramos ONGs con esos filtros
            </div>
            <div style={{ fontSize: 13 }}>
              {fecha
                ? "No hay campañas activas para esa fecha. Prueba con otra fecha."
                : "Intenta cambiar los filtros de búsqueda."
              }
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 18,
            marginBottom: 40,
          }}>
            {ongsFiltradas.map((o) => {
              // campañas que coinciden con la fecha filtrada (para mostrar badge)
              const campanasFecha = fecha
                ? o.campanas.filter(c => campanaCubreFecha(c.fechaISO, c.fechaISOFin, fecha))
                : [];

              return (
                <div
                  key={o.id}
                  onClick={() => navigate(`/ong/${o.id}`)}
                  style={{
                    background: C.white,
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "box-shadow .15s, border-color .15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = C.greenDark;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(74,122,21,0.12)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* Imagen */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={ONG_IMGS[o.imgKey]}
                      alt={o.name}
                      style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }}
                    />
                    {/* Badge de campaña cuando hay filtro de fecha */}
                    {campanasFecha.length > 0 && (
                      <div style={{
                        position: "absolute", top: 8, left: 8,
                        background: C.green, color: C.darkBtn,
                        fontSize: 10, fontWeight: 800, borderRadius: 20,
                        padding: "3px 10px",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <i className="ti ti-calendar-check" style={{ fontSize: 11 }} aria-hidden="true" />
                        {campanasFecha[0].name}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, fontSize: 13, marginBottom: 2 }}>
                      {o.name}
                      <div style={{ width: 14, height: 14, background: C.greenDark, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="ti ti-check" style={{ fontSize: 9, color: "#fff" }} aria-hidden="true" />
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      {o.tipo} · {o.distrito}
                    </div>

                    {/* Fecha de campaña relevante */}
                    {campanasFecha.length > 0 && (
                      <div style={{ fontSize: 11, color: C.greenDark, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <i className="ti ti-calendar" style={{ fontSize: 12 }} aria-hidden="true" />
                        {campanasFecha[0].fecha}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: C.greenDark }}>
                        <i className="ti ti-star-filled" style={{ fontSize: 12 }} aria-hidden="true" />
                        {o.rating}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/ong/${o.id}`); }}
                        style={{
                          fontSize: 10, color: C.white, background: C.darkBtn,
                          border: "none", borderRadius: 20, padding: "4px 10px",
                          cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                          display: "flex", alignItems: "center", gap: 3,
                        }}
                      >
                        DETALLE <i className="ti ti-arrow-right" style={{ fontSize: 10 }} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}