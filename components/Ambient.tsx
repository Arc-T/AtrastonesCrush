import { asset } from "@/lib/assets";
import type { CSSProperties } from "react";

/** Scenic backdrop + drifting golden motes. `blur` is used behind gameplay for readability. */
export default function Ambient({ mode }: { mode: "scene" | "blur" }) {
  return (
    <div className={`ambient ${mode}`} aria-hidden>
      <div className="amb-img" style={{ backgroundImage: `url(${asset("bg_main")})` }} />
      <div className="amb-fade" />
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          className="mote"
          style={{ left: `${(i * 53 + 7) % 100}%`, animationDuration: `${8 + (i % 6) * 1.7}s`, animationDelay: `${-((i * 1.3) % 9)}s`, "--sz": `${2 + (i % 3)}px` } as CSSProperties}
        />
      ))}
    </div>
  );
}
