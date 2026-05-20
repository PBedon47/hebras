import { C } from "../utils/colors";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function Card({ children, onClick, style }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}