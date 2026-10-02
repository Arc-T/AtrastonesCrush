"use client";
import { asset } from "@/lib/assets";
import { fa } from "@/lib/fa";
import { LEVELS } from "@/lib/levels";
import { MISSIONS } from "@/lib/missions";
import { useSave } from "@/lib/store";
import Btn from "@/components/ui/Btn";
import CurrencyBar from "@/components/ui/CurrencyBar";
import { CartIcon, ClipboardIcon, GiftIcon, PlayIcon } from "@/components/ui/Icons";
import type { DialogKind } from "@/components/Dialogs";

export default function Menu({ onStart, onMap, onDialog }: { onStart: () => void; onMap: () => void; onDialog: (d: DialogKind) => void }) {
  const { save } = useSave();
  const cur = Math.min(save.progress, LEVELS.length - 1);
  const dailyReady = save.daily !== new Date().toDateString();
  const missionReady = MISSIONS.some((m) => m.value(save) >= m.target && !save.claimed[m.id]);

  return (
    <section className="screen menu">
      <div className="top">
        <button className="iconbtn" onClick={() => onDialog("settings")} aria-label="تنظیمات">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("ic_settings")} alt="" />
        </button>
        <CurrencyBar kind="gems" value={save.gems} onPlus={() => onDialog("shop")} />
        <CurrencyBar kind="coins" value={save.coins} onPlus={() => onDialog("shop")} />
      </div>

      <div className="logo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src={asset("logo")} alt="بازی سنگ‌ها" draggable={false} />
        {[["18%", "22%", "0s"], ["78%", "16%", "-1.1s"], ["52%", "8%", "-2.2s"], ["88%", "58%", "-.6s"]].map(([l, t, d], i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} className="twinkle" src={asset("fx_3")} alt="" style={{ left: l, top: t, animationDelay: d }} />
        ))}
      </div>

      <div className="menu-btns">
        <Btn variant="gold" scale={0.52} width="100%" icon={<PlayIcon />} pulse onClick={onStart}>
          شروع بازی
        </Btn>
        <div className="resume">ادامه از مرحله {fa(cur + 1)}</div>
        <Btn variant="blue" width="86%" icon={<CartIcon />} onClick={() => onDialog("shop")}>فروشگاه</Btn>
        <Btn variant="green" width="86%" icon={<GiftIcon />} badge={dailyReady} onClick={() => onDialog("daily")}>جوایز روزانه</Btn>
        <Btn variant="purple" width="86%" icon={<ClipboardIcon />} badge={missionReady} onClick={() => onDialog("missions")}>ماموریت‌ها</Btn>
        <button className="linkbtn" onClick={onMap}>انتخاب مرحله</button>
      </div>

      <nav className="nav">
        {([["ach", "ic_trophy", "دستاوردها"], ["coll", "ic_gem2", "کلکسیون"], ["help", "ic_help", "راهنما"]] as const).map(([k, ic, label]) => (
          <button key={k} className="navbtn" onClick={() => onDialog(k)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(ic)} alt="" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}
