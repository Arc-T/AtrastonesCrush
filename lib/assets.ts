export const asset = (name: string) => `/assets/${name}.webp`;

/** The six playable gem types (cut-gem row of the sprite sheet). */
export const GEMS = [
  { id: "stone_r2c1", name: "آمتیست" },
  { id: "stone_r2c2", name: "زمرد" },
  { id: "stone_r2c3", name: "یاقوت کبود" },
  { id: "stone_r2c4", name: "یاقوت سرخ" },
  { id: "stone_r2c5", name: "زرین‌سنگ" },
  { id: "stone_r2c6", name: "کریستال" },
] as const;

/** 9-slice specs for extendable buttons (values are px in the 2x source image). */
export const NINE = {
  gold: { src: "btn_gold", L: 116, R: 116, H: 220 },
  blue: { src: "btn_blue", L: 68, R: 68, H: 124 },
  green: { src: "btn_green", L: 68, R: 68, H: 124 },
  purple: { src: "btn_purple", L: 68, R: 68, H: 124 },
  wide: { src: "btn_wide", L: 68, R: 68, H: 128 },
} as const;
export type NineKey = keyof typeof NINE;
