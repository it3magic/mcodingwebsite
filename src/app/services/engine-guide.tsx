"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { ENGINES, type Engine } from "./service-config";

/** Render a description, highlighting the leading "x" in model codes like x20d as a variable. */
export function highlightX(text: string) {
  return text.split(/(x\d{2}[a-z])/gi).map((part, i) => {
    const m = /^x(\d{2}[a-z])$/i.exec(part);
    return m ? (
      <span key={i} className="font-semibold text-gray-200">
        <span className="font-bold text-blue-400">x</span>
        {m[1]}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

const F_ENGINES = ENGINES.filter((e) => e.chassis === "F Series");
const G_ENGINES = ENGINES.filter((e) => e.chassis === "G30");

function EngineGroup({ title, list }: { title: string; list: Engine[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <ul className="space-y-2">
        {list.map((e) => (
          <li key={e.id} className="text-xs leading-relaxed">
            <span className="font-bold text-white">{e.code}</span>
            {e.desc && <span className="text-gray-400"> — {highlightX(e.desc)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A small "?" help icon that reveals the engine guide on hover (desktop) or tap (mobile). */
export function EngineHelpTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Help identifying your engine"
        aria-expanded={open}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-gray-400 transition-colors hover:border-blue-500/50 hover:text-blue-300"
      >
        <HelpCircle size={13} />
      </button>

      {open && (
        <div className="absolute left-0 top-7 z-50 w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-white/15 bg-zinc-900 p-4 shadow-2xl shadow-black/50">
          <p className="mb-1 text-sm font-semibold text-white">Which engine do I have?</p>
          <p className="mb-3 text-xs text-gray-500">
            Match your model badge and year below. Most Irish BMWs are the N47 or B47
            (2.0&nbsp;diesel).
          </p>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            <EngineGroup title="F Series" list={F_ENGINES} />
            <EngineGroup title="G Series" list={G_ENGINES} />
          </div>
        </div>
      )}
    </span>
  );
}
