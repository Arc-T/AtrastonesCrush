export const fa = (n: number): string => Math.round(n).toLocaleString("fa-IR");
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
