"use client";
import { useState } from "react";
import { SaveProvider, useSave } from "@/lib/store";
import { LEVELS } from "@/lib/levels";
import { ToastProvider } from "@/components/ui/Toast";
import Ambient from "@/components/Ambient";
import Menu from "@/components/screens/Menu";
import LevelMap from "@/components/screens/LevelMap";
import GameScreen from "@/components/screens/GameScreen";
import Dialogs, { type DialogKind } from "@/components/Dialogs";

type Screen = "menu" | "map" | "game";

function Shell() {
  const { save } = useSave();
  const [screen, setScreen] = useState<Screen>("menu");
  const [level, setLevel] = useState(0);
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const play = (i: number) => { setLevel(i); setScreen("game"); };

  return (
    <div className="stage">
      <main className="app">
        <Ambient mode={screen === "menu" ? "scene" : "blur"} />
        {screen === "menu" && (
          <Menu onStart={() => play(Math.min(save.progress, LEVELS.length - 1))} onMap={() => setScreen("map")} onDialog={setDialog} />
        )}
        {screen === "map" && <LevelMap onBack={() => setScreen("menu")} onPlay={play} />}
        {screen === "game" && (
          <GameScreen key={level} levelIndex={level} onMap={() => setScreen("map")} onNext={() => play(Math.min(level + 1, LEVELS.length - 1))} />
        )}
        {dialog && <Dialogs kind={dialog} onClose={() => setDialog(null)} />}
      </main>
    </div>
  );
}

export default function GameApp() {
  return (
    <SaveProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </SaveProvider>
  );
}
