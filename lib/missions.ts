import type { Save } from "./store";

export type Mission = { id: string; title: string; target: number; reward: number; value: (s: Save) => number };
export const MISSIONS: Mission[] = [
  { id: "m1", title: "۵۰ سنگ را جمع کنید", target: 50, reward: 80, value: (s) => s.stats.cleared },
  { id: "m2", title: "۲ مرحله را ببرید", target: 2, reward: 120, value: (s) => s.stats.wins },
  { id: "m3", title: "از ۳ بوستر استفاده کنید", target: 3, reward: 100, value: (s) => s.stats.used },
];
