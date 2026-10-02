"use client";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { COLS, ROWS, boosterCells, findMatches, findMoves, randomGrid, type Grid } from "@/lib/engine";
import type { BoosterId } from "@/lib/boosters";
import type { Level } from "@/lib/levels";
import { frame, sleep, fa } from "@/lib/fa";
import { sfx } from "@/lib/audio";

export type Tile = { id: number; type: number; r: number; c: number; pop: boolean };
export type Fx = {
  id: number;
  kind: "flash" | "ring" | "shard" | "text";
  x: number; // cell units (column)
  y: number; // cell units (row)
  type?: number;
  dx?: number;
  dy?: number;
  rot?: number;
  text?: string;
};
export type GoalState = { type: number; total: number; left: number };
export type WinInfo = { score: number; movesLeft: number };
export type Callbacks = {
  onClear: (types: number[]) => void;
  onBooster: (kind: BoosterId) => void;
  onWin: (info: WinInfo) => void;
  onLose: () => void;
};

type G = {
  grid: (Tile | null)[][];
  popping: Tile[];
  fx: Fx[];
  moves: number;
  score: number;
  goals: GoalState[];
  busy: boolean;
  locked: boolean;
  nextId: number;
  token: number;
  armed: BoosterId | null;
  selected: Tile | null;
  hint: number[];
  shake: number;
  banner: { id: number; text: string } | null;
};

const ABORT = Symbol("abort");

