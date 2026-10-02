"use client";
import { asset } from "@/lib/assets";
import { fa } from "@/lib/fa";
import { useCountUp } from "@/hooks/useCountUp";

export default function CurrencyBar({ kind, value, onPlus }: { kind: "coins" | "gems"; value: number; onPlus?: () => void }) {
  const { val, bumped } = useCountUp(value);
  return (
    <div className={`cbar ${bumped ? "bump" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(kind === "coins" ? "bar_coins_blank" : "bar_gems_blank")} alt={kind === "coins" ? "سکه" : "جواهر"} draggable={false} />
      <span className="num">{fa(val)}</span>
      <button className="plus" onClick={onPlus} aria-label="افزودن" />
    </div>
  );
}
