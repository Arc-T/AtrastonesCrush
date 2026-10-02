export type BoosterId = "hammer" | "whirl" | "bomb" | "rainbow" | "crystal" | "meteor";

export const BOOSTERS: Record<BoosterId, { name: string; img: string; price: number; desc: string }> = {
  hammer: { name: "چکش", img: "pw_hammer", price: 60, desc: "یک سنگ را خرد می‌کند" },
  whirl: { name: "گردباد", img: "pw_whirl", price: 80, desc: "سنگ‌های اطراف را پاک می‌کند" },
  bomb: { name: "بمب", img: "pw_bomb", price: 100, desc: "ناحیه ۳×۳ را منفجر می‌کند" },
  rainbow: { name: "رنگین‌کمان", img: "pw_rainbow", price: 120, desc: "همه‌ی سنگ‌های هم‌رنگ را پاک می‌کند" },
  crystal: { name: "کریستال", img: "pw_crystal", price: 100, desc: "یک ردیف و یک ستون را پاک می‌کند" },
  meteor: { name: "شهاب‌سنگ", img: "pw_meteor", price: 150, desc: "ناحیه‌ی بزرگی را نابود می‌کند" },
};
export const BOOSTER_ORDER: BoosterId[] = ["hammer", "whirl", "bomb", "rainbow", "crystal", "meteor"];
