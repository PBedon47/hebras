import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { ONGS } from "../data/ongs";
import Topbar from "../components/Topbar";
import { C } from "../utils/colors";
import { ls } from "../utils/storage";

import techoPeru       from "../assets/techo-peru.png";
import caminandoJuntos from "../assets/caminando-juntos.png";
import bancoAlimentos  from "../assets/banco-alimentos.png";
import manosUnidas     from "../assets/manos-unidas.png";
import fondoHebras     from "../assets/fondo-hebras.png";

const ONG_IMGS: Record<string, string> = {
  "techo-peru":       techoPeru,
  "caminando-juntos": caminandoJuntos,
  "banco-alimentos":  bancoAlimentos,
  "manos-unidas":     manosUnidas,
};

const CIUDADES = ["Lima", "Cusco", "Arequipa", "Trujillo", "Piura"];
const DISTRITOS: Record<string, string[]> = {
  Lima: [
    "Lima Centro","Miraflores","San Isidro","Barranco","Surco",
    "La Molina","San Juan de Miraflores","Villa El Salvador",
    "Villa María del Triunfo","Ate","Comas","Los Olivos",
    "San Martín de Porres","Callao",
  ],
  Cusco:    ["Cusco Centro","San Blas","Wanchaq","San Sebastián","San Jerónimo","Poroy"],
  Arequipa: ["Arequipa Centro","Cayma","Cerro Colorado","Yanahuara"],
  Trujillo: ["Trujillo Centro","Víctor Larco","El Porvenir"],
  Piura:    ["Piura Centro","Castilla","Sullana"],
};

function campanaCubreFecha(fechaISO: string, fechaISOFin: string | undefined, filtro: string) {
  if (!filtro) return true;
  const f   = new Date(filtro);
  const ini = new Date(fechaISO);
  const fin = fechaISOFin ? new Date(fechaISOFin) : ini;
  return f >= ini && f <= fin;
}

