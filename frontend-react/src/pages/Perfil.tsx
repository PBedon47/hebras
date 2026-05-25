import { useState } from "react";
import { ls } from "../utils/storage";
import { C } from "../utils/colors";
import {
  Sprout,
  Leaf,
  TreePine,
  Trees,
  Mountain,
  ChevronRight,
  ChevronLeft,
  Download,
  Award,
  ClipboardList,
  FileText,
  Settings,
  User,
  Mail,
  MapPin,
  Lock,
  Bell,
  Shield,
  Pencil,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Building2,
  Star,
} from "lucide-react";

/* ─── TIPOS Y DATOS ──────────────────────────────────────── */
type Panel = "main" | "postulaciones" | "campanas" | "certificados" | "configuracion";

const LEVELS = [
  { key: "SEMILLA", icon: Sprout,   pts: 0,    color: "#86b54a" },
  { key: "BROTE",   icon: Leaf,     pts: 200,  color: "#6ea832" },
  { key: "ÁRBOL",   icon: TreePine, pts: 500,  color: "#4a7a15" },
  { key: "ROBLE",   icon: Trees,    pts: 800,  color: "#2d5a0e" },
  { key: "RESERVA", icon: Mountain, pts: 1200, color: "#1a3a08" },
];

const POSTULACIONES = [
  { id: 1, campana: "Contrucción S.J.M",    ong: "Techo Perú",       fecha: "15-16 Jun 2026", estado: "pendiente",  pts: 0   },
  { id: 2, campana: "Taller de Lectura Kids", ong: "Techo Perú",     fecha: "Sáb 7 Jun 2026", estado: "aprobada",   pts: 120 },
  { id: 3, campana: "Rescate Alimentario",  ong: "Banco de Alimentos", fecha: "Fin de semana", estado: "pendiente",  pts: 0   },
  { id: 4, campana: "Arte en Comunidad",    ong: "Manos Unidas",     fecha: "Ago 2026",        estado: "rechazada",  pts: 0   },
];

const CAMPANAS_REALIZADAS = [
  { id: 1, nombre: "Reforestación Lomas",   ong: "Acción Verde",     fecha: "Mar 2026", pts: 150, rating: 5, horas: 8  },
  { id: 2, nombre: "Taller de Lectura Kids", ong: "Techo Perú",      fecha: "Feb 2026", pts: 120, rating: 4, horas: 6  },
  { id: 3, nombre: "Feria de Salud",         ong: "Salud Sin Límites", fecha: "Ene 2026", pts: 100, rating: 5, horas: 5  },
  { id: 4, nombre: "Jornada de Limpieza",    ong: "Recicla Perú",    fecha: "Dic 2025", pts: 80,  rating: 4, horas: 4  },
];

/* ─── HELPERS ─────────────────────────────────────────────── */
function getLevelIndex(pts: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (pts >= LEVELS[i].pts) idx = i;
  }
  return idx;
}

function StatusBadge({ estado }: { estado: string }) {
  const cfg: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
    pendiente: { bg: "#fef3c7", color: "#d97706", icon: <Clock size={12} />, label: "Pendiente" },
    aprobada:  { bg: "#dcfce7", color: "#16a34a", icon: <CheckCircle2 size={12} />, label: "Aprobada" },
    rechazada: { bg: "#fee2e2", color: "#dc2626", icon: <XCircle size={12} />, label: "Rechazada" },
  };
  const c = cfg[estado] || cfg.pendiente;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:c.bg, color:c.color, fontSize:11, fontWeight:800, borderRadius:20, padding:"3px 10px" }}>
      {c.icon}{c.label}
    </span>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= n ? "#f59e0b" : "none"} color={i <= n ? "#f59e0b" : "#ddd"} />
      ))}
    </span>
  );
}

