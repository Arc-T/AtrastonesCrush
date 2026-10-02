import { asset, GEMS } from "@/lib/assets";
import type { CSSProperties } from "react";

/** Deterministic (SSR-safe) falling gems. */
export default function Confetti({ count = 22 }: { count?: number }) {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const dur = 2.6 + ((i * 7) % 10) / 6;
        const delay = ((i * 13) % 14) / 10;
        const size = 20 + ((i * 5) % 18);
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={asset(GEMS[i % 6].id)} alt="" style={{ left: `${left}%`, width: size, animationDuration: `${dur}s`, animationDelay: `${delay}s`, "--rot": `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg` } as CSSProperties} />
        );
      })}
    </div>
  );
}
