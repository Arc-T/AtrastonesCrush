"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { LEVELS } from "@/lib/levels";
import { asset } from "@/lib/assets";
import { fa } from "@/lib/fa";
import { useSave } from "@/lib/store";
import Medal from "@/components/ui/Medal";
import CurrencyBar from "@/components/ui/CurrencyBar";
import { BackIcon } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

const STEP = 124;

export default function LevelMap({ onBack, onPlay }: { onBack: () => void; onPlay: (i: number) => void }) {
  const { save } = useSave();
  const toast = useToast();
  const scroller = useRef<HTMLDivElement>(null);
  const N = LEVELS.length;
  const H = N * STEP + 170;
  const pts = LEVELS.map((_, i) => ({ x: 50 + Math.sin(i * 1.15) * 27, y: H - 95 - i * STEP }));
  const d = pts.map((p, i) => {
    if (!i) return `M ${p.x} ${p.y}`;
    const a = pts[i - 1], my = (a.y + p.y) / 2;
    return `C ${a.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
  }).join(" ");
  const cur = Math.min(save.progress, N - 1);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = Math.max(0, pts[cur].y - el.clientHeight * 0.55);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="screen map">
      <div className="top">
        <button className="iconbtn back" onClick={onBack} aria-label="بازگشت"><BackIcon /></button>
        <div className="mtitle sm" style={{ backgroundImage: `url(${asset("wood_sign")})` }}>نقشه مرحله‌ها</div>
        <CurrencyBar kind="coins" value={save.coins} />
      </div>
      <div className="mapscroll" ref={scroller}>
        <div className="maptrack" style={{ height: H }}>
          <svg className="mapath" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" width="100%" height={H} aria-hidden>
            <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={d} fill="none" stroke="#e9b95a" strokeWidth="3.5" strokeDasharray="1 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {LEVELS.map((lv, i) => {
            const open = i <= save.progress;
            const state = i < save.progress ? "done" : "current";
            return (
              <button
                key={lv.id}
                className={`node ${open ? "open" : "locked"} ${i === cur ? "cur" : ""}`}
                style={{ left: `${pts[i].x}%`, top: pts[i].y, animationDelay: `${i * 50}ms` } as CSSProperties}
                onClick={() => (open ? onPlay(i) : toast("ابتدا مرحله قبل را ببرید"))}
                aria-label={`مرحله ${fa(i + 1)}`}
              >
                {open ? (
                  <Medal n={i + 1} state={state} stars={save.stars[i] ?? 0} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="lock" src={asset("lv_lock1")} alt="قفل" draggable={false} />
                )}
                {i === cur && <span className="here">بازی کن</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
