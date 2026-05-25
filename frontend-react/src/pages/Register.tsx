// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { authApi, token } from "../utils/api";
import logo from "../assets/logo.png";
import fondo from "../assets/fondo-hebras.png";

export default function Register({ onRegister }: { onRegister: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", ciudad: "", password: "", confirm: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const handle = async () => {
    if (!form.nombre || !form.email || !form.password) {
      setError("Nombre, correo y contraseña son obligatorios"); return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden"); return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres"); return;
    }
    setLoading(true); setError("");
    try {
      const nombre = `${form.nombre.trim()} ${form.apellido.trim()}`.trim();
      const { user, token: jwt } = await authApi.register({
        nombre, email: form.email, password: form.password,
        ciudad: form.ciudad || undefined,
      });
      token.set(jwt);
      localStorage.setItem("hebras_user", JSON.stringify(user));
      onRegister();
    } catch (e: any) {
      setError(e.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <img src={fondo} alt="" aria-hidden style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", zIndex: 0,
      }} />
      {/* Overlay suave — igual que Login */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(0,0,0,0.18)",
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        width: "min(94vw, 400px)",
        background: "rgba(255,255,255,0.97)",
        borderRadius: 24,
        padding: "30px 32px 26px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
        maxHeight: "95vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <img src={logo} alt="Hebras" style={{ width: 90, height: 90, objectFit: "contain" }} />
        </div>

        <div style={{ fontFamily: "'Caveat',cursive", fontSize: 28, color: C.greenDark, textAlign: "center", marginBottom: 18 }}>
          Crear cuenta
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 12, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Nombre</label>
            <input style={inp} placeholder="Mateo"
              value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Apellido</label>
            <input style={inp} placeholder="Salazar"
              value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
          </div>
        </div>

        <label style={labelStyle}>Correo electrónico</label>
        <input style={inp} type="email" placeholder="tu@correo.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

        <label style={labelStyle}>
          Ciudad <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10 }}>(opcional)</span>
        </label>
        <input style={inp} placeholder="Lima, Cusco..."
          value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />

        <label style={labelStyle}>Contraseña</label>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <input
            style={{ ...inp, marginBottom: 0, paddingRight: 46 }}
            type={showPw ? "text" : "password"}
            placeholder="Mín. 6 caracteres"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />
        </div>

        <label style={labelStyle}>Confirmar contraseña</label>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            style={{ ...inp, marginBottom: 0, paddingRight: 46 }}
            type={showCfm ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
          <EyeBtn show={showCfm} toggle={() => setShowCfm(v => !v)} />
        </div>

        <button onClick={handle} disabled={loading} style={{
          width: "100%", padding: "13px 0", border: "none", borderRadius: 50,
          background: loading ? C.greenMid : C.green,
          color: C.darkBtn, fontWeight: 800, fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Nunito',sans-serif", marginBottom: 10,
        }}>
          {loading ? "Creando cuenta..." : "CREAR CUENTA"}
        </button>

        <button onClick={() => navigate("/login")} style={{
          width: "100%", padding: "11px 0", borderRadius: 50,
          border: `1.5px solid ${C.border}`, background: "transparent",
          cursor: "pointer", fontFamily: "'Nunito',sans-serif",
          fontWeight: 700, fontSize: 14, color: C.text,
        }}>
          YA TENGO CUENTA
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 800,
  color: "#555", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5,
};

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 50,
  border: "1.5px solid #ddddd0", fontSize: 14,
  fontFamily: "'Nunito',sans-serif", marginBottom: 14,
  outline: "none", boxSizing: "border-box",
  background: "#fafaf6", color: "#1a1a1a",
};

// show=true → contraseña visible → ojo ABIERTO
// show=false → contraseña oculta → ojo TACHADO
function EyeBtn({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} style={{
      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
      background: "none", border: "none", cursor: "pointer", padding: 4,
      color: "#888", display: "flex", alignItems: "center",
    }} aria-label={show ? "Ocultar contraseña" : "Ver contraseña"}>
      {show
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
      }
    </button>
  );
}