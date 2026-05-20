import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import { ls } from "../utils/storage";
import logo from "../assets/logo.png";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handle = () => {
    const users = ls.get("h_users", []);

    const found = users.find(
      (u: any) =>
        u.email === form.email &&
        u.password === form.password
    );

    if (!found) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    ls.set("hebras_user", found);
    onLogin();
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 50,
    border: `1px solid ${C.border}`,
    fontSize: 14,
    fontFamily: "'Nunito',sans-serif",
    marginBottom: 12,
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.cream,
      }}
    >
      <div
        style={{
          width: 360,
          background: C.white,
          padding: 30,
          borderRadius: 20,
        }}
      >
        {/* LOGO */}
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

        {error && (
          <div
            style={{
              background: "#fee2e2",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <input
          style={inp}
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          style={inp}
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handle}
          style={{
            width: "100%",
            padding: 13,
            border: "none",
            borderRadius: 50,
            background: C.green,
            color: C.white,
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          INICIAR SESIÓN →
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 50,
            border: `1px solid ${C.border}`,
            background: C.white,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          CREAR CUENTA NUEVA
        </button>
      </div>
    </div>
  );
}