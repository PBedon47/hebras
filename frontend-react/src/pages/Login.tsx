// src/pages/Login.tsx — conectado al backend real
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { authApi, token } from "../utils/api";
import logo from "../assets/logo.png";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 50,
    border: `1px solid ${C.border}`, fontSize: 14,
    fontFamily: "'Nunito',sans-serif", marginBottom: 12, outline: "none",
    boxSizing: "border-box" as const,
  };

  const handle = async () => {
    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { user, token: jwt } = await authApi.login(form);
      // Guardar token JWT y datos del usuario
      token.set(jwt);
      localStorage.setItem("hebras_user", JSON.stringify(user));
      onLogin();
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: C.cream,
    }}>
      <div style={{
        width: 360, background: C.white, padding: 30,
        borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <img src={logo} alt="Hebras" style={{ width: 150, height: 150, objectFit: "contain" }} />
        </div>

        <div style={{ fontFamily: "'Caveat',cursive", fontSize: 32, color: C.greenDark, textAlign: "center", marginBottom: 20 }}>
          ¡Bienvenido de vuelta!
        </div>

        {error && (
          <div style={{
            background: "#fee2e2", color: "#991b1b", padding: "10px 14px",
            borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <input
          style={inp}
          placeholder="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handle()}
        />
        <input
          style={inp}
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handle()}
        />

        <button
          onClick={handle}
          disabled={loading}
          style={{
            width: "100%", padding: 13, border: "none", borderRadius: 50,
            background: loading ? C.greenMid : C.green,
            color: C.darkBtn, fontWeight: 800, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Nunito',sans-serif", marginBottom: 8,
            transition: "background .2s",
          }}
        >
          {loading ? "Ingresando..." : "INICIAR SESIÓN →"}
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%", padding: 12, borderRadius: 50,
            border: `1px solid ${C.border}`, background: C.white,
            cursor: "pointer", fontFamily: "'Nunito',sans-serif",
            fontWeight: 600, fontSize: 14, color: C.text,
          }}
        >
          CREAR CUENTA NUEVA
        </button>

        {/* Demo hint */}
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: C.muted }}>
          Demo: demo@hebras.pe / demo1234
        </div>
      </div>
    </div>
  );
}