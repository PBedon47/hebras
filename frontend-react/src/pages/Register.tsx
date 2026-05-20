import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { ls } from "../utils/storage";
import logo from "../assets/logo.png";

export default function Register({ onRegister }: { onRegister: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const inp: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 50, border: `1px solid ${C.border}`,
    fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 12, outline: "none",
  };

  const handle = () => {
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden"); return; }
    const users = ls.get("h_users", []);
    const newUser = { nombre: `${form.nombre} ${form.apellido}`, email: form.email, password: form.password, puntos: 0 };
    ls.set("h_users", [...users, newUser]);
    ls.set("hebras_user", newUser);
    onRegister();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ width: 360, background: C.white, padding: 30, borderRadius: 20 }}>

        <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 24,
  }}
>
  <img
    src={logo}
    alt="Hebras"
    style={{
      width: 150,
      height: 150,
      objectFit: "contain",
    }}
  />
</div>

        <div style={{ fontFamily: "'Caveat',cursive", fontSize: 34, color: C.greenDark, textAlign: "center", marginBottom: 20 }}>Crear cuenta</div>
        <input style={inp} placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input style={inp} placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        <input style={inp} placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inp} type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input style={inp} type="password" placeholder="Confirmar contraseña" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        {error && <div style={{ color: "red", marginBottom: 10, fontSize: 13 }}>{error}</div>}
        <button onClick={handle} style={{ width: "100%", padding: 13, border: "none", borderRadius: 50, background: C.green, color: C.white, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>CREAR CUENTA</button>
        <button onClick={() => navigate("/")} style={{ width: "100%", padding: 12, borderRadius: 50, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>YA TENGO CUENTA</button>
      </div>
    </div>
  );
}