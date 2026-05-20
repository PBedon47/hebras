import { useNavigate, useLocation } from "react-router-dom";
import { C } from "../utils/colors";
import logo from "../assets/logo.png";

import {
  IconHome,
  IconUsers,
  IconUserCircle,
} from "@tabler/icons-react";

const NAV = [
  {
    path: "/",
    label: "Inicio",
    icon: <IconHome size={22} />,
  },
  {
    path: "/comunidad",
    label: "Comunidad",
    icon: <IconUsers size={22} />,
  },
  {
    path: "/perfil",
    label: "Mi perfil",
    icon: <IconUserCircle size={22} />,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside
  className="sidebar"
  style={{
    width: window.innerWidth <= 768 ? "100%" : 240,
    height: window.innerWidth <= 768 ? 90 : "100vh",
    position: window.innerWidth <= 768 ? "fixed" : "sticky",
    bottom: window.innerWidth <= 768 ? 0 : undefined,
    left: 0,
    background: C.white,
    borderTop:
      window.innerWidth <= 768
        ? `1px solid ${C.border}`
        : "none",
    borderRight:
      window.innerWidth > 768
        ? `1px solid ${C.border}`
        : "none",
    display: "flex",
    flexDirection:
      window.innerWidth <= 768 ? "row" : "column",
    justifyContent:
      window.innerWidth <= 768
        ? "space-around"
        : "flex-start",
    alignItems: "center",
    zIndex: 100,
  }}
>
      
    {/* Logo */}
{window.innerWidth > 768 && (
  <div
    style={{
      padding: "24px 20px 20px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    }}
  >
    <img
      src={logo}
      alt="Hebras"
      style={{
        width: 120,
        height: 120,
        objectFit: "contain",
      }}
    />
  </div>
)}
      {/* Nav items */}
      <nav
  style={{
    padding: window.innerWidth <= 768 ? 0 : "16px 12px",
    flex: 1,
    display: "flex",
    flexDirection:
      window.innerWidth <= 768 ? "row" : "column",
    justifyContent:
      window.innerWidth <= 768
        ? "space-around"
        : "flex-start",
    alignItems: "center",
    gap: 10,
    width: "100%",
  }}
>
  {NAV.map((n) => {
    const active = pathname === n.path;

    return (
      <button
        key={n.path}
        onClick={() => navigate(n.path)}
        style={{
          display: "flex",
          flexDirection:
            window.innerWidth <= 768
              ? "column"
              : "row",
          alignItems: "center",
          justifyContent:
  window.innerWidth <= 768
    ? "center"
    : "flex-start",
          gap: 12,
          padding:
            window.innerWidth <= 768
              ? "6px 10px"
              : "14px 18px",
          borderRadius: 16,
          border: active
            ? `2px solid ${C.darkBtn}`
            : "2px solid transparent",
          background: active
            ? "#dfe8c8"
            : "transparent",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 15,
          color: active
            ? C.greenDark
            : "#5f6773",
          fontFamily: "'Nunito', sans-serif",
          width: window.innerWidth <= 768 ? 90 : "100%",
minHeight: 58,
        }}
      >
        <div
        style={{
          width: 26,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {n.icon}
      </div>

      <span>{n.label}</span>
      </button>
    );
  })}
</nav>
    </aside>
  );
}