/* ─── CERTIFICADO PDF (canvas) ───────────────────────────── */
function generarCertificado(campana: { nombre: string; ong: string; fecha: string; horas: number }, userName: string) {
  const canvas = document.createElement("canvas");
  canvas.width  = 900;
  canvas.height = 636;
  const ctx = canvas.getContext("2d")!;

  // Fondo crema
  ctx.fillStyle = "#f8f6ee";
  ctx.fillRect(0, 0, 900, 636);

  // Borde exterior decorativo
  ctx.strokeStyle = "#4a7a15";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 860, 596);
  ctx.strokeStyle = "#a8d44f";
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 836, 572);

  // Esquinas decorativas
  const corners = [[40,40],[860,40],[40,596],[860,596]] as [number,number][];
  corners.forEach(([x,y]) => {
    ctx.fillStyle = "#4a7a15";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header verde
  ctx.fillStyle = "#4a7a15";
  ctx.fillRect(32, 32, 836, 90);

  // Logo / Título header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("HEBRAS", 450, 90);

  ctx.font = "13px Arial";
  ctx.fillStyle = "#a8d44f";
  ctx.fillText("· TEJIENDO UN MUNDO JUNTOS ·", 450, 110);

  // Cuerpo
  ctx.fillStyle = "#4a7a15";
  ctx.font = "15px Arial";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICADO DE PARTICIPACIÓN VOLUNTARIA", 450, 155);

  ctx.fillStyle = "#555";
  ctx.font = "14px Arial";
  ctx.fillText("Se certifica que", 450, 195);

  // Nombre
  ctx.fillStyle = "#1a2e1a";
  ctx.font = "bold 36px Georgia, serif";
  ctx.fillText(userName.toUpperCase(), 450, 245);

  // Línea bajo el nombre
  ctx.strokeStyle = "#4a7a15";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(180, 258); ctx.lineTo(720, 258);
  ctx.stroke();

  ctx.fillStyle = "#555";
  ctx.font = "14px Arial";
  ctx.fillText("participó como voluntario/a en la campaña", 450, 285);

  // Campaña
  ctx.fillStyle = "#2d5a0e";
  ctx.font = "bold 24px Georgia, serif";
  ctx.fillText(`"${campana.nombre}"`, 450, 325);

  ctx.fillStyle = "#666";
  ctx.font = "13px Arial";
  ctx.fillText(`organizada por ${campana.ong}`, 450, 352);

  // Info adicional
  ctx.font = "13px Arial";
  ctx.fillText(`Fecha: ${campana.fecha}   ·   Horas acumuladas: ${campana.horas} hrs`, 450, 385);

  // Texto formal
  ctx.fillStyle = "#777";
  ctx.font = "12px Arial";
  ctx.fillText("Este certificado acredita la participación activa y comprometida del voluntario/a,", 450, 425);
  ctx.fillText("conforme a los estándares de calidad y ética de la plataforma HEBRAS.", 450, 445);

  // Firmas
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 520); ctx.lineTo(340, 520); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(560, 520); ctx.lineTo(740, 520); ctx.stroke();

  ctx.fillStyle = "#444";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Plataforma HEBRAS", 250, 538);
  ctx.fillText(campana.ong, 650, 538);
  ctx.font = "11px Arial";
  ctx.fillStyle = "#999";
  ctx.fillText("Dirección General", 250, 553);
  ctx.fillText("Organización voluntaria", 650, 553);

  // Sello
  ctx.strokeStyle = "#4a7a15";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(450, 530, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#4a7a15";
  ctx.font = "bold 11px Arial";
  ctx.fillText("VERIFICADO", 450, 527);
  ctx.font = "9px Arial";
  ctx.fillText("HEBRAS 2026", 450, 540);

  // Footer
  ctx.fillStyle = "#aaa";
  ctx.font = "10px Arial";
  ctx.fillText(`Emitido por HEBRAS · ${new Date().toLocaleDateString("es-PE", { year:"numeric", month:"long", day:"numeric" })}`, 450, 590);

  // Descargar
  const link = document.createElement("a");
  link.download = `certificado-${campana.nombre.toLowerCase().replace(/ /g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function Perfil() {
  const [panel, setPanel]         = useState<Panel>("main");
  const [user,  setUser]          = useState(() => ls.get("hebras_user", { nombre: "Mateo Salazar", email: "demo@hebras.pe", puntos: 420, ciudad: "Cusco" }));
  const [editingUser, setEditingUser] = useState({ ...user });
  const [editMode,    setEditMode]    = useState(false);
  const [savedMsg,    setSavedMsg]    = useState(false);
  const [notif,       setNotif]       = useState({ email: true, push: true, news: false });
  const [pwForm,      setPwForm]      = useState({ current: "", next: "", confirm: "" });
  const [pwMsg,       setPwMsg]       = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const puntos    = user.puntos || 420;
  const lvlIdx    = getLevelIndex(puntos);
  const lvl       = LEVELS[lvlIdx];
  const nextLvl   = LEVELS[lvlIdx + 1];
  const ptsToNext = nextLvl ? nextLvl.pts - puntos : 0;
  const progress  = nextLvl
    ? ((puntos - lvl.pts) / (nextLvl.pts - lvl.pts)) * 100
    : 100;

  const saveUser = () => {
    setUser(editingUser);
    ls.set("hebras_user", editingUser);
    setEditMode(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const savePw = () => {
    if (!pwForm.current || !pwForm.next) { setPwMsg("Completa todos los campos."); return; }
    if (pwForm.next !== pwForm.confirm)  { setPwMsg("Las contraseñas no coinciden."); return; }
    setPwMsg("¡Contraseña actualizada correctamente!");
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwMsg(""), 3000);
  };

  /* ── estilos comunes ── */
  const card: React.CSSProperties = { background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 14 };
  const menuRow = (danger?: boolean): React.CSSProperties => ({
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"13px 20px", borderBottom:`1px solid ${C.border}`,
    cursor:"pointer", fontSize:14, fontWeight:700,
    color: danger ? "#dc2626" : C.text,
  });
  const inp: React.CSSProperties = { width:"100%", padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`, fontSize:14, fontFamily:"'Nunito',sans-serif", outline:"none", marginBottom:10 };
  const btnGreen: React.CSSProperties = { padding:"11px 24px", border:"none", borderRadius:50, background:C.greenDark, color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Nunito',sans-serif" };
  const btnOut: React.CSSProperties  = { padding:"11px 24px", border:`1.5px solid ${C.border}`, borderRadius:50, background:C.white, color:C.text, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Nunito',sans-serif" };

  /* ── back header ── */
  const BackHeader = ({ title }: { title: string }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 20px", background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
      <button onClick={() => setPanel("main")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, color:C.text, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>
        <ChevronLeft size={20} />
      </button>
      <span style={{ fontWeight:800, fontSize:16 }}>{title}</span>
    </div>
  );

  /* ════════════════════ PANEL: MAIN ════════════════════ */
  if (panel === "main") return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      <div style={{ maxWidth:680, margin:"0 auto", padding:"28px 20px" }}>

        {/* Avatar + nombre */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
          <div style={{ position:"relative", marginBottom:12 }}>
            <div style={{ width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg,#5a8a1e,#2d5a0e)", display:"flex", alignItems:"center", justifyContent:"center", border:`3px solid ${C.green}` }}>
              <User size={40} color="#fff" />
            </div>
            <div style={{ position:"absolute", bottom:2, right:2, width:26, height:26, background:lvl.color, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${C.cream}` }}>
              <lvl.icon size={13} color="#fff" />
            </div>
          </div>
          <div style={{ fontWeight:800, fontSize:20, letterSpacing:.5 }}>{user.nombre?.toUpperCase()}</div>
          <div style={{ fontSize:12, color:C.purple, fontWeight:600, marginTop:2 }}>
            {lvl.key} · {user.ciudad || "Lima"}
          </div>
          <div style={{ display:"flex", gap:20, marginTop:14 }}>
            {[{ label:"Campañas", val: CAMPANAS_REALIZADAS.length }, { label:"Puntos", val: puntos }, { label:"Postulaciones", val: POSTULACIONES.length }].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontWeight:800, fontSize:18, color:C.greenDark }}>{s.val}</div>
                <div style={{ fontSize:11, color:C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de impacto */}
        <div style={{ ...card, padding:18, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontWeight:800, fontSize:13, textTransform:"uppercase", letterSpacing:1 }}>Mi Impacto</span>
            <span style={{ fontWeight:800, fontSize:14, color:C.greenDark }}>{puntos} pts</span>
          </div>

          {/* Barra de progreso de niveles con íconos */}
          <div style={{ position:"relative", marginBottom:20 }}>
            {/* Línea de fondo */}
            <div style={{ position:"absolute", top:15, left:20, right:20, height:4, background:C.border, borderRadius:2 }} />
            {/* Línea progresada */}
            <div style={{ position:"absolute", top:15, left:20, height:4, background:C.green, borderRadius:2, width:`calc(${(lvlIdx / (LEVELS.length-1)) * 100}% * (860px - 40px) / 860px)`, transition:"width .5s" }} />

            <div style={{ display:"flex", justifyContent:"space-between", position:"relative" }}>
              {LEVELS.map((lv, i) => {
                const done    = i <= lvlIdx;
                const current = i === lvlIdx;
                const Icon    = lv.icon;
                return (
                  <div key={lv.key} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                    <div style={{
                      width: current ? 36 : 30,
                      height: current ? 36 : 30,
                      borderRadius:"50%",
                      background: done ? lv.color : C.border,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      border: current ? `3px solid ${C.white}` : "none",
                      boxShadow: current ? `0 0 0 3px ${lv.color}` : "none",
                      transition:"all .3s",
                    }}>
                      <Icon size={current ? 17 : 14} color={done ? "#fff" : "#aaa"} />
                    </div>
                    <div style={{ fontSize: current ? 9 : 8, fontWeight: current ? 800 : 600, color: done ? lv.color : C.muted, whiteSpace:"nowrap" }}>{lv.key}</div>
                    <div style={{ fontSize:8, color:C.muted }}>{lv.pts} pts</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Siguiente hito */}
          {nextLvl && (
            <div style={{ background:"#f7faf0", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:700 }}>Siguiente hito</div>
                  <div style={{ fontWeight:800, fontSize:13, color:C.greenDark }}>{nextLvl.key}</div>
                </div>
                <div style={{ fontSize:12, color:C.greenDark, fontWeight:800 }}>{ptsToNext} pts por ganar</div>
              </div>
              <div style={{ background:C.border, borderRadius:50, height:6, overflow:"hidden" }}>
                <div style={{ height:"100%", background:`linear-gradient(90deg, ${C.green}, ${C.greenDark})`, borderRadius:50, width:`${progress}%`, transition:"width .5s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Campañas recientes */}
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:800, marginBottom:8 }}>Campañas recientes</div>
        {CAMPANAS_REALIZADAS.slice(0,2).map(c => (
          <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, ...card, padding:"12px 16px" }}>
            <div style={{ width:44, height:44, borderRadius:10, background:"#1a2e1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <TreePine size={22} color="#7aab30" />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:13 }}>{c.nombre}</div>
              <div style={{ fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                <Building2 size={11} />{c.ong} · {c.fecha}
              </div>
            </div>
            <div style={{ fontSize:13, color:C.greenDark, fontWeight:800 }}>+{c.pts}</div>
          </div>
        ))}

        {/* Menú */}
        <div style={{ ...card, overflow:"hidden", marginTop:8 }}>
          {[
            { label:"Mis Postulaciones", icon:<ClipboardList size={18} />, panel:"postulaciones" as Panel },
            { label:"Campañas Realizadas", icon:<Award size={18} />, panel:"campanas" as Panel },
            { label:"Certificados PDF", icon:<FileText size={18} />, panel:"certificados" as Panel },
            { label:"Configuración", icon:<Settings size={18} />, panel:"configuracion" as Panel },
          ].map(m => (
            <div key={m.label} style={menuRow()} onClick={() => setPanel(m.panel)}>
              <span style={{ display:"flex", alignItems:"center", gap:10, color:C.greenDark }}>{m.icon}<span style={{ color:C.text }}>{m.label}</span></span>
              <ChevronRight size={16} color={C.muted} />
            </div>
          ))}
        </div>

        <div style={{ height:20 }} />
      </div>
    </div>
  );

  /* ════════════════════ PANEL: POSTULACIONES ════════════════ */
  if (panel === "postulaciones") return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      <BackHeader title="Mis Postulaciones" />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px" }}>
        {POSTULACIONES.map(p => (
          <div key={p.id} style={{ ...card, padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ fontWeight:800, fontSize:14 }}>{p.campana}</div>
              <StatusBadge estado={p.estado} />
            </div>
            <div style={{ display:"flex", gap:14, fontSize:12, color:C.muted }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><Building2 size={12}/>{p.ong}</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><Calendar size={12}/>{p.fecha}</span>
            </div>
            {p.estado === "aprobada" && (
              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6, background:"#dcfce7", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#166534", fontWeight:700 }}>
                <CheckCircle2 size={14}/> Postulación aceptada · +{p.pts} pts al completar
              </div>
            )}
            {p.estado === "rechazada" && (
              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6, background:"#fee2e2", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#991b1b", fontWeight:700 }}>
                <XCircle size={14}/> No fue seleccionado esta vez. ¡Sigue intentando!
              </div>
            )}
          </div>
        ))}
        {POSTULACIONES.length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>Aún no tienes postulaciones.</div>
        )}
      </div>
    </div>
  );

  /* ════════════════════ PANEL: CAMPAÑAS REALIZADAS ════════════ */
  if (panel === "campanas") return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      <BackHeader title="Campañas Realizadas" />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px" }}>

        {/* Stats resumen */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
          {[
            { label:"Campañas", val: CAMPANAS_REALIZADAS.length },
            { label:"Horas", val: CAMPANAS_REALIZADAS.reduce((a,c)=>a+c.horas,0) },
            { label:"Puntos", val: CAMPANAS_REALIZADAS.reduce((a,c)=>a+c.pts,0) },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding:"14px", textAlign:"center" }}>
              <div style={{ fontWeight:800, fontSize:22, color:C.greenDark }}>{s.val}</div>
              <div style={{ fontSize:11, color:C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {CAMPANAS_REALIZADAS.map(c => (
          <div key={c.id} style={{ ...card, padding:"16px 18px" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"#1a2e1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <TreePine size={24} color="#7aab30" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>{c.nombre}</div>
                <div style={{ fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                  <Building2 size={11}/>{c.ong} · <Calendar size={11}/>{c.fecha}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:6 }}>
                  <Stars n={c.rating} />
                  <span style={{ fontSize:11, color:C.muted }}>{c.horas} hrs</span>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:15, color:C.greenDark }}>+{c.pts}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ════════════════════ PANEL: CERTIFICADOS ════════════════════ */
  if (panel === "certificados") return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      <BackHeader title="Certificados PDF" />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px" }}>
        <div style={{ background:"#eef7dc", border:`1px solid ${C.green}`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.greenDark, fontWeight:600 }}>
          Descarga tus certificados en formato imagen (PNG) — válidos para adjuntar en CV o enviar a tu facultad.
        </div>

        {CAMPANAS_REALIZADAS.map(c => (
          <div key={c.id} style={{ ...card, padding:"16px 18px" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"#f0f7e4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Award size={24} color={C.greenDark} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>{c.nombre}</div>
                <div style={{ fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                  <Building2 size={11}/>{c.ong} · {c.fecha} · {c.horas} hrs
                </div>
              </div>
              <button
                onClick={() => generarCertificado(c, user.nombre || "Voluntario")}
                style={{ ...btnGreen, display:"flex", alignItems:"center", gap:6, padding:"8px 14px", fontSize:12 }}
              >
                <Download size={14} /> Descargar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ════════════════════ PANEL: CONFIGURACIÓN ═══════════════════ */
  if (panel === "configuracion") return (
    <div style={{ minHeight:"100vh", background:C.cream }}>
      <BackHeader title="Configuración" />
      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px" }}>

        {/* Datos personales */}
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:800, marginBottom:8 }}>Datos personales</div>
        <div style={{ ...card, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontWeight:800, fontSize:14 }}>Perfil</span>
            <button onClick={() => setEditMode(!editMode)} style={{ ...btnOut, padding:"6px 14px", fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
              <Pencil size={13}/>{editMode ? "Cancelar" : "Editar"}
            </button>
          </div>

          {savedMsg && (
            <div style={{ background:"#dcfce7", color:"#166534", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:700, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <CheckCircle2 size={14}/>¡Datos guardados correctamente!
            </div>
          )}

          {[
            { label:"Nombre completo", key:"nombre", icon:<User size={14}/> },
            { label:"Correo electrónico", key:"email", icon:<Mail size={14}/> },
            { label:"Ciudad", key:"ciudad", icon:<MapPin size={14}/> },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:4, display:"flex", alignItems:"center", gap:5 }}>{f.icon}{f.label}</div>
              {editMode
                ? <input style={inp} value={(editingUser as any)[f.key] || ""} onChange={e => setEditingUser({ ...editingUser, [f.key]: e.target.value })} />
                : <div style={{ fontSize:14, fontWeight:600, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>{(user as any)[f.key] || "—"}</div>
              }
            </div>
          ))}

          {editMode && (
            <button onClick={saveUser} style={{ ...btnGreen, marginTop:4 }}>Guardar cambios</button>
          )}
        </div>

        {/* Cambiar contraseña */}
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:800, marginBottom:8 }}>Seguridad</div>
        <div style={{ ...card, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}><Lock size={16} color={C.greenDark}/>Cambiar contraseña</div>
          {pwMsg && (
            <div style={{ background: pwMsg.includes("correcta") ? "#dcfce7" : "#fee2e2", color: pwMsg.includes("correcta") ? "#166534" : "#991b1b", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:700, marginBottom:12 }}>
              {pwMsg}
            </div>
          )}
          <input style={inp} type="password" placeholder="Contraseña actual" value={pwForm.current} onChange={e => setPwForm({...pwForm, current:e.target.value})} />
          <input style={inp} type="password" placeholder="Nueva contraseña" value={pwForm.next} onChange={e => setPwForm({...pwForm, next:e.target.value})} />
          <input style={inp} type="password" placeholder="Confirmar nueva contraseña" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm:e.target.value})} />
          <button onClick={savePw} style={{ ...btnGreen, display:"flex", alignItems:"center", gap:6 }}><Shield size={14}/>Actualizar contraseña</button>
        </div>

        {/* Notificaciones */}
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:800, marginBottom:8 }}>Notificaciones</div>
        <div style={{ ...card, overflow:"hidden", marginBottom:16 }}>
          {[
            { key:"email", label:"Notificaciones por correo", sub:"Recibe novedades y actualizaciones" },
            { key:"push",  label:"Notificaciones push", sub:"Alertas en tiempo real" },
            { key:"news",  label:"Newsletter HEBRAS", sub:"Noticias del mundo del voluntariado" },
          ].map(n => (
            <div key={n.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{n.label}</div>
                <div style={{ fontSize:11, color:C.muted }}>{n.sub}</div>
              </div>
              <div
                onClick={() => setNotif(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                style={{
                  width:44, height:24, borderRadius:12, cursor:"pointer",
                  background: (notif as any)[n.key] ? C.greenDark : C.border,
                  position:"relative", transition:"background .2s", flexShrink:0,
                }}
              >
                <div style={{
                  width:18, height:18, borderRadius:"50%", background:"#fff",
                  position:"absolute", top:3,
                  left: (notif as any)[n.key] ? 23 : 3,
                  transition:"left .2s",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Cuenta */}
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1, color:C.muted, fontWeight:800, marginBottom:8 }}>Cuenta</div>
        <div style={{ ...card, overflow:"hidden" }}>
          <div style={menuRow()}>
            <span style={{ display:"flex", alignItems:"center", gap:10 }}><Bell size={16} color={C.greenDark}/>Preferencias de privacidad</span>
            <ChevronRight size={16} color={C.muted}/>
          </div>
              <div
                  style={menuRow(true)}
                  onClick={() => setShowDeleteModal(true)}
                >
                
              <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                <XCircle size={16}/>Eliminar cuenta
              </span>

              <ChevronRight size={16} color="#dc2626"/>
            </div>
          </div>
           {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            backdropFilter: "blur(4px)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
              animation: "fadeIn .2s ease",
            }}
          >
            {/* icono */}
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <XCircle size={38} color="#dc2626" />
            </div>

            {/* titulo */}
            <div
              style={{
                textAlign: "center",
                fontWeight: 800,
                fontSize: 22,
                marginBottom: 10,
                color: "#111827",
              }}
            >
              Eliminar cuenta
            </div>

            {/* texto */}
            <div
              style={{
                textAlign: "center",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#6b7280",
                marginBottom: 24,
              }}
            >
              Esta acción eliminará permanentemente tu cuenta,
              campañas, postulaciones y certificados asociados.
              <br /><br />
              No podrás recuperar esta información después.
            </div>

            {/* botones */}
            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 14,
                  border: `1px solid ${C.border}`,
                  background: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("hebras_user");
                  localStorage.removeItem("hebras_postulaciones");
                  localStorage.removeItem("hebras_campanas");
                  localStorage.removeItem("hebras_notificaciones");

                  window.location.reload();
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 14,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

          <div style={{ height:30 }} />
        </div>
      </div>
  );
  return null;
}