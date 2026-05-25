// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { authApi, token } from "../utils/api";
import logo from "../assets/logo.png";
import fondo from "../assets/fondo-hebras.png";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handle = async () => {
    if (!form.email || !form.password) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    try {
      const { user, token: jwt } = await authApi.login(form);
      token.set(jwt);
      localStorage.setItem("hebras_user", JSON.stringify(user));
      onLogin();
    } catch (e: any) {
      setError(e.message || "Correo o contraseña incorrectos");
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
      {/* Overlay muy suave — solo oscurece un poco para que se lea */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(0,0,0,0.18)",
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        width: "min(92vw, 380px)",
        background: "rgba(255,255,255,0.97)",
        borderRadius: 24,
        padding: "36px 32px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <img src={logo} alt="Hebras" style={{ width: 110, height: 110, objectFit: "contain" }} />
        </div>

        <div style={{ fontFamily: "'Caveat',cursive", fontSize: 30, color: C.greenDark, textAlign: "center", marginBottom: 22 }}>
          ¡Bienvenido de vuelta!
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 12, marginBottom: 14, fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <label style={labelStyle}>Correo electrónico</label>
        <input
          style={inp}
          type="email"
          placeholder="demo@hebras.pe"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onKeyDown={e => e.key === "Enter" && handle()}
        />

        <label style={labelStyle}>Contraseña</label>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            style={{ ...inp, marginBottom: 0, paddingRight: 46 }}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
          <EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />
        </div>

        <button onClick={handle} disabled={loading} style={{
          width: "100%", padding: "13px 0", border: "none", borderRadius: 50,
          background: loading ? C.greenMid : C.green,
          color: C.darkBtn, fontWeight: 800, fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Nunito',sans-serif", marginBottom: 10,
        }}>
          {loading ? "Ingresando..." : "INICIAR SESIÓN →"}
        </button>

        <button onClick={() => navigate("/register")} style={{
          width: "100%", padding: "11px 0", borderRadius: 50,
          border: `1.5px solid ${C.border}`, background: "transparent",
          cursor: "pointer", fontFamily: "'Nunito',sans-serif",
          fontWeight: 700, fontSize: 14, color: C.text,
        }}>
          CREAR CUENTA NUEVA
        </button>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 11, color: C.muted }}>
          Demo: demo@hebras.pe · demo1234
        </div>
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
// show=false → contraseña oculta → ojo CERRADO (tachado)
function EyeBtn({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} style={{
      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
      background: "none", border: "none", cursor: "pointer", padding: 4,
      color: "#888", display: "flex", alignItems: "center",
    }} aria-label={show ? "Ocultar contraseña" : "Ver contraseña"}>
      {show
        /* Contraseña visible → ojo ABIERTO */
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        /* Contraseña oculta → ojo TACHADO */
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
      }
    </button>
  );
}