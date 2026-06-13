"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Plus,
  Cog,
  Fuel,
  Gift,
  HelpCircle,
  Info,
  Lock,
  Search,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import {
  type Addon,
  type AddonId,
  addonLabel,
  addonLabour,
  addonPart,
  addonTotal,
  baseLabour,
  baseLabourLabel,
  cabinFilterTotal,
  DEFAULT_OIL_ID,
  ENGINES,
  type Extra,
  formatEur,
  formatMinutes,
  getAddons,
  getEngine,
  getExtras,
  getOil,
  OIL_OPTIONS,
  oilCost,
  packageAddonsForEngine,
  SERVICE_PACKAGES,
  type ServicePackage,
  totalLabourMinutes,
  VAT_RATE,
  type Engine,
} from "../service-config";
import { ENGINE_MODELS } from "../engine-lookup";

const ENGINES_F = ENGINES.filter((e) => e.chassis === "F Series");
const ENGINES_G30 = ENGINES.filter((e) => e.chassis === "G30");

const round2 = (n: number) => Math.round(n * 100) / 100;

const DEFAULT_FREEBIES = ["screen-wash", "air-freshener"];

type Line = { key: string; label: string; sub?: string; tip?: string | string[]; tipTitle?: string; price: number | null };

/** Always-included base line items: labour + oil + oil filter (same for every engine). */
function buildBaseLines(engine: Engine, oilId: string, genuine: boolean): Line[] {
  const oil = getOil(oilId);
  return [
    {
      key: "labour",
      label: baseLabourLabel(engine),
      sub: "Base labour",
      price: baseLabour(engine),
    },
    {
      key: "oil",
      label: oil.name,
      sub: `${engine.oilCapacity} L × ${formatEur(oil.pricePerL)}`,
      price: oilCost(engine, oilId),
    },
    {
      key: "oil-filter",
      label: `Oil filter (${engine.code})`,
      sub: genuine ? "Genuine BMW filter — price on application" : "High-quality Bosch or Mann filter",
      tipTitle: "About the oil filter",
      tip: genuine
        ? [
            "Genuine BMW oil filters are supplied straight from BMW. Pricing varies by model, so we confirm the exact price on booking.",
            "The oil filter is replaced at every service. Our recommendation is a service every 15,000 km, so fresh oil and clean filtration are always protecting your engine.",
          ]
        : [
            "Mann+Hummel (Mann-Filter) is an original-equipment (OE) supplier to BMW — many genuine BMW filters come off its production lines, so you get factory filtration quality. Bosch is a trusted premium-brand alternative built to the same specification.",
            "The oil filter is replaced at every service. Our recommendation is a service every 15,000 km, so fresh oil and clean filtration are always protecting your engine.",
          ],
      price: genuine ? null : engine.oilFilter,
    },
  ];
}