export function useMatch3(level: Level, cbs: Callbacks) {
  const g = useRef<G>({
    grid: [], popping: [], fx: [], moves: 0, score: 0, goals: [], busy: true, locked: false,
    nextId: 1, token: 0, armed: null, selected: null, hint: [], shake: 0, banner: null,
  });
  const cb = useRef(cbs);
  cb.current = cbs;
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);

  const types = (): Grid => g.current.grid.map((row) => row.map((t) => (t ? t.type : null)));
  const alive = (token: number) => {
    if (token !== g.current.token) throw ABORT;
  };
  const wait = async (ms: number) => {
    const t = g.current.token;
    await sleep(ms);
    alive(t);
  };

  const addFx = (fx: Omit<Fx, "id">, life = 900) => {
    const id = g.current.nextId++;
    g.current.fx.push({ ...fx, id });
    const t = g.current.token;
    setTimeout(() => {
      if (t !== g.current.token) return;
      g.current.fx = g.current.fx.filter((f) => f.id !== id);
      bump();
    }, life);
  };

  const scheduleHint = () => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    g.current.hint = [];
    hintTimer.current = setTimeout(() => {
      const s = g.current;
      if (s.busy || s.locked) return;
      const mv = findMoves(types());
      if (!mv.length) return;
      const [r, c, r2, c2] = mv[Math.floor(Math.random() * mv.length)];
      const a = s.grid[r][c], b = s.grid[r2][c2];
      s.hint = [a?.id ?? 0, b?.id ?? 0];
      bump();
    }, 6500);
  };

  const mkTile = (type: number, r: number, c: number): Tile => ({ id: g.current.nextId++, type, r, c, pop: false });

  const init = useCallback(() => {
    const s = g.current;
    s.token++;
    if (hintTimer.current) clearTimeout(hintTimer.current);
    const M = randomGrid();
    s.grid = M.map((row, r) => row.map((t, c) => mkTile(t, r, c)));
    s.popping = [];
    s.fx = [];
    s.moves = level.moves;
    s.score = 0;
    s.goals = level.goals.map((x) => ({ type: x.type, total: x.n, left: x.n }));
    s.busy = false;
    s.locked = false;
    s.armed = null;
    s.selected = null;
    s.hint = [];
    s.banner = null;
    bump();
    scheduleHint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    init();
    return () => {
      g.current.token++;
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, [init]);

  /* ---------- core loop ---------- */

  async function clearSet(set: Set<number>, combo: number) {
    const s = g.current;
    const tiles: Tile[] = [];
    set.forEach((k) => {
      const r = Math.floor(k / COLS), c = k % COLS;
      const t = s.grid[r][c];
      if (t) {
        tiles.push(t);
        s.grid[r][c] = null;
      }
    });
    if (!tiles.length) return;
    sfx.match(combo);
    let cx = 0, cy = 0;
    tiles.forEach((t) => {
      t.pop = true;
      s.popping.push(t);
      cx += t.c;
      cy += t.r;
      const goal = s.goals.find((x) => x.type === t.type);
      if (goal && goal.left > 0) goal.left--;
      addFx({ kind: "flash", x: t.c, y: t.r }, 650);
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2, d = 0.7 + Math.random() * 1.1;
        addFx({ kind: "shard", x: t.c, y: t.r, type: t.type, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 0.4, rot: (Math.random() - 0.5) * 540 }, 800);
      }
    });
    cx /= tiles.length;
    cy /= tiles.length;
    const gained = tiles.length * 10 * combo;
    s.score += gained;
    addFx({ kind: "text", x: cx, y: cy, text: `+${fa(gained)}` }, 900);
    if (combo >= 2) {
      const text = combo === 2 ? "عالی!" : combo === 3 ? "فوق‌العاده!" : "افسانه‌ای!";
      const id = s.nextId++;
      s.banner = { id, text };
      setTimeout(() => { if (g.current.banner?.id === id) { g.current.banner = null; bump(); } }, 1000);
      if (combo >= 3) s.shake++;
    }
    cb.current.onClear(tiles.map((t) => t.type));
    bump();
    await wait(300);
    s.popping = s.popping.filter((t) => !tiles.includes(t));
    bump();
  }

  async function settle() {
    const s = g.current;
    const spawned: { t: Tile; row: number }[] = [];
    for (let c = 0; c < COLS; c++) {
      const col: Tile[] = [];
      for (let r = ROWS - 1; r >= 0; r--) if (s.grid[r][c]) col.push(s.grid[r][c]!);
      const miss = ROWS - col.length;
      for (let r = 0; r < ROWS; r++) s.grid[r][c] = null;
      col.forEach((t, i) => {
        t.r = ROWS - 1 - i;
        s.grid[t.r][c] = t;
      });
      for (let k = 0; k < miss; k++) {
        const row = miss - 1 - k;
        const t = mkTile(Math.floor(Math.random() * 6), -(k + 1), c);
        s.grid[row][c] = t;
        spawned.push({ t, row });
      }
    }
    bump();
    await frame();
    await frame();
    alive(s.token);
    spawned.forEach(({ t, row }) => (t.r = row));
    bump();
    await wait(380);
  }

  async function resolve(first: Set<number>) {
    let set = first, combo = 0;
    while (set.size) {
      combo++;
      await clearSet(set, combo);
      await settle();
      set = findMatches(types());
    }
  }

  async function after() {
    const s = g.current;
    if (s.goals.every((x) => x.left === 0)) {
      s.locked = true;
      await wait(450);
      sfx.win();
      cb.current.onWin({ score: s.score, movesLeft: s.moves });
      return;
    }
    if (s.moves <= 0) {
      s.locked = true;
      await wait(350);
      sfx.lose();
      cb.current.onLose();
      return;
    }
    if (!findMoves(types()).length) {
      const tiles = s.grid.flat().filter(Boolean) as Tile[];
      let tries = 0;
      do {
        const t = tiles.map((x) => x.type).sort(() => Math.random() - 0.5);
        tiles.forEach((x, i) => (x.type = t[i]));
        tries++;
      } while ((findMatches(types()).size || !findMoves(types()).length) && tries < 60);
      s.banner = { id: s.nextId++, text: "مخلوط شد" };
      bump();
      await wait(500);
    }
    s.busy = false;
    scheduleHint();
    bump();
  }

  const guard = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      if (e !== ABORT) throw e;
    }
  };

  async function trySwap(a: Tile, b: Tile) {
    const s = g.current;
    if (s.busy || s.locked) return;
    s.busy = true;
    s.selected = null;
    s.hint = [];
    if (hintTimer.current) clearTimeout(hintTimer.current);
    await guard(async () => {
      const sw = () => {
        [a.r, b.r] = [b.r, a.r];
        [a.c, b.c] = [b.c, a.c];
        s.grid[a.r][a.c] = a;
        s.grid[b.r][b.c] = b;
      };
      sw();
      sfx.swap();
      bump();
      await wait(220);
      const m = findMatches(types());
      if (!m.size) {
        sw();
        sfx.bad();
        s.shake++;
        bump();
        await wait(240);
        s.busy = false;
        scheduleHint();
        bump();
        return;
      }
      s.moves--;
      bump();
      await resolve(m);
      await after();
    });
  }

  async function applyBooster(kind: BoosterId, r: number, c: number) {
    const s = g.current;
    s.busy = true;
    s.armed = null;
    s.hint = [];
    cb.current.onBooster(kind);
    sfx.booster();
    await guard(async () => {
      const cells = boosterCells(kind, r, c, types());
      addFx({ kind: "ring", x: c, y: r }, 700);
      s.shake++;
      bump();
      await wait(120);
      await resolve(new Set(cells));
      await after();
    });
  }

  /* ---------- input API ---------- */

  const press = useCallback((r: number, c: number) => {
    const s = g.current;
    if (s.busy || s.locked) return;
    const t = s.grid[r]?.[c];
    if (!t) return;
    scheduleHint();
    if (s.armed) {
      void applyBooster(s.armed, r, c);
      return;
    }
    if (!s.selected) {
      s.selected = t;
      sfx.select();
    } else if (s.selected === t) {
      s.selected = null;
    } else if (Math.abs(s.selected.r - t.r) + Math.abs(s.selected.c - t.c) === 1) {
      const a = s.selected;
      void trySwap(a, t);
    } else {
      s.selected = t;
      sfx.select();
    }
    bump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swipe = useCallback((r: number, c: number, dr: number, dc: number) => {
    const s = g.current;
    if (s.busy || s.locked || s.armed) return;
    const a = s.grid[r]?.[c], b = s.grid[r + dr]?.[c + dc];
    if (a && b) void trySwap(a, b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arm = useCallback((kind: BoosterId | null) => {
    const s = g.current;
    if (s.busy || s.locked) return;
    s.armed = kind;
    s.selected = null;
    bump();
  }, []);

  const addMoves = useCallback((n: number) => {
    const s = g.current;
    s.moves += n;
    s.locked = false;
    s.busy = false;
    scheduleHint();
    bump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = g.current;
  return {
    tiles: [...s.grid.flat().filter(Boolean), ...s.popping] as Tile[],
    fx: s.fx,
    moves: s.moves,
    score: s.score,
    goals: s.goals,
    busy: s.busy,
    armed: s.armed,
    selectedId: s.selected?.id ?? null,
    hint: s.hint,
    shake: s.shake,
    banner: s.banner,
    press,
    swipe,
    arm,
    addMoves,
    restart: init,
  };
}
