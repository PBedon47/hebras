import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Send,
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Leaf,
  BookOpen,
  Stethoscope,
  HandHeart,
  PawPrint,
  Globe,
  Home,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { C } from "../utils/colors";

/* ─── POSTS ─────────────────────────────────────────────── */
const INITIAL_POSTS = [
  {
    id: 1,
    user: "Ana Torres",
    handle: "@anators_v",
    time: "2h",
    text: "¡Increíble experiencia hoy con @TechoPeru construyendo viviendas en S.J.M! Gracias a todos los voluntarios que se sumaron 🏠🌱 #Voluntariado #Hebras",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&q=80",
    likes: 45,
    comments: 12,
    reposts: 5,
    avColor: "#ab47bc",
    preComments: [
      { user: "Carlos M.", text: "¡Qué buena iniciativa! Estuvo genial." },
      { user: "Lucia R.", text: "Yo también fui, fue una experiencia increíble 💚" },
    ],
  },
  {
    id: 2,
    user: "Carlos Mendoza",
    handle: "@carlos_m",
    time: "5h",
    text: "¿Alguien más va al proyecto de Reforestación este fin de semana en Cusco? Busco grupo para ir juntos. 🌳🌿 #MedioAmbiente #Voluntariado",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80",
    likes: 31,
    comments: 8,
    reposts: 2,
    avColor: "#5a8a1e",
    preComments: [
      { user: "Mateo S.", text: "¡Cuenta conmigo! Te mando DM." },
    ],
  },
  {
    id: 3,
    user: "Banco de Alimentos",
    handle: "@bancoalimentospe",
    time: "1d",
    text: "Este sábado rescatamos 2.4 toneladas de alimentos en el Mercado Central. ¡Gracias a nuestros 38 voluntarios! Juntos somos más fuertes 💪 #ImpactoReal",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80",
    likes: 128,
    comments: 24,
    reposts: 19,
    avColor: "#e65100",
    preComments: [
      { user: "Sofia L.", text: "Fue un honor ser parte de esto ❤️" },
      { user: "Diego P.", text: "La próxima también me apunto!" },
      { user: "Ana Torres", text: "¡Incredible trabajo equipo!" },
    ],
  },
  {
    id: 4,
    user: "Manos Unidas",
    handle: "@manosunidas_pe",
    time: "2d",
    text: "Inauguramos nuestra nueva sala de lectura en Villa El Salvador 📚 Ya son 150 niños que tienen acceso a libros gracias a sus donaciones. ¡GRACIAS! #Educación",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80",
    likes: 204,
    comments: 31,
    reposts: 45,
    avColor: "#6a1b9a",
    preComments: [
      { user: "Prof. Ramirez", text: "Los niños estaban tan emocionados 🥹" },
    ],
  },
];

/* ─── COMUNIDADES ─────────────────────────────────────────── */
const INITIAL_COMUNIDADES = [
  { id: 1,  name: "Techo Perú",        categoria: "Social",          seguidores: 12842, siguiendo: true,  color: "#0094ff", icon: Home },
  { id: 2,  name: "Recicla Perú",      categoria: "Medio Ambiente",  seguidores: 8376,  siguiendo: true,  color: "#14a800", icon: Leaf },
  { id: 3,  name: "Manos Unidas",      categoria: "Salud",           seguidores: 5421,  siguiendo: false, color: "#ff7a00", icon: HandHeart },
  { id: 4,  name: "Educa Jóvenes",     categoria: "Educación",       seguidores: 7215,  siguiendo: true,  color: "#8b5cf6", icon: BookOpen },
  { id: 5,  name: "Patitas Felices",   categoria: "Animales",        seguidores: 3976,  siguiendo: false, color: "#f59e0b", icon: PawPrint },
  { id: 6,  name: "Salud Sin Límites", categoria: "Salud",           seguidores: 6104,  siguiendo: false, color: "#e11d48", icon: Stethoscope },
  { id: 7,  name: "Banco Alimentos",   categoria: "Social",          seguidores: 9830,  siguiendo: true,  color: "#ea580c", icon: Sparkles },
  { id: 8,  name: "Agua Limpia Perú",  categoria: "Medio Ambiente",  seguidores: 4512,  siguiendo: false, color: "#0891b2", icon: Globe },
  { id: 9,  name: "Arte Joven Lima",   categoria: "Educación",       seguidores: 2987,  siguiendo: false, color: "#7c3aed", icon: BookOpen },
  { id: 10, name: "Voluntarios Cusco", categoria: "Social",          seguidores: 5638,  siguiendo: true,  color: "#b45309", icon: Users },
  { id: 11, name: "Verde Amazónico",   categoria: "Medio Ambiente",  seguidores: 7102,  siguiendo: false, color: "#15803d", icon: Leaf },
  { id: 12, name: "Cuidemos Juntos",   categoria: "Animales",        seguidores: 1843,  siguiendo: false, color: "#c2410c", icon: PawPrint },
];