function FuelBadge({ fuel }: { fuel: Engine["fuel"] }) {
  const isDiesel = fuel === "diesel";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isDiesel ? "bg-sky-500/15 text-sky-300" : "bg-amber-500/15 text-amber-300"
      }`}
    >
      <Fuel size={10} />
      {isDiesel ? "Diesel" : "Petrol"}
    </span>
  );
}

function StepBadge({
  n,
  label,
  tip,
  tipTitle,
}: {
  n: number;
  label: string;
  tip?: string | string[];
  tipTitle?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-sm font-bold text-white">
        {n}
      </span>
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        {label}
        {tip && <InfoTip label={tipTitle ?? label} text={tip} />}
      </h2>
    </div>
  );
}

/** Render a description, highlighting the leading "x" in model codes like x20d as a variable. */
function highlightX(text: string) {
  return text.split(/(x\d{2}[a-z])/gi).map((part, i) => {
    const m = /^x(\d{2}[a-z])$/i.exec(part);
    return m ? (
      <span key={i} className="font-semibold text-gray-300">
        <span className="font-bold text-blue-300">x</span>
        {m[1]}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

/** Small "?" help icon that reveals a short explainer on hover (desktop) or tap (mobile). */
function InfoTip({ label, text }: { label: string; text: string | string[] }) {
  const [open, setOpen] = useState(false);
  const paragraphs = Array.isArray(text) ? text : [text];
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={label}
        aria-expanded={open}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-gray-400 transition-colors hover:border-blue-500/50 hover:text-blue-300"
      >
        <HelpCircle size={11} />
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-50 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-white/15 bg-zinc-900 p-3 text-left shadow-2xl shadow-black/50">
          <p className="mb-1.5 text-xs font-semibold text-white">{label}</p>
          <div className="space-y-1.5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed text-gray-400">
                {p}
              </p>
            ))}
          </div>
        </div>
      )}
    </span>
  );
}

/** Reusable checkbox row used for add-ons and extras. */
function ToggleRow({
  active,
  onClick,
  label,
  desc,
  tip,
  tipLabel,
  priceLabel,
  priceActive,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
  tip?: string | string[];
  tipLabel?: string;
  priceLabel: string;
  priceActive: boolean;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={active}
      aria-label={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
        active
          ? "border-blue-500/60 bg-blue-500/10"
          : "border-white/10 bg-zinc-900/40 hover:border-white/25 hover:bg-zinc-900/70"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
          active
            ? "border-blue-500 bg-blue-500/10 text-blue-300"
            : "border-white/20 text-gray-500 group-hover:border-white/40"
        }`}
      >
        {active ? <Check size={16} strokeWidth={3} /> : <Plus size={14} />}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            {label}
            {tip && <InfoTip label={tipLabel ?? `About ${label}`} text={tip} />}
          </span>
          <span
            className={`flex-shrink-0 text-sm font-semibold ${
              priceActive ? "text-blue-300" : "text-gray-400"
            }`}
          >
            {priceLabel}
          </span>
        </div>
        {desc && <p className="mt-1 text-sm text-gray-400">{desc}</p>}
      </div>
    </div>
  );
}

