# Atrastones Crush (بازی سنگ‌ها)

Persian (RTL) match-3 game built with **Next.js 14 (App Router) + TypeScript**, using your own art.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure
```
app/                 layout (RTL, Vazirmatn font), globals.css (all visual effects), page
components/
  GameApp.tsx        app shell: screens + dialogs
  Ambient.tsx        scenic background, drifting motes
  Dialogs.tsx        shop, daily reward, missions, achievements, collection, help, settings
  screens/           Menu, LevelMap, GameScreen
  game/Board.tsx     board rendering, swipe/tap input, particles
  ui/                Btn (9-slice, extendable), Panel, Modal, CurrencyBar, Medal, Confetti, Toast
hooks/useMatch3.ts   game loop: swaps, cascades, boosters, hints, shuffle, win/lose
lib/engine.ts        pure match-3 rules (no React) - reusable on a server
lib/levels.ts        level definitions (15 levels)
lib/store.tsx        save data (localStorage today)
public/assets/       sliced sprites from your sheet
```

## Extendable buttons
`<Btn variant="gold|blue|green|purple" width="100%">` uses CSS `border-image` (9-slice):
the gem tips stay crisp and the middle stretches, so a button can be any width.
Text and icons are live, so labels can change or be translated.

## Connecting a NestJS backend later
- `lib/engine.ts` is pure TypeScript: copy it into NestJS to validate moves on the server.
- Replace the localStorage calls in `lib/store.tsx` with API calls (profile, coins, progress, daily reward, leaderboard).
