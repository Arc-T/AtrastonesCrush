import type { ReactNode, CSSProperties } from "react";

/** Stretchable dark framed panel (9-slice). */
export default function Panel({
  children, className = "", style, size = "md",
}: { children?: ReactNode; className?: string; style?: CSSProperties; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`panel panel-${size} ${className}`} style={style}>
      {children}
    </div>
  );
}
