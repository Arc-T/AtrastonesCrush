"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { BoosterId } from "./boosters";
import { setSoundEnabled } from "./audio";

export type Save = {
  coins: number;
  gems: number;
  progress: number;
  best: Record<number, number>;
  stars: Record<number, number>;
  boosters: Record<BoosterId, number>;
  stats: { cleared: number; wins: number; used: number; byType: number[] };
  daily: string;
  sound: boolean;
  claimed: Record<string, boolean>;
};

export const DEFAULT_SAVE: Save = {
  coins: 300,
  gems: 5,
  progress: 0,
  best: {},
  stars: {},
  boosters: { hammer: 2, whirl: 2, bomb: 2, rainbow: 1, crystal: 1, meteor: 1 },
  stats: { cleared: 0, wins: 0, used: 0, byType: [0, 0, 0, 0, 0, 0] },
  daily: "",
  sound: true,
  claimed: {},
};

const KEY = "atrastones-crush:v2";
type Ctx = { save: Save; set: (fn: (s: Save) => Save) => void; reset: () => void; ready: boolean };
const SaveCtx = createContext<Ctx | null>(null);

export function SaveProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<Save>(DEFAULT_SAVE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSave({ ...DEFAULT_SAVE, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    setSoundEnabled(save.sound);
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch {}
  }, [save, ready]);

  const set = useCallback((fn: (s: Save) => Save) => setSave((s) => fn(s)), []);
  const reset = useCallback(() => setSave(DEFAULT_SAVE), []);
  return <SaveCtx.Provider value={{ save, set, reset, ready }}>{children}</SaveCtx.Provider>;
}

export function useSave() {
  const v = useContext(SaveCtx);
  if (!v) throw new Error("useSave must be used inside <SaveProvider>");
  return v;
}
