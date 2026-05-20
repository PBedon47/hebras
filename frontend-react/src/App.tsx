import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ls } from "./utils/storage";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import OngDetail from "./pages/OngDetail";
import Campania from "./pages/Campania";
import Comunidad from "./pages/Comunidad";
import Perfil from "./pages/Perfil";
import Bot from "./pages/Bot";
import Notificaciones from "./pages/Notificaciones";

import Sidebar from "./components/Sidebar";

export default function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = ls.get("hebras_user", null);

    setAuth(!!user);
    setLoading(false);
  }, []);

  if (loading) return null; // evita parpadeo raro

  // 🔐 NO LOGUEADO → LOGIN SIEMPRE
  if (!auth) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setAuth(true)} />}
        />

        <Route
          path="/register"
          element={<Register onRegister={() => setAuth(true)} />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 🟢 LOGUEADO → APP
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ong/:id" element={<OngDetail />} />
          <Route path="/ong/:id/campania/:cid" element={<Campania />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/bot" element={<Bot />} />
          <Route path="/notificaciones" element={<Notificaciones />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}