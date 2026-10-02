let enabled = true;
let ctx: AudioContext | null = null;
export const setSoundEnabled = (v: boolean) => { enabled = v; };

function tone(freq: number, dur = 0.1, type: OscillatorType = "triangle", vol = 0.05, delay = 0) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx ?? new AC();
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur);
  } catch {}
}

export const sfx = {
  click: () => tone(520, 0.05, "triangle", 0.04),
  select: () => tone(600, 0.05),
  swap: () => tone(440, 0.06),
  bad: () => tone(190, 0.12, "square", 0.03),
  match: (combo: number) => { tone(520 + combo * 110, 0.14); tone(780 + combo * 110, 0.1, "sine", 0.03, 0.05); },
  booster: () => { tone(300, 0.2, "sawtooth", 0.04); tone(900, 0.25, "sine", 0.04, 0.08); },
  coin: () => { tone(988, 0.08, "square", 0.025); tone(1318, 0.14, "square", 0.025, 0.07); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "triangle", 0.05, i * 0.12)),
  lose: () => { tone(260, 0.25, "sawtooth", 0.04); tone(196, 0.35, "sawtooth", 0.04, 0.2); },
};
