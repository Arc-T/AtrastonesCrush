"use client";
import { useState } from "react";
import { LEVELS } from "@/lib/levels";
import { GEMS, asset } from "@/lib/assets";
import { BOOSTERS, BOOSTER_ORDER } from "@/lib/boosters";
import { fa } from "@/lib/fa";
import { useSave } from "@/lib/store";
import { useMatch3 } from "@/hooks/useMatch3";
import Board from "@/components/game/Board";
import Panel from "@/components/ui/Panel";
import Modal from "@/components/ui/Modal";
import Confetti from "@/components/ui/Confetti";
import { StarIcon } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";

type Result = null | { kind: "win"; stars: number; reward: number; score: number } | { kind: "lose" } | { kind: "pause" };

export default function GameScreen({ levelIndex, onMap, onNext }: { levelIndex: number; onMap: () => void; onNext: () => void }) {
  const level = LEVELS[levelIndex];
  const { save, set } = useSave();
  const toast = useToast();
  const [result, setResult] = useState<Result>(null);

  const m3 = useMatch3(level, {
    onClear: (types) =>
      set((s) => {
        const byType = [...s.stats.byType];
        types.forEach((t) => byType[t]++);
        return { ...s, stats: { ...s.stats, cleared: s.stats.cleared + types.length, byType } };
      }),
    onBooster: (k) => set((s) => ({ ...s, boosters: { ...s.boosters, [k]: Math.max(0, s.boosters[k] - 1) }, stats: { ...s.stats, used: s.stats.used + 1 } })),
    onWin: ({ score, movesLeft }) => {
      const stars = movesLeft >= 6 ? 3 : movesLeft >= 3 ? 2 : 1;
      const reward = 50 + movesLeft * 5;
      set((s) => ({
        ...s,
        coins: s.coins + reward,
        gems: s.gems + 1,
        progress: Math.max(s.progress, levelIndex + 1),
        best: { ...s.best, [levelIndex]: Math.max(s.best[levelIndex] ?? 0, score) },
        stars: { ...s.stars, [levelIndex]: Math.max(s.stars[levelIndex] ?? 0, stars) },
        stats: { ...s.stats, wins: s.stats.wins + 1 },
      }));
      setResult({ kind: "win", stars, reward, score });
    },
    onLose: () => setResult({ kind: "lose" }),
  });

  const lowMoves = m3.moves <= 5;
  const hasNext = levelIndex + 1 < LEVELS.length;

  return (
    <section className="screen game">
      <div className="hud">
        <button className="iconbtn" onClick={() => !m3.busy && setResult({ kind: "pause" })} aria-label="مکث">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("ic_settings")} alt="" />
        </button>
        <Panel size="sm" className="pill"><span>مرحله</span><b>{fa(levelIndex + 1)}</b></Panel>
        <Panel size="sm" className={`pill ${lowMoves ? "low" : ""}`}><span>حرکت</span><b key={m3.moves} className="tick">{fa(m3.moves)}</b></Panel>
        <Panel size="sm" className="pill"><span>امتیاز</span><b key={m3.score} className="tick">{fa(m3.score)}</b></Panel>
      </div>

      <div className="goals">
        {m3.goals.map((g) => (
          <div key={g.type} className={`goal ${g.left === 0 ? "done" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(GEMS[g.type].id)} alt={GEMS[g.type].name} />
            <span key={g.left} className="tick">{g.left === 0 ? "✓" : fa(g.left)}</span>
          </div>
        ))}
      </div>

      <div className="stagebox">
        <Board m3={m3} />
        {m3.banner && <div key={m3.banner.id} className="banner">{m3.banner.text}</div>}
        {m3.armed && <div className="armed-hint">یک سنگ را انتخاب کنید</div>}
      </div>

      <div className="boosters">
        {BOOSTER_ORDER.map((k) => {
          const n = save.boosters[k];
          return (
            <button
              key={k}
              className={`pw ${m3.armed === k ? "on" : ""} ${n ? "" : "zero"}`}
              onClick={() => (n ? m3.arm(m3.armed === k ? null : k) : toast("موجودی تمام شد. از فروشگاه بخرید"))}
              aria-label={BOOSTERS[k].name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(BOOSTERS[k].img)} alt="" />
              <i key={n} className="cnt">{fa(n)}</i>
              <span>{BOOSTERS[k].name}</span>
            </button>
          );
        })}
      </div>

      {result?.kind === "win" && (
        <Modal
          title="آفرین!" dismissible={false} overlay={<Confetti />}
          actions={[
            ...(hasNext ? [{ label: "مرحله بعد", variant: "gold" as const, onClick: onNext }] : []),
            { label: "نقشه مرحله‌ها", onClick: onMap },
          ]}
        >
          <div className="stars">
            {[1, 2, 3].map((n) => (
              <span key={n} className={n <= result.stars ? "f" : ""} style={{ animationDelay: `${0.25 + n * 0.28}s` }}><StarIcon /></span>
            ))}
          </div>
          <p>امتیاز: <b>{fa(result.score)}</b></p>
          <p>
            <i className="coin" aria-hidden /> {fa(result.reward)} سکه و ۱ جواهر
          </p>
        </Modal>
      )}
      {result?.kind === "lose" && (
        <Modal
          title="حرکت‌ها تمام شد" dismissible={false}
          actions={[
            ...(save.coins >= 20 ? [{ label: "۵ حرکت اضافه (۲۰ سکه)", variant: "gold" as const, onClick: () => { set((s) => ({ ...s, coins: s.coins - 20 })); m3.addMoves(5); } }] : []),
            { label: "تلاش دوباره", onClick: () => { m3.restart(); } },
            { label: "نقشه مرحله‌ها", variant: "purple" as const, onClick: onMap },
          ]}
          onClose={() => setResult(null)}
        >
          <p>هدف مرحله کامل نشد. دوباره تلاش کنید.</p>
        </Modal>
      )}
      {result?.kind === "pause" && (
        <Modal
          title="مکث" onClose={() => setResult(null)}
          actions={[
            { label: "ادامه", variant: "gold", onClick: () => {} },
            { label: "شروع دوباره", onClick: () => m3.restart() },
            { label: "نقشه مرحله‌ها", variant: "purple", onClick: onMap },
          ]}
        >
          <p>مرحله {fa(levelIndex + 1)}</p>
        </Modal>
      )}
    </section>
  );
}
