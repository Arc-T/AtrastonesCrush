"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

const ToastCtx = createContext<(m: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string) => {
    setMsg({ id: Date.now(), text });
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), 1700);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && <div key={msg.id} className="toast" role="status">{msg.text}</div>}
    </ToastCtx.Provider>
  );
}
