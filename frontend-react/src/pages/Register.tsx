// src/pages/Register.tsx — conectado al backend real
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { authApi, token } from "../utils/api";
import logo from "../assets/logo.png";

export default function Register({ onRegister }: { onRegister: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", ciudad: "",
    password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 50,
    border: `1px solid ${C.border}`, fontSize: 14,
    fontFamily: "'Nunito',sans-serif", marginBottom: 12, outline: "none",
    boxSizing: "border-box" as const,
  };

  const handle = async () => {
    if (!form.nombre || !form.email || !form.password) {
      setError("Nombre, correo y contraseña son obligatorios");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nombre = `${form.nombre.trim()} ${form.apellido.trim()}`.trim();
      const { user, token: jwt } = await authApi.register({
        nombre,
        email: form.email,
        password: form.password,
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
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: C.cream,
    }}>
      <div style={{
        width: 380, background: C.white, padding: 30,
        borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <img src={logo} alt="Hebras" style={{ width: 120, height: 120, objectFit: "contain" }} />
        </div>

        <div style={{ fontFamily: "'Caveat',cursive", fontSize: 32, color: C.greenDark, textAlign: "center", marginBottom: 20 }}>
          Crear cuenta
        </div>

        {error && (
          <div style={{
            background: "#fee2e2", color: "#991b1b", padding: "10px 14px",
            borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
          <input style={{ ...inp, marginBottom: 0, flex: 1 }} placeholder="Nombre"
            value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input style={{ ...inp, marginBottom: 0, flex: 1 }} placeholder="Apellido"
            value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        </div>
        <div style={{ height: 12 }} />

        <input style={inp} placeholder="Correo electrónico" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inp} placeholder="Ciudad (opcional)"
          value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        <input style={inp} type="password" placeholder="Contraseña (mín. 6 caracteres)"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input style={inp} type="password" placeholder="Confirmar contraseña"
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handle()} />

        <button
          onClick={handle}
          disabled={loading}
          style={{
            width: "100%", padding: 13, border: "none", borderRadius: 50,
            background: loading ? C.greenMid : C.green,
            color: C.darkBtn, fontWeight: 800, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Nunito',sans-serif", marginBottom: 8,
          }}
        >
          {loading ? "Creando cuenta..." : "CREAR CUENTA"}
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%", padding: 12, borderRadius: 50,
            border: `1px solid ${C.border}`, background: C.white,
            cursor: "pointer", fontFamily: "'Nunito',sans-serif",
            fontWeight: 600, fontSize: 14, color: C.text,
          }}
        >
          YA TENGO CUENTA
        </button>
      </div>
    </div>
  );
}