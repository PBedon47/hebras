import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FAQS, getBotResponse } from "../data/bot";
import { C } from "../utils/colors";

type Msg = { text: string; from: "bot" | "user" };

const FAQ_CHIPS = [
  "¿La ONG es confiable?", "¿Sirve para prácticas?", "Sin experiencia previa",
  "¿Es gratis?", "No hay respuesta", "¿Cómo restablecer clave?",
  "Voluntariado cerca", "¿Qué necesito para postular?",
];

export default function Bot() {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([
    { text: "¡Hola! Soy el asistente virtual de HEBRAS. ¿En qué te puedo ayudar hoy? Puedes seleccionar una de las preguntas frecuentes o escribir la tuya.", from: "bot" },
  ]);
  const [inp, setInp] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addMsg = (text: string, from: "bot" | "user") => setMsgs((prev) => [...prev, { text, from }]);

  const sendMsg = () => {
    if (!inp.trim()) return;
    const q = inp.trim();
    setInp("");
    addMsg(q, "user");
    setTimeout(() => addMsg(getBotResponse(q), "bot"), 700);
  };

  const askFaq = (i: number) => {
    addMsg(FAQS[i].q, "user");
    setTimeout(() => addMsg(FAQS[i].a, "bot"), 700);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.cream }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Asistente HEBRAS</div>
          <div style={{ fontSize: 11, color: C.greenDark }}>● En línea</div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: 16 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.from === "bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px", fontSize: 13, lineHeight: 1.6, background: m.from === "bot" ? C.white : C.green, color: m.from === "bot" ? C.text : C.white, border: m.from === "bot" ? `1px solid ${C.border}` : "none", alignSelf: m.from === "bot" ? "flex-start" : "flex-end" }}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* FAQ chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 14px 12px" }}>
        {FAQ_CHIPS.map((chip, i) => (
          <div key={i} onClick={() => askFaq(i)} style={{ padding: "6px 12px", borderRadius: 50, border: `1px solid ${C.green}`, color: C.greenDark, background: C.white, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            {chip}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: "10px 14px", background: C.white, borderTop: `1px solid ${C.border}` }}>
        <input
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMsg(); }}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 50, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none" }}
        />
        <button onClick={sendMsg} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: C.green, color: C.white, cursor: "pointer", fontSize: 16 }}>➤</button>
      </div>
    </div>
  );
}