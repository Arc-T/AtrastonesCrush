export type Goal = { type: number; n: number };
export type Level = { id: number; moves: number; goals: Goal[] };

function make(i: number): Level {
  const count = i < 4 ? 2 : 3;
  const n = Math.min(18, 8 + Math.floor(i * 0.8));
  const types = [(i * 2) % 6, (i * 2 + 3) % 6, (i * 5 + 1) % 6];
  return {
    id: i,
    moves: Math.min(34, 22 + i),
    goals: types.slice(0, count).map((t) => ({ type: t, n })),
  };
}
export const LEVELS: Level[] = Array.from({ length: 15 }, (_, i) => make(i));
