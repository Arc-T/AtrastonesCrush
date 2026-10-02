"use client";
import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { NINE, asset, type NineKey } from "@/lib/assets";
import { sfx } from "@/lib/audio";

type Spark = { id: number; x: number; y: number; dx: number; dy: number; s: number };
let sid = 0;

type Props = {
  variant?: NineKey;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  /** px scale of the source art. 0.5 = native size, larger = bigger button */
  scale?: number;
  fontSize?: number;
  width?: number | string;
  shine?: boolean;
  pulse?: boolean;
  badge?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * Extendable button: the sprite is cut into 3 parts (left cap, stretchy middle, right cap)
 * so it can be any width without distorting the gems on its tips.
 */
export default function Btn({
  variant = "blue", icon, children, onClick, scale = 0.5, fontSize, width, shine = true, pulse = false,
  badge = false, disabled = false, className = "", ariaLabel,
}: Props) {
  const spec = NINE[variant];
  const ref = useRef<HTMLButtonElement>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const fire = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sfx.click();
    const rc = ref.current!.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rc.left : rc.width / 2;
    const y = e.clientY ? e.clientY - rc.top : rc.height / 2;
    const batch = Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + Math.random() * 0.6;
      const d = 26 + Math.random() * 28;
      return { id: ++sid, x, y, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 8, s: 0.55 + Math.random() * 0.6 };
    });
    setSparks((s) => [...s, ...batch]);
    setTimeout(() => setSparks((s) => s.filter((p) => !batch.includes(p))), 650);
    onClick?.();
  };

  const style = {
    "--src": `url(${asset(spec.src)})`,
    "--L": spec.L,
    "--R": spec.R,
    "--H": spec.H,
    "--s": scale,
    fontSize: fontSize ?? Math.round(spec.H * scale * (variant === "gold" ? 0.16 : 0.27)),
    width,
  } as CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      className={`btn9 btn9-${variant} ${pulse ? "pulse" : ""} ${className}`}
      style={style}
      onClick={fire}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {shine && <span className="shine" aria-hidden />}
      <span className="btn9-in">
        {icon && <span className="btn9-ic">{icon}</span>}
        <span className="btn9-tx">{children}</span>
      </span>
      {badge && <span className="dot" aria-hidden />}
      {sparks.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.id}
          src={asset("fx_3")}
          alt=""
          className="spark"
          style={{ left: p.x, top: p.y, "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--sc": p.s } as CSSProperties}
        />
      ))}
    </button>
  );
}
