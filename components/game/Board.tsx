"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { COLS, ROWS } from "@/lib/engine";
import { GEMS, asset } from "@/lib/assets";
import type { useMatch3 } from "@/hooks/useMatch3";

type M3 = ReturnType<typeof useMatch3>;

export default function Board({ m3 }: { m3: M3 }) {
  const wrap = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [cs, setCs] = useState(44);
  const down = useRef<{ r: number; c: number; x: number; y: number; swiped: boolean } | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setCs(Math.max(30, Math.floor(Math.min((el.clientWidth - 20) / COLS, (el.clientHeight - 20) / ROWS))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cell = (e: PointerEvent) => {
    const rc = grid.current!.getBoundingClientRect();
    const c = Math.floor((e.clientX - rc.left) / cs), r = Math.floor((e.clientY - rc.top) / cs);
    return r >= 0 && r < ROWS && c >= 0 && c < COLS ? { r, c } : null;
  };
  const onDown = (e: PointerEvent) => {
    const p = cell(e);
    if (!p) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    down.current = { ...p, x: e.clientX, y: e.clientY, swiped: false };
  };
  const onMove = (e: PointerEvent) => {
    const d = down.current;
    if (!d || d.swiped) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < cs * 0.35) return;
    d.swiped = true;
    const horiz = Math.abs(dx) >= Math.abs(dy);
    m3.swipe(d.r, d.c, horiz ? 0 : Math.sign(dy), horiz ? Math.sign(dx) : 0);
  };
  const onUp = () => {
    const d = down.current;
    down.current = null;
    if (d && !d.swiped) m3.press(d.r, d.c);
  };

  const shakeCls = m3.shake ? `shake${m3.shake % 2}` : "";

  return (
    <div className="boardwrap" ref={wrap}>
      <div className={`board ${shakeCls} ${m3.armed ? "armed" : ""}`}>
        <div
          ref={grid}
          className="grid"
          style={{ "--cs": `${cs}px`, width: cs * COLS, height: cs * ROWS } as CSSProperties}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (down.current = null)}
        >
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const r = Math.floor(i / COLS), c = i % COLS;
            return (r + c) % 2 === 0 ? <i key={i} className="cellbg" style={{ "--r": r, "--c": c } as CSSProperties} /> : null;
          })}
          {m3.tiles.map((t) => (
            <div
              key={t.id}
              className={`tile ${t.pop ? "pop" : ""} ${m3.selectedId === t.id ? "sel" : ""} ${m3.hint.includes(t.id) ? "hint" : ""}`}
              style={{ "--r": t.r, "--c": t.c } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(GEMS[t.type].id)} alt="" draggable={false} />
            </div>
          ))}
          {m3.fx.map((f) => {
            const style = { "--x": f.x, "--y": f.y, "--dx": f.dx ?? 0, "--dy": f.dy ?? 0, "--rot": `${f.rot ?? 0}deg` } as CSSProperties;
            if (f.kind === "text") return <span key={f.id} className="fx fx-text" style={style}>{f.text}</span>;
            if (f.kind === "shard")
              // eslint-disable-next-line @next/next/no-img-element
              return <img key={f.id} className="fx fx-shard" style={style} src={asset(GEMS[f.type ?? 0].id)} alt="" />;
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={f.id} className={`fx fx-${f.kind}`} style={style} src={asset(f.kind === "ring" ? "fx_2" : "fx_3")} alt="" />;
          })}
        </div>
      </div>
    </div>
  );
}