const CATEGORIAS = ["Todas","Social","Medio Ambiente","Educación","Salud","Animales"];

function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export default function Comunidad() {
  const [tab, setTab]           = useState<"para-ti" | "seguir">("para-ti");
  const [categoria, setCategoria] = useState("Todas");
  const [posts, setPosts]       = useState(INITIAL_POSTS);
  const [comunidades, setComunidades] = useState(INITIAL_COMUNIDADES);

  // per-post UI state
  const [likedPosts,    setLikedPosts]    = useState<Set<number>>(new Set());
  const [savedPosts,    setSavedPosts]    = useState<Set<number>>(new Set());
  const [repostedPosts, setRepostedPosts] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [extraComments, setExtraComments] = useState<Record<number, { user: string; text: string }[]>>({});

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, likes: likedPosts.has(id) ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const toggleSave = (id: number) =>
    setSavedPosts(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleRepost = (id: number) => {
    setRepostedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, reposts: repostedPosts.has(id) ? p.reposts - 1 : p.reposts + 1 } : p
    ));
  };

  const toggleComments = (id: number) =>
    setExpandedComments(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const sendComment = (postId: number) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setExtraComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { user: "Tú", text }],
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    if (!expandedComments.has(postId)) toggleComments(postId);
  };

  const toggleFollow = (id: number) =>
    setComunidades(prev => prev.map(c =>
      c.id === id
        ? { ...c, siguiendo: !c.siguiendo, seguidores: c.siguiendo ? c.seguidores - 1 : c.seguidores + 1 }
        : c
    ));

  const comunidadesFiltradas = categoria === "Todas"
    ? comunidades
    : comunidades.filter(c => c.categoria === categoria);

  const siguiendo    = comunidades.filter(c => c.siguiendo);

  /* ── STYLES ── */
  const s = {
    page: { display: "flex", minHeight: "100vh", background: "transparent", gap: 0 } as React.CSSProperties,

    /* Feed column */
    feed: { flex: 1, minWidth: 0, borderRight: `1px solid ${C.border}` } as React.CSSProperties,
    stickyTabs: { display: "flex", background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky" as const, top: 0, zIndex: 20 },
    tab: (on: boolean): React.CSSProperties => ({
      flex: 1, padding: "14px 0", border: "none", cursor: "pointer", background: "transparent",
      fontWeight: 800, fontSize: 15, color: on ? C.greenDark : "#888",
      borderBottom: on ? `3px solid ${C.greenDark}` : "3px solid transparent",
      fontFamily: "'Nunito', sans-serif", transition: "color .15s",
    }),
    feedInner: { padding: "20px 24px", maxWidth: 620, margin: "0 auto" } as React.CSSProperties,

    /* Post card */
    postCard: { background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 18, overflow: "hidden" } as React.CSSProperties,
    postHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 18px 0" } as React.CSSProperties,
    avatar: (color: string): React.CSSProperties => ({
      width: 46, height: 46, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: 18, flexShrink: 0,
    }),
    postText: { padding: "10px 18px 12px", fontSize: 15, lineHeight: 1.6, color: "#1a1a1a" } as React.CSSProperties,
    postImg: { width: "100%", maxHeight: 340, objectFit: "cover" as const, display: "block" },

    /* Action bar */
    actions: { display: "flex", alignItems: "center", gap: 0, padding: "10px 14px", borderTop: `1px solid ${C.border}` } as React.CSSProperties,
    actionBtn: (active?: boolean, activeColor?: string): React.CSSProperties => ({
      display: "flex", alignItems: "center", gap: 5, padding: "7px 10px",
      border: "none", background: "none", cursor: "pointer",
      fontSize: 13, fontWeight: 700, color: active ? activeColor || C.greenDark : "#888",
      borderRadius: 8, fontFamily: "'Nunito', sans-serif",
    }),

    /* Comments section */
    commentsBox: { background: "#f8f9f4", borderTop: `1px solid ${C.border}`, padding: "12px 18px" } as React.CSSProperties,
    commentItem: { display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" } as React.CSSProperties,
    commentBubble: { background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "7px 12px", fontSize: 13, flex: 1, lineHeight: 1.5 } as React.CSSProperties,
    commentInput: { display: "flex", gap: 8, marginTop: 10 } as React.CSSProperties,
    inp: { flex: 1, padding: "10px 14px", borderRadius: 50, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "'Nunito', sans-serif", outline: "none", background: C.white } as React.CSSProperties,
    sendBtn: { width: 38, height: 38, borderRadius: "50%", background: C.greenDark, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as React.CSSProperties,

    /* Right sidebar */
    sidebar: { width: 340, flexShrink: 0, padding: "20px 20px 20px 0" } as React.CSSProperties,
    sideCard: { background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 16, overflow: "hidden" } as React.CSSProperties,
    sideTitle: { padding: "14px 18px", fontWeight: 800, fontSize: 15, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 7 } as React.CSSProperties,

    /* Category chips */
    chip: (on: boolean): React.CSSProperties => ({
      padding: "6px 13px", borderRadius: 50, border: `1px solid ${on ? C.greenDark : C.border}`,
      background: on ? C.greenDark : C.white, color: on ? "#fff" : "#555",
      fontSize: 12, fontWeight: 700, cursor: "pointer",
      fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap" as const,
    }),

    /* Community item */
    comItem: { display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: `1px solid ${C.border}` } as React.CSSProperties,
    followBtn: (on: boolean): React.CSSProperties => ({
      padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 800,
      cursor: "pointer", fontFamily: "'Nunito', sans-serif",
      border: on ? "none" : `1.5px solid ${C.greenDark}`,
      background: on ? C.greenDark : C.white,
      color: on ? "#fff" : C.greenDark,
      display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" as const,
    }),
  };

  /* ── RENDER ── */
  return (
    <div style={s.page}>

      {/* ═══ LEFT: FEED ═══ */}
      <div style={s.feed}>

        {/* Tabs */}
        <div style={s.stickyTabs}>
          <button style={s.tab(tab === "para-ti")} onClick={() => setTab("para-ti")}>Para Ti</button>
          <button style={s.tab(tab === "seguir")} onClick={() => setTab("seguir")}>Comunidades</button>
        </div>

        {/* ── PARA TI ── */}
        {tab === "para-ti" && (
          <div style={s.feedInner}>
            {posts.map(p => {
              const liked   = likedPosts.has(p.id);
              const saved   = savedPosts.has(p.id);
              const reposted = repostedPosts.has(p.id);
              const showCom  = expandedComments.has(p.id);
              const allCom   = [...p.preComments, ...(extraComments[p.id] || [])];

              return (
                <div key={p.id} style={s.postCard}>

                  {/* Header */}
                  <div style={s.postHead}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={s.avatar(p.avColor)}>{p.user[0]}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{p.user}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{p.handle} · {p.time}</div>
                      </div>
                    </div>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Text */}
                  <div style={s.postText}>{p.text}</div>

                  {/* Image */}
                  <img src={p.image} alt="" style={s.postImg} />

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 16, padding: "8px 18px 0", fontSize: 12, color: "#aaa" }}>
                    <span>{p.likes + (liked ? 1 : 0)} me gusta</span>
                    <span style={{ cursor: "pointer", color: showCom ? C.greenDark : "#aaa" }} onClick={() => toggleComments(p.id)}>
                      {allCom.length} comentarios
                    </span>
                    <span>{p.reposts + (reposted ? 1 : 0)} compartidos</span>
                  </div>

                  {/* Actions */}
                  <div style={s.actions}>
                    {/* Like */}
                    <button style={s.actionBtn(liked, "#e11d48")} onClick={() => toggleLike(p.id)}>
                      <Heart size={17} fill={liked ? "#e11d48" : "none"} color={liked ? "#e11d48" : "#888"} />
                      <span>{p.likes + (liked ? 1 : 0)}</span>
                    </button>

                    {/* Comment */}
                    <button style={s.actionBtn(showCom)} onClick={() => toggleComments(p.id)}>
                      <MessageCircle size={17} color={showCom ? C.greenDark : "#888"} />
                      <span>{allCom.length}</span>
                    </button>

                    {/* Repost */}
                    <button style={s.actionBtn(reposted, "#17b26a")} onClick={() => toggleRepost(p.id)}>
                      <Repeat2 size={17} color={reposted ? "#17b26a" : "#888"} />
                      <span>{p.reposts + (reposted ? 1 : 0)}</span>
                    </button>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Save — amarillo */}
                    <button style={s.actionBtn(saved, "#f59e0b")} onClick={() => toggleSave(p.id)}>
                      <Bookmark size={17} fill={saved ? "#f59e0b" : "none"} color={saved ? "#f59e0b" : "#888"} />
                    </button>
                  </div>

                  {/* Comments section */}
                  {showCom && (
                    <div style={s.commentsBox}>
                      {allCom.map((c, i) => (
                        <div key={i} style={s.commentItem}>
                          <div style={{ ...s.avatar(C.greenDark), width: 28, height: 28, fontSize: 12, flexShrink: 0 }}>
                            {c.user[0]}
                          </div>
                          <div style={s.commentBubble}>
                            <span style={{ fontWeight: 800, fontSize: 12 }}>{c.user} </span>
                            <span style={{ color: "#333" }}>{c.text}</span>
                          </div>
                        </div>
                      ))}

                      {/* Input */}
                      <div style={s.commentInput}>
                        <div style={{ ...s.avatar(C.greenDark), width: 32, height: 32, fontSize: 13, flexShrink: 0 }}>T</div>
                        <input
                          style={s.inp}
                          placeholder="Escribe un comentario..."
                          value={commentInputs[p.id] || ""}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && sendComment(p.id)}
                        />
                        <button style={s.sendBtn} onClick={() => sendComment(p.id)}>
                          <Send size={15} color="#fff" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* ── COMUNIDADES TAB ── */}
        {tab === "seguir" && (
          <div style={{ ...s.feedInner, maxWidth: 680 }}>

            {/* Categorías */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {CATEGORIAS.map(c => (
                <button key={c} style={s.chip(categoria === c)} onClick={() => setCategoria(c)}>{c}</button>
              ))}
            </div>

            {/* Siguiendo */}
            {siguiendo.length > 0 && (
              <div style={{ ...s.sideCard, marginBottom: 20 }}>
                <div style={s.sideTitle}>
                  <CheckCircle2 size={17} color={C.greenDark} />
                  Siguiendo ({siguiendo.length})
                </div>
                {comunidadesFiltradas.filter(c => c.siguiendo).map(c => (
                  <ComunidadRow key={c.id} c={c} onToggle={toggleFollow} s={s} />
                ))}
                {comunidadesFiltradas.filter(c => c.siguiendo).length === 0 && (
                  <div style={{ padding: "16px 18px", fontSize: 13, color: "#aaa" }}>No sigues comunidades en esta categoría.</div>
                )}
              </div>
            )}

            {/* Descubrir */}
            <div style={s.sideCard}>
              <div style={s.sideTitle}>
                <TrendingUp size={17} color={C.greenDark} />
                Descubrir comunidades
              </div>
              {comunidadesFiltradas.filter(c => !c.siguiendo).map(c => (
                <ComunidadRow key={c.id} c={c} onToggle={toggleFollow} s={s} />
              ))}
              {comunidadesFiltradas.filter(c => !c.siguiendo).length === 0 && (
                <div style={{ padding: "16px 18px", fontSize: 13, color: "#aaa" }}>¡Ya sigues todas las comunidades de esta categoría!</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ RIGHT SIDEBAR ═══ */}
      <div style={s.sidebar}>

        {/* Mis comunidades */}
        <div style={s.sideCard}>
          <div style={s.sideTitle}>
            <Users size={16} color={C.greenDark} />
            Mis comunidades
          </div>
          {siguiendo.slice(0, 5).map(c => {
            const Icon = c.icon;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={c.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{fmtNum(c.seguidores)} seguidores</div>
                </div>
                <CheckCircle2 size={15} color={C.greenDark} />
              </div>
            );
          })}
          {siguiendo.length === 0 && (
            <div style={{ padding: "14px 18px", fontSize: 13, color: "#aaa" }}>Aún no sigues ninguna comunidad.</div>
          )}
          <button
            style={{ width: "100%", padding: "11px 0", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, color: C.greenDark, fontFamily: "'Nunito', sans-serif" }}
            onClick={() => setTab("seguir")}
          >
            Ver todas las comunidades →
          </button>
        </div>

        {/* Tendencias */}
        <div style={s.sideCard}>
          <div style={s.sideTitle}>
            <TrendingUp size={16} color={C.greenDark} />
            Tendencias
          </div>
          {[
            { tag: "#Voluntariado", posts: "2.4k publicaciones" },
            { tag: "#TechoPeru", posts: "1.1k publicaciones" },
            { tag: "#MedioAmbiente", posts: "876 publicaciones" },
            { tag: "#Educación", posts: "641 publicaciones" },
            { tag: "#Hebras", posts: "429 publicaciones" },
          ].map((t, i) => (
            <div key={i} style={{ padding: "9px 18px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: C.greenDark }}>{t.tag}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{t.posts}</div>
            </div>
          ))}
        </div>

        {/* Voluntarios activos */}
        <div style={s.sideCard}>
          <div style={s.sideTitle}>
            <MapPin size={16} color={C.greenDark} />
            Voluntarios activos
          </div>
          {[
            { name: "Ana Torres", role: "Voluntaria · Lima", av: "#ab47bc" },
            { name: "Carlos Mendoza", role: "Voluntario · Cusco", av: "#5a8a1e" },
            { name: "Lucía Ríos", role: "Voluntaria · Arequipa", av: "#0891b2" },
          ].map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ ...{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }, background: v.av }}>{v.name[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{v.name}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{v.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ─── ComunidadRow ──────────────────────────────────────── */
function ComunidadRow({ c, onToggle, s }: { c: any; onToggle: (id: number) => void; s: any }) {
  const Icon = c.icon;
  return (
    <div style={s.comItem}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={c.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
          {c.siguiendo && <CheckCircle2 size={13} color={C.greenDark} />}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
          <span style={{ background: c.color + "18", color: c.color, fontWeight: 700, borderRadius: 20, padding: "1px 7px", fontSize: 10, marginRight: 6 }}>{c.categoria}</span>
          {fmtNum(c.seguidores)} seguidores
        </div>
      </div>
      <button style={s.followBtn(c.siguiendo)} onClick={() => onToggle(c.id)}>
        {c.siguiendo
          ? <><CheckCircle2 size={12} />Siguiendo</>
          : <>+ Seguir</>}
      </button>
    </div>
  );
}