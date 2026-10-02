"use client";
import { useEffect, type ReactNode } from "react";
import Panel from "./Panel";
import Btn from "./Btn";
import { asset } from "@/lib/assets";
import type { NineKey } from "@/lib/assets";

export type ModalAction = { label: string; onClick: () => void; variant?: NineKey; keepOpen?: boolean; disabled?: boolean };

export default function Modal({
  title, children, actions = [], onClose, dismissible = true, overlay,
}: { title: string; children?: ReactNode; actions?: ModalAction[]; onClose?: () => void; dismissible?: boolean; overlay?: ReactNode }) {
  useEffect(() => {
    if (!dismissible || !onClose) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [dismissible, onClose]);

  return (
    <div className="modal" onPointerDown={(e) => dismissible && e.target === e.currentTarget && onClose?.()}>
      {overlay}
      <div className="mcard" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mtitle" style={{ backgroundImage: `url(${asset("wood_sign")})` }}>{title}</div>
        <Panel size="lg" className="mbody">
          <div className="mscroll">{children}</div>
          <div className="macts">
            {actions.map((a) => (
              <Btn key={a.label} variant={a.variant ?? "blue"} scale={0.44} width="100%" disabled={a.disabled} onClick={() => { a.onClick(); if (!a.keepOpen) onClose?.(); }}>
                {a.label}
              </Btn>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
