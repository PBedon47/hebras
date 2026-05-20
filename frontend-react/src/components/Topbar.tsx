import { useNavigate } from "react-router-dom";
import { C } from "../utils/colors";
import bot from "../assets/bot.png";
import logo from "../assets/logo.png";
import { useState } from "react";

import {
  Bell,
  Search,
  ArrowLeft,
} from "lucide-react";

type Props = {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
};

export default function Topbar({
  title,
  showBack,
  showSearch = true,
}: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* IZQUIERDA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: C.text,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'Nunito',sans-serif",
            }}
          >
            <ArrowLeft size={22} />
          </button>
        )}

        {title && (
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              fontFamily: "'Nunito',sans-serif",
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* CENTRO */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
  }}
>
  {/* LOGO SOLO MÓVIL */}
  {showSearch && window.innerWidth <= 768 && (
  <img
    src={logo}
    alt="Hebras"
    style={{
      width: 42,
      height: 42,
      objectFit: "contain",
    }}
  />
)}

  {/* SEARCH */}
  {showSearch && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#f5f5ec",
        border: `1px solid ${C.border}`,
        borderRadius: 50,
        padding: "8px 16px",
        fontSize: 13,
        color: C.muted,
        minWidth: window.innerWidth <= 768 ? 150 : 260,
        cursor: "pointer",
        fontFamily: "'Nunito',sans-serif",
      }}
    >
      <Search size={16} />

      <input
        id="search"
        name="search"
        type="text"
        placeholder="Buscar ONG o área..."
        value={search}
        onChange={(e) => {
        const value = e.target.value;

        setSearch(value);

        if (value.trim() === "") {
          navigate("/");
        } else {
          navigate(`/?search=${value}`);
        }
      }}
  
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          width: "100%",
          fontSize: 13,
          fontFamily: "'Nunito', sans-serif",
          color: C.text,
        }}
      />
    </div>
  )}
</div>

      {/* DERECHA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: window.innerWidth <= 768 ? 14 : 20,
          marginLeft:
            window.innerWidth <= 768 ? 12 : 0,
        }}
      >
        {/* CAMPANITA */}
        <div
          onClick={() => navigate("/notificaciones")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell
            size={26}
            color={C.greenDark}
            strokeWidth={2.2}
          />
        </div>

        {/* BOT */}
        <img
          src={bot}
          alt="Bot"
          onClick={() => navigate("/bot")}
          style={{
            width: 58,
            height: 58,
            objectFit: "contain",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
} 