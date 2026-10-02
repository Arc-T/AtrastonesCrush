import { useId } from "react";
import { StarIcon } from "./Icons";
import { fa } from "@/lib/fa";

export type MedalState = "done" | "current" | "open";

/** Hexagonal gem-medal drawn in SVG so any level number can be shown. */
export default function Medal({ n, state, stars }: { n: number; state: MedalState; stars: number }) {
  const uid = useId().replace(/:/g, "");
  const pal =
    state === "current"
      ? { a: "#7de6a4", b: "#1e8a54", c: "#0d4a2c" }
      : { a: "#6fa6ff", b: "#2a5fcf", c: "#12307a" };
  const hex = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    }).join(" ");
  return (
    <svg viewBox="0 0 100 112" className={`medal ${state}`} aria-hidden>
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a0" /><stop offset=".5" stopColor="#d9962f" /><stop offset="1" stopColor="#7a4a14" />
        </linearGradient>
        <radialGradient id={`f${uid}`} cx=".4" cy=".3" r=".9">
          <stop offset="0" stopColor={pal.a} /><stop offset=".55" stopColor={pal.b} /><stop offset="1" stopColor={pal.c} />
        </radialGradient>
      </defs>
      <polygon points={hex(47)} fill={`url(#g${uid})`} stroke="#4a2a08" strokeWidth="2" />
      <polygon points={hex(39)} fill="#2a1a08" />
      <polygon points={hex(35)} fill={`url(#f${uid})`} />
      <polygon points={`50,15 ${hex(35).split(" ")[1]} 50,50`} fill="#fff" opacity=".1" />
      <polygon points={`50,15 ${hex(35).split(" ")[5]} 50,50`} fill="#fff" opacity=".18" />
      <polygon points={hex(35)} fill="none" stroke="#ffe9b0" strokeOpacity=".5" strokeWidth="1.2" />
      <text x="50" y="62" textAnchor="middle" fontSize={n > 9 ? 30 : 36} fontWeight="800" fill="#fff3cf" stroke="#3a2205" strokeWidth="3" paintOrder="stroke" fontFamily="Vazirmatn, sans-serif">
        {fa(n)}
      </text>
      {state === "done" &&
        [0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${26 + i * 22}, ${i === 1 ? 84 : 89}) scale(1.05)`} style={{ color: i < stars ? "#ffc23c" : "#51485a" }}>
            <StarIcon width="24" height="24" stroke="#4a2a08" strokeWidth="1.2" />
          </g>
        ))}
    </svg>
  );
}