/* ─── Dropdown genérico ────────────────────────────────── */
type DropItem = { label: string; value: string };
function CustomDropdown({
  icon, placeholder, value, items, onChange,
}: {
  icon: string; placeholder: string; value: string;
  items: DropItem[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = items.find(i => i.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 14px 9px 12px", borderRadius: 50,
          border: `1px solid ${value ? C.greenDark : C.border}`,
          background: value ? "#eef7dc" : C.white,
          fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
          cursor: "pointer", color: value ? C.greenDark : C.text, whiteSpace: "nowrap",
        }}
      >
        <i className={`ti ${icon}`} style={{ fontSize: 15 }} />
        {selected ? selected.label : placeholder}
        <i className={`ti ti-chevron-${open ? "up" : "down"}`} style={{ fontSize: 12, marginLeft: 2 }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 200,
          minWidth: 200, maxHeight: 280, overflowY: "auto", padding: "6px 0",
        }}>
          {value && (
            <div onClick={() => { onChange(""); setOpen(false); }}
              style={{ padding: "8px 14px", fontSize: 12, color: "#dc2626", fontWeight: 700, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
              <i className="ti ti-x" style={{ fontSize: 12, marginRight: 5 }} />Quitar filtro
            </div>
          )}
          {items.map(it => (
            <div key={it.value} onClick={() => { onChange(it.value); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", fontSize: 13, cursor: "pointer",
                fontWeight: it.value === value ? 800 : 600,
                color: it.value === value ? C.greenDark : C.text,
                background: it.value === value ? "#f0f7e4" : "transparent",
              }}>
              {it.value === value && <i className="ti ti-check" style={{ fontSize: 12, color: C.greenDark }} />}
              {it.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Dropdown Calificación con estrella amarilla ──────── */
function RatingDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const items = [
    { label: "⭐️ 4.0 +", value: "4" },
    { label: "⭐️ 4.5 +", value: "4.5" },
    { label: "⭐️ 4.8 +", value: "4.8" },
  ];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = items.find(i => i.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 14px 9px 12px", borderRadius: 50,
          border: `1px solid ${value ? C.greenDark : C.border}`,
          background: value ? "#eef7dc" : C.white,
          fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
          cursor: "pointer", color: value ? C.greenDark : C.text, whiteSpace: "nowrap",
        }}
      >
        {/* Estrella amarilla icono Tabler */}
        <i className="ti ti-star-filled" style={{ fontSize: 15, color: "#f59e0b" }} />
        {selected ? selected.label : "Calificación"}
        <i className={`ti ti-chevron-${open ? "up" : "down"}`} style={{ fontSize: 12, marginLeft: 2 }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 200,
          minWidth: 200, padding: "6px 0",
        }}>
          {value && (
            <div onClick={() => { onChange(""); setOpen(false); }}
              style={{ padding: "8px 14px", fontSize: 12, color: "#dc2626", fontWeight: 700, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
              <i className="ti ti-x" style={{ fontSize: 12, marginRight: 5 }} />Quitar filtro
            </div>
          )}
          {items.map(it => (
            <div key={it.value} onClick={() => { onChange(it.value); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 14px", fontSize: 13, cursor: "pointer",
                fontWeight: it.value === value ? 800 : 600,
                color: it.value === value ? C.greenDark : C.text,
                background: it.value === value ? "#f0f7e4" : "transparent",
              }}>
              <i className="ti ti-star-filled" style={{ fontSize: 14, color: "#f59e0b" }} />
              {it.label}
              {it.value === value && <i className="ti ti-check" style={{ fontSize: 12, color: C.greenDark, marginLeft: "auto" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Dropdown Ubicación 2 pasos: ciudad → distrito ────── */
function UbicacionDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open,   setOpen]   = useState(false);
  const [ciudad, setCiudad] = useState<string>(() =>
    CIUDADES.find(c => value === c || DISTRITOS[c]?.includes(value)) ?? ""
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Sincronizar ciudad si value se borra desde afuera
  useEffect(() => { if (!value) setCiudad(""); }, [value]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 14px 9px 12px", borderRadius: 50,
          border: `1px solid ${value ? C.greenDark : C.border}`,
          background: value ? "#eef7dc" : C.white,
          fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
          cursor: "pointer", color: value ? C.greenDark : C.text, whiteSpace: "nowrap",
        }}
      >
        <i className="ti ti-map-pin" style={{ fontSize: 15 }} />
        {value || "Ubicación"}
        <i className={`ti ti-chevron-${open ? "up" : "down"}`} style={{ fontSize: 12, marginLeft: 2 }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 200,
          minWidth: 220, maxHeight: 320, overflowY: "auto", padding: "6px 0",
        }}>
          {/* Quitar filtro */}
          {value && (
            <div onClick={() => { onChange(""); setCiudad(""); setOpen(false); }}
              style={{ padding: "8px 14px", fontSize: 12, color: "#dc2626", fontWeight: 700, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
              <i className="ti ti-x" style={{ fontSize: 12, marginRight: 5 }} />Quitar filtro
            </div>
          )}

          {/* Paso 1: lista de ciudades */}
          {!ciudad ? (
            <>
              <div style={{ padding: "5px 14px 3px", fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                Selecciona ciudad
              </div>
              {CIUDADES.map(c => (
                <div key={c} onClick={() => setCiudad(c)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700, color: C.text,
                  }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="ti ti-building-skyscraper" style={{ fontSize: 15, color: C.muted }} />
                    {c}
                  </span>
                  <i className="ti ti-chevron-right" style={{ fontSize: 13, color: C.muted }} />
                </div>
              ))}
            </>
          ) : (
            /* Paso 2: distritos de la ciudad elegida */
            <>
              {/* Botón volver a ciudades */}
              <div onClick={() => setCiudad("")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", fontSize: 13, color: C.greenDark, fontWeight: 800, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
                <i className="ti ti-arrow-left" style={{ fontSize: 15 }} />
                {ciudad}
              </div>
              {/* Toda la ciudad */}
              <div onClick={() => { onChange(ciudad); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700,
                  color: value === ciudad ? C.greenDark : C.text,
                  background: value === ciudad ? "#f0f7e4" : "transparent",
                }}>
                <i className="ti ti-map" style={{ fontSize: 14, color: C.greenDark }} />
                Toda {ciudad}
                {value === ciudad && <i className="ti ti-check" style={{ fontSize: 12, color: C.greenDark, marginLeft: "auto" }} />}
              </div>
              <div style={{ height: 1, background: C.border, margin: "4px 0" }} />
              <div style={{ padding: "4px 14px 2px", fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                Distritos
              </div>
              {DISTRITOS[ciudad]?.map(d => (
                <div key={d} onClick={() => { onChange(d); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px 7px 20px", fontSize: 13, cursor: "pointer",
                    fontWeight: d === value ? 800 : 600,
                    color: d === value ? C.greenDark : C.text,
                    background: d === value ? "#f0f7e4" : "transparent",
                  }}>
                  {d === value && <i className="ti ti-check" style={{ fontSize: 12, color: C.greenDark }} />}
                  {d}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ HOME PRINCIPAL ══════════════════════ */
export default function Home() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const search    = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";
  const user      = ls.get("hebras_user", { nombre: "Mateo Salazar" });
  const firstName = user.nombre?.split(" ")[0] || "Mateo";

  const [ubicacion, setUbicacion] = useState("");
  const [area,      setArea]      = useState("");
  const [rating,    setRating]    = useState("");
  const [fecha,     setFecha]     = useState("");

  const hayFiltros = !!(ubicacion || area || rating || fecha || search);

  const ongsFiltradas = useMemo(() =>
    ONGS.filter(o => {
      const okSearch    = !search    || o.name.toLowerCase().includes(search) || o.tipo.toLowerCase().includes(search);
      const okArea      = !area      || o.tipo === area;
      const okRating    = !rating    || Number(o.rating) >= Number(rating);
      const okUbicacion = !ubicacion || o.distrito === ubicacion || o.loc.toLowerCase().includes(ubicacion.toLowerCase());
      const okFecha     = !fecha     || o.campanas.some(c => campanaCubreFecha(c.fechaISO, c.fechaISOFin, fecha));
      return okSearch && okArea && okRating && okUbicacion && okFecha;
    })
  , [search, area, rating, ubicacion, fecha]);

  return (
    <div>
      <Topbar />

      {/* ── SECCIÓN HERO + FILTROS con fondo completo ─────── */}
      <div style={{
        backgroundImage: `url(${fondoHebras})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}>
        {/* overlay semitransparente para legibilidad */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(245,243,232,0.78)", backdropFilter: "blur(0.5px)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "36px 32px 32px" }}>
          {/* Saludo */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 38, color: C.greenDark, lineHeight: 1.1 }}>
              Bienvenido, {firstName}
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 5, fontWeight: 600 }}>
              Encuentra tu próxima oportunidad de voluntariado
            </div>
          </div>

          {/* Filtros */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

            <UbicacionDropdown value={ubicacion} onChange={setUbicacion} />

            <CustomDropdown
              icon="ti-category"
              placeholder="Área"
              value={area}
              onChange={setArea}
              items={[
                { label: "Social",         value: "SOCIAL" },
                { label: "Educación",      value: "EDUCACIÓN" },
                { label: "Desarrollo",     value: "DESARROLLO" },
                { label: "Salud",          value: "SALUD" },
                { label: "Medio Ambiente", value: "MEDIO AMBIENTE" },
              ]}
            />

            <RatingDropdown value={rating} onChange={setRating} />

            {/* Fecha con icono Tabler */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <i className="ti ti-calendar"
                style={{ position: "absolute", left: 12, fontSize: 15, color: fecha ? C.greenDark : C.muted, pointerEvents: "none", zIndex: 1 }} />
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  borderRadius: 50,
                  border: `1px solid ${fecha ? C.greenDark : C.border}`,
                  background: fecha ? "#eef7dc" : C.white,
                  fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
                  cursor: "pointer", outline: "none",
                  color: fecha ? C.greenDark : C.muted,
                }}
              />
            </div>

            {/* Limpiar */}
            {hayFiltros && (
              <button
                onClick={() => { setUbicacion(""); setArea(""); setRating(""); setFecha(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "9px 14px", borderRadius: 50,
                  border: "1px solid #fca5a5", background: "#fee2e2",
                  color: "#dc2626", fontSize: 12, fontWeight: 800,
                  cursor: "pointer", fontFamily: "'Nunito',sans-serif",
                }}
              >
                <i className="ti ti-x" style={{ fontSize: 13 }} />Limpiar
              </button>
            )}
          </div>

          {/* Aviso fecha activa */}
          {fecha && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.greenDark, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <i className="ti ti-calendar-check" style={{ fontSize: 14 }} />
              Campañas disponibles el{" "}
              {new Date(fecha + "T12:00:00").toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
        </div>
      </div>

      {/* ── GRID DE ONGs ──────────────────────────────────── */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-sparkles" style={{ fontSize: 18, color: C.greenDark }} />
            {fecha ? `Disponibles para esa fecha · ${ongsFiltradas.length} resultado${ongsFiltradas.length !== 1 ? "s" : ""}` : "Recomendados para Ti"}
          </span>
          {hayFiltros && (
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              {ongsFiltradas.length} de {ONGS.length} ONGs
            </span>
          )}
        </div>

        {ongsFiltradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, color: C.muted }}>
            <i className="ti ti-search-off" style={{ fontSize: 42, color: C.border, display: "block", marginBottom: 12 }} />
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: C.text }}>Sin resultados para esos filtros</div>
            <div style={{ fontSize: 13 }}>{fecha ? "No hay campañas en esa fecha. Prueba otra." : "Intenta cambiar los filtros."}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18, marginBottom: 40 }}>
            {ongsFiltradas.map(o => {
              const campanasFecha = fecha ? o.campanas.filter(c => campanaCubreFecha(c.fechaISO, c.fechaISOFin, fecha)) : [];
              return (
                <div
                  key={o.id}
                  onClick={() => navigate(`/ong/${o.id}`)}
                  style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", transition: "box-shadow .15s, border-color .15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.greenDark; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(74,122,21,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={ONG_IMGS[o.imgKey]} alt={o.name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
                    {campanasFecha.length > 0 && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: C.green, color: C.darkBtn, fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                        <i className="ti ti-calendar-check" style={{ fontSize: 11 }} />{campanasFecha[0].name}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, fontSize: 13, marginBottom: 2 }}>
                      {o.name}
                      <div style={{ width: 14, height: 14, background: C.greenDark, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="ti ti-check" style={{ fontSize: 9, color: "#fff" }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{o.tipo} · {o.distrito}</div>
                    {campanasFecha.length > 0 && (
                      <div style={{ fontSize: 11, color: C.greenDark, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <i className="ti ti-calendar" style={{ fontSize: 12 }} />{campanasFecha[0].fecha}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: C.greenDark }}>
                        <i className="ti ti-star-filled" style={{ fontSize: 12 }} />{o.rating}
                      </div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/ong/${o.id}`); }}
                        style={{ fontSize: 10, color: C.white, background: C.darkBtn, border: "none", borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                        DETALLE <i className="ti ti-arrow-right" style={{ fontSize: 10 }} />
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