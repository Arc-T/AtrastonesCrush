import type { BoosterId } from "./boosters";

export const COLS = 7;
export const ROWS = 8;
export const KINDS = 6;
export type Grid = (number | null)[][];

const idx = (r: number, c: number) => r * COLS + c;

/** Cells (as r*COLS+c) that belong to a horizontal or vertical run of 3+. */
export function findMatches(M: Grid): Set<number> {
  const out = new Set<number>();
  for (let r = 0; r < ROWS; r++) {
    let run = 1;
    for (let c = 1; c <= COLS; c++) {
      if (c < COLS && M[r][c] !== null && M[r][c] === M[r][c - 1]) run++;
      else {
        if (run >= 3) for (let k = 1; k <= run; k++) out.add(idx(r, c - k));
        run = 1;
      }
    }
  }
  for (let c = 0; c < COLS; c++) {
    let run = 1;
    for (let r = 1; r <= ROWS; r++) {
      if (r < ROWS && M[r][c] !== null && M[r][c] === M[r - 1][c]) run++;
      else {
        if (run >= 3) for (let k = 1; k <= run; k++) out.add(idx(r - k, c));
        run = 1;
      }
    }
  }
  return out;
}

/** Every adjacent swap that creates a match: [r, c, r2, c2]. */
export function findMoves(M: Grid): [number, number, number, number][] {
  const moves: [number, number, number, number][] = [];
  const swap = (a: number, b: number, c: number, d: number) => {
    const t = M[a][b];
    M[a][b] = M[c][d];
    M[c][d] = t;
  };
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr, c2 = c + dc;
        if (r2 >= ROWS || c2 >= COLS) continue;
        swap(r, c, r2, c2);
        if (findMatches(M).size > 0) moves.push([r, c, r2, c2]);
        swap(r, c, r2, c2);
      }
  return moves;
}

/** A fresh board with no ready-made matches and at least one legal move. */
export function randomGrid(): number[][] {
  for (;;) {
    const M: number[][] = [];
    for (let r = 0; r < ROWS; r++) {
      M.push([]);
      for (let c = 0; c < COLS; c++) {
        let t: number;
        do t = Math.floor(Math.random() * KINDS);
        while (
          (c >= 2 && M[r][c - 1] === t && M[r][c - 2] === t) ||
          (r >= 2 && M[r - 1][c] === t && M[r - 2][c] === t)
        );
        M[r].push(t);
      }
    }
    if (findMoves(M).length) return M;
  }
}

const OFFSETS: Partial<Record<BoosterId, [number, number][]>> = {
  hammer: [[0, 0]],
  whirl: [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]],
  bomb: [-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => [i, j] as [number, number])),
  meteor: [-2, -1, 0, 1, 2].flatMap((i) =>
    [-2, -1, 0, 1, 2].filter((j) => Math.abs(i) + Math.abs(j) < 4).map((j) => [i, j] as [number, number]),
  ),
};

export function boosterCells(kind: BoosterId, r: number, c: number, M: Grid): number[] {
  const set = new Set<number>();
  if (kind === "rainbow") {
    const t = M[r][c];
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) if (M[i][j] === t) set.add(idx(i, j));
  } else if (kind === "crystal") {
    for (let j = 0; j < COLS; j++) set.add(idx(r, j));
    for (let i = 0; i < ROWS; i++) set.add(idx(i, c));
  } else {
    for (const [dr, dc] of OFFSETS[kind] ?? []) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) set.add(idx(rr, cc));
    }
  }
  return [...set];
}
