"use client";
import { useState, type ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import Btn from "@/components/ui/Btn";
import { useToast } from "@/components/ui/Toast";
import { BOOSTERS, BOOSTER_ORDER, type BoosterId } from "@/lib/boosters";
import { GEMS, asset } from "@/lib/assets";
import { MISSIONS } from "@/lib/missions";
import { useSave } from "@/lib/store";
import { fa } from "@/lib/fa";
import { sfx } from "@/lib/audio";

export type DialogKind = "shop" | "daily" | "missions" | "ach" | "coll" | "help" | "settings";

function Row({ img, title, sub, children, locked, progress }: { img: string; title: string; sub?: ReactNode; children?: ReactNode; locked?: boolean; progress?: number }) {
  return (
    <div className={`row ${locked ? "lock" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(img)} alt="" />
      <div className="t">
        {title}
        {sub && <small>{sub}</small>}
        {progress !== undefined && <div className="prog"><div style={{ width: `${Math.min(100, progress * 100)}%` }} /></div>}
      </div>
      {children}
    </div>
  );
}

export default function Dialogs({ kind, onClose }: { kind: DialogKind; onClose: () => void }) {
  const { save, set, reset } = useSave();
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  if (kind === "shop")
    return (
      <Modal title="فروشگاه" onClose={onClose} actions={[{ label: "بستن", onClick: () => {} }]}>
        {BOOSTER_ORDER.map((k: BoosterId) => (
          <Row key={k} img={BOOSTERS[k].img} title={BOOSTERS[k].name} sub={<>{BOOSTERS[k].desc}<span className="stk">موجودی: {fa(save.boosters[k])}</span></>}>
            <Btn
              variant="gold" scale={0.26} fontSize={13} width={92}
              onClick={() => {
                if (save.coins < BOOSTERS[k].price) return toast("سکه کافی نیست");
                sfx.coin();
                set((s) => ({ ...s, coins: s.coins - BOOSTERS[k].price, boosters: { ...s.boosters, [k]: s.boosters[k] + 1 } }));
              }}
            >
              {fa(BOOSTERS[k].price)}
              <i className="coin" aria-label="سکه" />
            </Btn>
          </Row>
        ))}
      </Modal>
    );

  if (kind === "daily") {
    const today = new Date().toDateString();
    const claimed = save.daily === today;
    return (
      <Modal
        title="جوایز روزانه" onClose={onClose}
        actions={[
          claimed
            ? { label: "باشه", onClick: () => {} }
            : { label: "دریافت جایزه", variant: "gold", onClick: () => { sfx.coin(); set((s) => ({ ...s, coins: s.coins + 100, gems: s.gems + 1, daily: today })); toast("جایزه دریافت شد"); } },
        ]}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`bigchest ${claimed ? "" : "wiggle"}`} src={asset("chest_big")} alt="" />
        <p>{claimed ? "جایزه‌ی امروز را گرفته‌اید. فردا دوباره سر بزنید." : "صندوق امروز آماده است: ۱۰۰ سکه و ۱ جواهر"}</p>
      </Modal>
    );
  }

  if (kind === "missions")
    return (
      <Modal title="ماموریت‌ها" onClose={onClose} actions={[{ label: "بستن", onClick: () => {} }]}>
        {MISSIONS.map((m) => {
          const v = Math.min(m.value(save), m.target), done = v >= m.target, got = save.claimed[m.id];
          return (
            <Row key={m.id} img="ic_chest" title={m.title} sub={`${fa(v)} از ${fa(m.target)}`} progress={v / m.target}>
              <Btn
                variant={done && !got ? "gold" : "blue"} scale={0.26} fontSize={12} width={92} disabled={!done || got}
                onClick={() => { sfx.coin(); set((s) => ({ ...s, coins: s.coins + m.reward, claimed: { ...s.claimed, [m.id]: true } })); }}
              >
                {got ? "گرفته شد" : `${fa(m.reward)} سکه`}
              </Btn>
            </Row>
          );
        })}
      </Modal>
    );

  if (kind === "ach") {
    const L = [
      ["bd_star", "اولین پیروزی", save.stats.wins >= 1],
      ["bd_crown", "عبور از ۳ مرحله", save.progress >= 3],
      ["bd_diamond", "جمع‌آوری ۱۰۰ سنگ", save.stats.cleared >= 100],
      ["md_blue", "عبور از ۸ مرحله", save.progress >= 8],
      ["md_silver", "جمع‌آوری ۵۰۰ سنگ", save.stats.cleared >= 500],
      ["md_bronze", "استفاده از ۱۰ بوستر", save.stats.used >= 10],
    ] as const;
    return (
      <Modal title="دستاوردها" onClose={onClose} actions={[{ label: "بستن", onClick: () => {} }]}>
        {L.map(([img, t, ok]) => <Row key={t} img={img} title={t} sub={ok ? "باز شد" : "قفل"} locked={!ok} />)}
      </Modal>
    );
  }

  if (kind === "coll")
    return (
      <Modal title="کلکسیون" onClose={onClose} actions={[{ label: "بستن", onClick: () => {} }]}>
        <div className="coll">
          {GEMS.map((g, i) => (
            <div key={g.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(g.id)} alt="" />
              {g.name}
              <small>{fa(save.stats.byType[i])}</small>
            </div>
          ))}
        </div>
      </Modal>
    );

  if (kind === "help")
    return (
      <Modal title="راهنما" onClose={onClose} actions={[{ label: "متوجه شدم", onClick: () => {} }]}>
        <p>سه سنگ هم‌رنگ یا بیشتر را در یک ردیف یا ستون کنار هم بیاورید.</p>
        <p>یک سنگ را بکشید، یا روی دو سنگ مجاور بزنید تا جابه‌جا شوند.</p>
        <p>پیش از تمام شدن حرکت‌ها، هدف مرحله را کامل کنید. بوسترها حرکت مصرف نمی‌کنند.</p>
      </Modal>
    );

  return (
    <Modal
      title="تنظیمات" onClose={onClose}
      actions={[
        { label: confirmReset ? "مطمئنید؟ دوباره بزنید" : "پاک کردن پیشرفت", variant: "purple", keepOpen: true, onClick: () => { if (confirmReset) { reset(); setConfirmReset(false); toast("پیشرفت پاک شد"); } else setConfirmReset(true); } },
        { label: "بستن", onClick: () => {} },
      ]}
    >
      <div className="row tog">
        <span>صدای بازی</span>
        <button className={`sw ${save.sound ? "on" : ""}`} aria-pressed={save.sound} aria-label="صدا" onClick={() => set((s) => ({ ...s, sound: !s.sound }))} />
      </div>
    </Modal>
  );
}