/** Green tickable row for complimentary (free) items. */
function FreeRow({
  active,
  onClick,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-emerald-500/50 bg-emerald-500/10"
          : "border-white/10 bg-zinc-900/40 hover:border-white/25 hover:bg-zinc-900/70"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
          active
            ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
            : "border-white/20 text-gray-500 group-hover:border-white/40"
        }`}
      >
        {active ? <Check size={16} strokeWidth={3} /> : <Plus size={14} />}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-white">{label}</span>
          <span
            className={`flex-shrink-0 text-xs font-semibold ${
              active ? "text-emerald-300" : "text-gray-500"
            }`}
          >
            Free
          </span>
        </div>
        {desc && <p className="mt-1 text-sm text-gray-400">{desc}</p>}
      </div>
    </button>
  );
}

/** Full-screen popup listing every model that uses each configurator engine. */
function EngineLookupModal({
  open,
  onClose,
  onSelect,
  currentId,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  currentId: string | null;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const groups: { title: string; engines: Engine[] }[] = [
    { title: "F Series · 2010–2019", engines: ENGINES_F },
    { title: "G Series · 2017 on", engines: ENGINES_G30 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Engine lookup"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/60 sm:max-h-[85vh] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-red-600/15 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Search size={16} className="text-blue-300" /> Engine Lookup
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Find your model, then tap its engine to select it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-white/25 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {groups.map((g) => (
            <div key={g.title} className="mb-6 last:mb-0">
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {g.title}
              </h4>
              <div className="space-y-3">
                {g.engines.map((eng) => {
                  const info = ENGINE_MODELS[eng.id];
                  if (!info) return null;
                  const active = currentId === eng.id;
                  return (
                    <div
                      key={eng.id}
                      className={`overflow-hidden rounded-xl border ${
                        active ? "border-blue-500/60 bg-blue-500/[0.07]" : "border-white/10 bg-black/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(eng.id);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-base font-bold text-white">{eng.code}</span>
                          <FuelBadge fuel={eng.fuel} />
                          <span className="text-xs text-gray-400">
                            {info.spec} · {info.years}
                          </span>
                        </span>
                        <span
                          className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
                            active ? "bg-blue-500 text-white" : "border border-blue-500/40 text-blue-300"
                          }`}
                        >
                          {active ? "Selected" : "Select"}
                        </span>
                      </button>
                      <ul className="divide-y divide-white/5">
                        {info.rows.map((m, i) => (
                          <li
                            key={i}
                            className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:items-baseline sm:gap-3"
                          >
                            <span className="w-24 flex-shrink-0 text-xs font-semibold text-gray-300">
                              {m.series}
                            </span>
                            <span className="text-xs leading-relaxed text-gray-400">{m.variants}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 bg-black/20 px-5 py-3">
          <p className="text-center text-[11px] text-gray-500">
            Don&apos;t see your car, or driving an M / M&nbsp;Performance model? Close this and use
            &ldquo;Contact us for a quote&rdquo; — we service many more models.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 pt-20" />}>
      <ConfigureConfigurator />
    </Suspense>
  );
}

function ConfigureConfigurator() {
  const searchParams = useSearchParams();
  const pendingPackageRef = useRef<ServicePackage | null>(null);
  const [presetName, setPresetName] = useState<string | null>(null);
  const [engineId, setEngineId] = useState<string | null>(null);
  const [oilId, setOilId] = useState<string>(DEFAULT_OIL_ID);
  const [addons, setAddons] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [xdrive, setXdrive] = useState(false);
  const [freebies, setFreebies] = useState<string[]>(DEFAULT_FREEBIES);
  const [registration, setRegistration] = useState("");
  const [lookupOpen, setLookupOpen] = useState(false);
  const [genuineFilters, setGenuineFilters] = useState(false);
  const [cabinCharcoal, setCabinCharcoal] = useState(false);

  const engine = getEngine(engineId);

  // Read a ?package= deep-link once and remember it; it's applied when an engine is chosen.
  useEffect(() => {
    const pkgId = searchParams.get("package");
    if (!pkgId) return;
    const pkg = SERVICE_PACKAGES.find((p) => p.id === pkgId);
    if (!pkg) return;
    pendingPackageRef.current = pkg;
    setPresetName(pkg.name);
  }, [searchParams]);

  // Reset every selection whenever the engine changes — or apply a pending package preset.
  useEffect(() => {
    const pending = pendingPackageRef.current;
    const eng = getEngine(engineId);
    if (eng && pending) {
      pendingPackageRef.current = null;
      setOilId(pending.oilId);
      setAddons(packageAddonsForEngine(pending, eng));
      setExtras([]);
      setXdrive(false);
      setFreebies(DEFAULT_FREEBIES);
      setGenuineFilters(false);
      setCabinCharcoal(false);
      return;
    }
    setOilId(DEFAULT_OIL_ID);
    setAddons([]);
    setExtras([]);
    setXdrive(false);
    setFreebies(DEFAULT_FREEBIES);
    setGenuineFilters(false);
    setCabinCharcoal(false);
  }, [engineId]);

  /** Genuine BMW filters are price-on-application, so air/fuel/cabin filters lose their estimate. */
  const genuinePoaAddon = (id: string) =>
    genuineFilters && (id === "air-filter" || id === "fuel-filter" || id === "cabin-filter");

  const addonOptions = engine ? getAddons(engine) : [];

  /** Cabin-filter-aware total (standard vs activated charcoal on G-series). */
  const addonTotalFor = (id: AddonId): number | null => {
    if (!engine) return null;
    return id === "cabin-filter" ? cabinFilterTotal(engine, cabinCharcoal) : addonTotal(engine, id);
  };

  const toggle = (id: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const selectedAddonOpts = addonOptions.filter((a) => addons.includes(a.id));
  const availableExtras = engine ? getExtras(engine, xdrive) : [];
  const selectedExtras = availableExtras.filter((e) => extras.includes(e.id));

  // Complimentary walkaround video is free with a "major" service:
  // diesel = air + fuel filters · petrol = air filter + spark plugs.
  const qualifiesForVideo =
    !!engine &&
    (engine.fuel === "diesel"
      ? addons.includes("air-filter") && addons.includes("fuel-filter")
      : addons.includes("air-filter") && addons.includes("spark-plugs"));

  // ---- Line items ----
  const baseLines = engine ? buildBaseLines(engine, oilId, genuineFilters) : [];
  const addonLines: Line[] = engine
    ? selectedAddonOpts.map((a) => {
        const cabinG = a.id === "cabin-filter" && engine.chassis === "G30" && !genuinePoaAddon(a.id);
        return {
          key: a.id,
          label: cabinG
            ? `${addonLabel(engine, a.id)} (${cabinCharcoal ? "charcoal" : "standard"})`
            : addonLabel(engine, a.id),
          price: genuinePoaAddon(a.id) ? null : addonTotalFor(a.id),
        };
      })
    : [];
  const extraLines: Line[] = selectedExtras.map((e) => ({
    key: e.id,
    label: e.name,
    price: e.price,
  }));

  const sumLines = (lines: Line[]) => lines.reduce((s, l) => s + (l.price ?? 0), 0);
  const subtotal = engine
    ? round2(sumLines(baseLines) + sumLines(addonLines) + sumLines(extraLines))
    : 0;
  const vat = round2(subtotal * VAT_RATE);
  const total = round2(subtotal + vat);
  const labourMin = engine ? totalLabourMinutes(addons, extras) : 0;
  const labourLabel = formatMinutes(labourMin);
  const hasPoa =
    baseLines.some((l) => l.price === null) ||
    addonLines.some((l) => l.price === null) ||
    extraLines.some((l) => l.price === null);

  const canContinue = !!engine;

  const bookingHref = useMemo(() => {
    if (!engine) return "/contact";
    const oil = getOil(oilId);
    const lines: string[] = [];
    lines.push(`Engine: ${engine.chassis} ${engine.code} (${engine.fuel === "diesel" ? "Diesel" : "Petrol"})`);
    lines.push(`${baseLabourLabel(engine)}: ${formatEur(baseLabour(engine))}`);
    lines.push(
      `Engine oil: ${oil.name} — ${engine.oilCapacity} L × ${formatEur(oil.pricePerL)} = ${formatEur(oilCost(engine, oilId))}`,
    );
    if (genuineFilters) lines.push("Filters: Genuine BMW requested (price on application)");
    lines.push(
      `Oil filter (${engine.code}): ${genuineFilters ? "Genuine BMW — price on application" : formatEur(engine.oilFilter)}`,
    );
    selectedAddonOpts.forEach((a) => {
      const labour = addonLabour(engine, a.id);
      const part = addonPart(engine, a.id);
      const isCabin = a.id === "cabin-filter";
      const genuinePoa =
        genuineFilters && (a.id === "air-filter" || a.id === "fuel-filter" || a.id === "cabin-filter");
      const tot = genuinePoa
        ? null
        : isCabin
          ? cabinFilterTotal(engine, cabinCharcoal)
          : addonTotal(engine, a.id);
      const baseLabel = addonLabel(engine, a.id);
      const label =
        isCabin && !genuinePoa && tot !== null
          ? `${baseLabel} (${cabinCharcoal ? "activated charcoal, Mann" : "standard"})`
          : baseLabel;
      if (genuinePoa) {
        lines.push(`${label}: Genuine BMW — price on application`);
      } else if (tot === null) {
        lines.push(`${label}: price on request`);
      } else if (labour !== null && part !== null) {
        lines.push(
          `${label}: ${formatEur(labour)} labour + ${formatEur(part)} part = ${formatEur(tot)}`,
        );
      } else {
        lines.push(`${label}: ${formatEur(tot)}`);
      }
    });
    selectedExtras.forEach((e) => {
      lines.push(`${e.name}: ${e.price === null ? "price on request" : `+${formatEur(e.price)}`}`);
    });
    lines.push(`Subtotal (ex VAT): ${formatEur(subtotal)}`);
    lines.push(`VAT (13.5%): ${formatEur(vat)}`);
    lines.push(`Estimated total (inc VAT): ${formatEur(total)}`);
    lines.push(`Estimated labour time: ~${formatMinutes(labourMin)}`);
    const freeLines: string[] = [];
    if (freebies.includes("screen-wash")) freeLines.push("Screen wash top-up");
    if (freebies.includes("air-freshener")) freeLines.push("Air freshener");
    if (qualifiesForVideo && freebies.includes("video")) freeLines.push("Walkaround condition video");
    if (freeLines.length) lines.push(`Complimentary (free): ${freeLines.join(", ")}`);
    if (hasPoa) lines.push("(Some items are priced on request — confirmed on booking)");

    const serviceLabel = `${engine.chassis} ${engine.code} Service`;
    const params = new URLSearchParams();
    params.set("service", serviceLabel);
    params.set("details", lines.join("\n"));
    params.set("total", formatEur(total));
    if (registration.trim()) params.set("registration", registration.trim());
    return `/contact?${params.toString()}`;
  }, [engine, oilId, selectedAddonOpts, selectedExtras, subtotal, vat, total, labourMin, hasPoa, registration, qualifiesForVideo, freebies, genuineFilters, cabinCharcoal]);

  const renderEngineButton = (e: Engine) => {
    const active = engineId === e.id;
    const isDiesel = e.fuel === "diesel";
    // Subtle fuel-coded glow: sky/blue for diesel, amber for petrol.
    const cls = active
      ? isDiesel
        ? "border-sky-500/60 bg-sky-500/10 shadow-[0_0_24px_-4px_rgba(56,189,248,0.55)]"
        : "border-amber-500/60 bg-amber-500/10 shadow-[0_0_24px_-4px_rgba(245,158,11,0.55)]"
      : isDiesel
        ? "border-sky-500/20 bg-zinc-900/40 shadow-[0_0_18px_-9px_rgba(56,189,248,0.9)] hover:border-sky-500/45 hover:shadow-[0_0_22px_-6px_rgba(56,189,248,0.55)]"
        : "border-amber-500/20 bg-zinc-900/40 shadow-[0_0_18px_-9px_rgba(245,158,11,0.9)] hover:border-amber-500/45 hover:shadow-[0_0_22px_-6px_rgba(245,158,11,0.55)]";
    const checkCls = active
      ? isDiesel
        ? "border-sky-500 bg-sky-500 text-white"
        : "border-amber-500 bg-amber-500 text-white"
      : "border-white/20 text-transparent";
    return (
      <button
        key={e.id}
        type="button"
        onClick={() => setEngineId(e.id)}
        className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all ${cls}`}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-white">{e.code}</span>
            <FuelBadge fuel={e.fuel} />
          </div>
          {e.desc && (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{highlightX(e.desc)}</p>
          )}
        </div>
        <span
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all ${checkCls}`}
        >
          <Check size={14} strokeWidth={3} />
        </span>
      </button>
    );
  };

  return (
    <div className="pt-20">
      <section className="relative min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 py-16">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-blue-500/5 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          {/* Back */}
          <Link
            href="/services#pricing"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>Back to services</span>
          </Link>

          {/* Header */}
          <div className="mt-6 mb-10 max-w-3xl">
            <div className="mb-4 inline-block rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-semibold text-gradient">Build Your Service</span>
            </div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Service Configurator</h1>
            <p className="mt-3 text-lg text-gray-400">
              Pick your engine and oil for accurate, model-specific pricing, then add the filters,
              spark plugs and extras you need.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-8 lg:col-span-2">
              {/* Step 1: Engine */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
                <StepBadge n={1} label="Select your engine" />
                {presetName && !engine && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10 p-3.5">
                    <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-blue-300" />
                    <p className="text-sm leading-relaxed text-blue-100/90">
                      <span className="font-semibold text-blue-200">{presetName} package</span> selected —
                      choose your engine below and we&apos;ll tick the matching oil &amp; filters for you.
                    </p>
                  </div>
                )}
                <p className="-mt-2 mb-5 text-xs leading-relaxed text-gray-500">
                  Tip: match your model badge and year to the engines below — e.g. a 2013
                  320d is an N47, a 2016 520d is a B47. Most Irish BMWs are the N47 or B47
                  (2.0&nbsp;diesel). Not sure?{" "}
                  <span className="font-semibold text-gray-300">&ldquo;Don&apos;t see your car here?&rdquo;</span>{" "}
                  is below.
                </p>

                {/* Engine lookup popup */}
                <button
                  type="button"
                  onClick={() => setLookupOpen(true)}
                  className="mb-5 flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/5"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    <Search size={13} className="text-blue-400" />
                    Not sure? Look up your engine by model
                  </span>
                  <span className="flex-shrink-0 rounded-lg border border-blue-500/40 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                    Open lookup
                  </span>
                </button>
                <EngineLookupModal
                  open={lookupOpen}
                  onClose={() => setLookupOpen(false)}
                  onSelect={setEngineId}
                  currentId={engineId}
                />

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                      <Cog size={18} className="text-blue-400" /> F Series
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {ENGINES_F.map(renderEngineButton)}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                      <Cog size={18} className="text-purple-400" /> G Series
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {ENGINES_G30.map(renderEngineButton)}
                    </div>
                  </div>

                  {/* Vehicle not listed */}
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Don&apos;t see your car here?</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          We service many more BMW &amp; MINI models — get a tailored quote.
                        </p>
                      </div>
                      <Link
                        href="/contact?service=Service%20enquiry%20(vehicle%20not%20listed)"
                        className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-blue-500/40 hover:bg-white/10"
                      >
                        <span>Contact us for a quote</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Oil */}
              <div
                className={`rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition-opacity ${
                  engine ? "opacity-100" : "opacity-60"
                }`}
              >
                <StepBadge
                  n={2}
                  label="Choose your engine oil"
                  tipTitle="Which oil should I choose?"
                  tip={[
                    "LL-04 is BMW's own oil approval (Longlife-04) — every oil we offer meets the spec your engine needs. Standard LL04 is a quality approved oil for everyday driving; TopTec 4200 is a premium German oil with better protection and cleanliness (our pick).",
                    "Molygen adds Liqui Moly's friction-reducing technology for extra wear protection (don't combine it with Ceratec). BMW Genuine 0W-30 is the exact factory oil BMW dealers use.",
                  ]}
                />
                <div className="space-y-3">
                  {OIL_OPTIONS.map((o) => {
                    const active = oilId === o.id;
                    const cost = engine ? oilCost(engine, o.id) : null;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setOilId(o.id)}
                        className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                          active
                            ? "border-blue-500/60 bg-blue-500/10"
                            : "border-white/10 bg-zinc-900/40 hover:border-white/25 hover:bg-zinc-900/70"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                            active
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-white/20 text-transparent group-hover:border-white/40"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                            <span className="font-semibold text-white">
                              {o.name}
                              {o.recommended && (
                                <span className="ml-2 rounded-full border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                                  Recommended
                                </span>
                              )}
                            </span>
                            <span className="flex-shrink-0 text-sm">
                              <span className="font-semibold text-white">{formatEur(o.pricePerL)}</span>
                              <span className="text-gray-500">/L</span>
                              {cost !== null && engine && (
                                <span className="ml-2 text-xs font-semibold text-blue-300">
                                  ({engine.oilCapacity} L = {formatEur(cost)})
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{o.note}</p>
                        </div>
                      </button>
                    );
                  })}
                  <p className="pt-1 text-xs text-gray-500">
                    Oil quantity is based on your engine's capacity. Prices ex VAT.
                  </p>
                </div>
              </div>

              {/* Step 3: Service & add-ons */}
              <div
                className={`rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition-opacity ${
                  engine ? "opacity-100" : "opacity-50"
                }`}
              >
                <StepBadge n={3} label="Service & add-ons" />
                {!engine ? (
                  <p className="text-sm text-gray-500">Select an engine above to build your service.</p>
                ) : (
                  <div className="space-y-3">
                    {/* Genuine BMW filters toggle */}
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Genuine BMW filters</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Swap the oil, air, fuel &amp; cabin filters for genuine BMW parts — priced on
                          application.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={genuineFilters}
                        aria-label="Use genuine BMW filters"
                        onClick={() => setGenuineFilters((v) => !v)}
                        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                          genuineFilters ? "bg-amber-500" : "bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            genuineFilters ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Locked base lines */}
                    {baseLines.map((l) => (
                      <div
                        key={l.key}
                        className="flex items-start gap-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4"
                      >
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-300">
                          <Check size={16} strokeWidth={3} />
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-white">
                              {l.label}
                              <span className="ml-2 rounded-full border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                                Included
                              </span>
                            </span>
                            <span className="text-lg font-bold text-white">
                              {l.price === null ? "On request" : formatEur(l.price)}
                            </span>
                          </div>
                          {l.sub && (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                              <span>{l.sub}</span>
                              {l.tip && <InfoTip label={l.tipTitle ?? l.label} text={l.tip} />}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Optional add-on checkboxes */}
                    {addonOptions.map((a: Addon) => {
                      const genuinePoa = genuinePoaAddon(a.id);
                      const tot = genuinePoa ? null : addonTotalFor(a.id);
                      const labour = addonLabour(engine, a.id);
                      const part = addonPart(engine, a.id);
                      const breakdown = genuinePoa
                        ? "Genuine BMW part — price on application"
                        : a.id === "cabin-filter"
                          ? tot !== null
                            ? cabinCharcoal
                              ? "Activated charcoal — Mann"
                              : "Standard non-charcoal — Mann or Bosch"
                            : a.desc
                          : labour !== null && part !== null
                            ? `${formatEur(labour)} labour + ${formatEur(part)} part`
                            : a.desc;
                      const row = (
                        <ToggleRow
                          active={addons.includes(a.id)}
                          onClick={() => toggle(a.id, addons, setAddons)}
                          label={a.label}
                          desc={breakdown}
                          tip={a.tip}
                          tipLabel={a.tipTitle}
                          priceActive={addons.includes(a.id) && tot !== null}
                          priceLabel={tot === null ? "On request" : `+${formatEur(tot)}`}
                        />
                      );
                      const showCabinChoice =
                        a.id === "cabin-filter" &&
                        addons.includes("cabin-filter") &&
                        !genuinePoa &&
                        engine.chassis === "G30";
                      if (!showCabinChoice) return <div key={a.id}>{row}</div>;
                      return (
                        <div key={a.id} className="space-y-2">
                          {row}
                          <div className="ml-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {[
                              { charcoal: false, name: "Standard", sub: "Mann or Bosch" },
                              { charcoal: true, name: "Activated charcoal", sub: "Mann branded" },
                            ].map((opt) => {
                              const optPrice = cabinFilterTotal(engine, opt.charcoal);
                              const selected = cabinCharcoal === opt.charcoal;
                              return (
                                <button
                                  key={String(opt.charcoal)}
                                  type="button"
                                  onClick={() => setCabinCharcoal(opt.charcoal)}
                                  className={`rounded-lg border p-2.5 text-left transition-all ${
                                    selected
                                      ? "border-blue-500/60 bg-blue-500/10"
                                      : "border-white/10 bg-black/20 hover:border-white/25"
                                  }`}
                                >
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-white">{opt.name}</span>
                                    {selected && (
                                      <Check size={13} className="text-blue-300" strokeWidth={3} />
                                    )}
                                  </span>
                                  <span className="mt-0.5 block text-[11px] text-gray-400">
                                    {opt.sub}
                                    {optPrice !== null && ` · +${formatEur(optPrice)}`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <p className="pt-1 text-xs text-gray-500">
                      Add-on prices include the part plus fitting labour. Prices ex VAT.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 4: Extras */}
              <div
                className={`rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition-opacity ${
                  engine ? "opacity-100" : "opacity-50"
                }`}
              >
                <StepBadge n={4} label="Optional extras" />
                {!engine ? (
                  <p className="text-sm text-gray-500">Select an engine above to see available extras.</p>
                ) : (
                  <div className="space-y-3">
                    {/* xDrive toggle */}
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                      <div>
                        <p className="text-sm font-semibold text-white">xDrive (all-wheel drive)?</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Unlocks transfer box &amp; front differential services
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={xdrive}
                        aria-label="Toggle xDrive"
                        onClick={() => setXdrive((v) => !v)}
                        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                          xdrive ? "bg-blue-600" : "bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            xdrive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {availableExtras.map((e: Extra) => (
                      <ToggleRow
                        key={e.id}
                        active={extras.includes(e.id)}
                        onClick={() => toggle(e.id, extras, setExtras)}
                        label={e.name}
                        desc={e.note}
                        tip={e.tip}
                        tipLabel={e.tipTitle}
                        priceActive={extras.includes(e.id) && e.price !== null}
                        priceLabel={e.price === null ? "On request" : `+${formatEur(e.price)}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Complimentary (free) */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Gift size={16} />
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Complimentary <span className="text-emerald-300">— free</span>
                  </h2>
                </div>
                <p className="mb-4 text-sm text-gray-400">
                  Included free with your service — untick anything you'd rather not have.
                </p>
                <div className="space-y-3">
                  <FreeRow
                    active={freebies.includes("screen-wash")}
                    onClick={() => toggle("screen-wash", freebies, setFreebies)}
                    label="Screen wash top-up"
                    desc="Topped up with every service"
                  />
                  <FreeRow
                    active={freebies.includes("air-freshener")}
                    onClick={() => toggle("air-freshener", freebies, setFreebies)}
                    label="Air freshener"
                    desc="A fresh finishing touch for your cabin"
                  />
                  {qualifiesForVideo ? (
                    <FreeRow
                      active={freebies.includes("video")}
                      onClick={() => toggle("video", freebies, setFreebies)}
                      label="Walkaround condition video"
                      desc="A video walkaround showing the condition of your car"
                    />
                  ) : (
                    <div className="flex w-full items-start gap-3 rounded-xl border border-dashed border-white/10 bg-black/20 p-4 opacity-80">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/15 text-gray-600">
                        <Lock size={12} />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-gray-300">Walkaround condition video</span>
                          <span className="flex-shrink-0 text-xs font-semibold text-gray-500">Major service</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Unlocked free with a major service — add air + fuel filters, or air filter + spark plugs.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur">
                  <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-red-600/10 p-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-blue-300" size={18} />
                      <h3 className="text-lg font-bold text-white">Your Quote</h3>
                    </div>
                    {engine ? (
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                        {engine.chassis} {engine.code}
                        <FuelBadge fuel={engine.fuel} />
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">No engine selected yet</p>
                    )}
                  </div>

                  <div className="space-y-3 p-6">
                    {engine ? (
                      <>
                        {baseLines.map((l) => (
                          <div key={l.key} className="flex items-start justify-between gap-3 text-sm">
                            <span className="text-gray-300">
                              {l.label}
                              {l.sub && <span className="block text-xs text-gray-500">{l.sub}</span>}
                            </span>
                            <span className="flex-shrink-0 font-medium text-white">
                              {l.price === null ? "On request" : formatEur(l.price)}
                            </span>
                          </div>
                        ))}

                        {addonLines.map((l) => (
                          <div key={l.key} className="flex items-start justify-between gap-3 text-sm">
                            <span className="text-gray-400">{l.label}</span>
                            <span className="flex-shrink-0 font-medium text-white">
                              {l.price === null ? "On request" : `+${formatEur(l.price)}`}
                            </span>
                          </div>
                        ))}

                        {extraLines.map((l) => (
                          <div key={l.key} className="flex items-start justify-between gap-3 text-sm">
                            <span className="text-gray-400">{l.label}</span>
                            <span className="flex-shrink-0 font-medium text-white">
                              {l.price === null ? "On request" : `+${formatEur(l.price)}`}
                            </span>
                          </div>
                        ))}

                        <div className="mt-2 space-y-2 border-t border-white/10 pt-4 text-sm">
                          <div className="flex items-center justify-between text-gray-400">
                            <span>Subtotal (ex VAT)</span>
                            <span>{formatEur(subtotal)}</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-400">
                            <span>VAT (13.5%)</span>
                            <span>{formatEur(vat)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="font-semibold text-white">Total (inc VAT)</span>
                          <span className="text-2xl font-bold text-white">
                            {formatEur(total)}
                            {hasPoa && (
                              <span
                                className="ml-0.5 align-top text-base font-bold text-amber-300"
                                title="Some items are priced on application — final price will be higher"
                              >
                                +
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-500" /> Est. labour time
                          </span>
                          <span className="font-semibold text-gray-300">~{labourLabel}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Select an engine to see your quote.</p>
                    )}

                    {canContinue && (
                      <div className="pt-1">
                        <label
                          htmlFor="reg"
                          className="mb-1.5 block text-xs font-medium text-gray-400"
                        >
                          Vehicle registration <span className="text-gray-600">(optional)</span>
                        </label>
                        <input
                          id="reg"
                          type="text"
                          value={registration}
                          onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                          placeholder="e.g. 181-D-12345"
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm uppercase text-white placeholder-gray-600 transition-colors focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {canContinue ? (
                      <Link
                        href={bookingHref}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:opacity-90"
                      >
                        <span>Continue to Booking</span>
                        <ArrowRight size={18} />
                      </Link>
                    ) : (
                      <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-gray-500">
                        <Wrench size={18} />
                        <span>Select an engine to start</span>
                      </div>
                    )}

                    {hasPoa && (
                      <div className="flex items-start gap-2 pt-1 text-xs text-amber-300/80">
                        <Info size={14} className="mt-0.5 flex-shrink-0" />
                        <span>
                          The <span className="font-bold text-amber-300">+</span> means some items
                          (e.g. genuine filters, cabin filter, wipers) are priced on application —
                          your final price will be higher once those are confirmed.
                        </span>
                      </div>
                    )}

                    <div className="mt-1 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5">
                      <Info size={16} className="mt-0.5 flex-shrink-0 text-amber-300" />
                      <p className="text-sm leading-relaxed text-amber-100/90">
                        <span className="font-semibold text-amber-200">Indicative pricing.</span> Your final
                        quote may change subject to availability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
