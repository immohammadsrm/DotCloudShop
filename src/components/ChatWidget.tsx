"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { site } from "@/lib/site";
import { TelegramIcon, WhatsAppIcon } from "./Icons";

/** Bottom-right floating chat button that opens Telegram / WhatsApp options. */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Show a small "Need help?" bubble once, a few seconds after landing
  useEffect(() => {
    if (sessionStorage.getItem("chat-hint-seen")) return;
    const show = setTimeout(() => setHint(true), 6000);
    const hide = setTimeout(() => {
      setHint(false);
      sessionStorage.setItem("chat-hint-seen", "1");
    }, 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    setHint(false);
    sessionStorage.setItem("chat-hint-seen", "1");
  };

  return (
    <div ref={box} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="dropdown-in w-[290px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#131216]/95 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.85),0_0_34px_-12px_rgba(249,115,22,0.5)] backdrop-blur-xl">
          <div className="relative px-4 pb-3 pt-4" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.22), rgba(249,115,22,0.02))" }}>
            <div className="top-line" />
            <p className="font-display text-[15px] font-bold text-white">Chat with {site.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/55">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Online · we usually reply in minutes
            </p>
          </div>
          <div className="space-y-2 p-3">
            <a href={site.contact.telegram} target="_blank" rel="noopener noreferrer" className="chat-option" style={{ "--brand": "#229ED9" } as React.CSSProperties}>
              <span className="chat-option-icon"><TelegramIcon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-white">Telegram</span>
                <span className="block truncate text-[11px] text-white/45">{site.contact.telegramHandle}</span>
              </span>
            </a>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="chat-option" style={{ "--brand": "#25D366" } as React.CSSProperties}>
              <span className="chat-option-icon"><WhatsAppIcon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-white">WhatsApp</span>
                <span className="block truncate text-[11px] text-white/45">{site.contact.phone}</span>
              </span>
            </a>
          </div>
        </div>
      )}

      <div className="relative flex items-center gap-3">
        {hint && !open && (
          <button
            type="button"
            onClick={toggle}
            className="dropdown-in whitespace-nowrap rounded-xl border border-white/[0.09] bg-[#131216]/95 px-3 py-2 text-[12px] font-medium text-white/80 shadow-lg backdrop-blur-xl"
          >
            Need help? Chat with us 👋
          </button>
        )}
        <button type="button" onClick={toggle} aria-label={open ? "Close chat options" : "Chat with us"} aria-expanded={open} className="chat-fab">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
