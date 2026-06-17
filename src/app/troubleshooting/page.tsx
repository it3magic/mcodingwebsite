"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type LucideIcon,
  AlertTriangle,
  ArrowRight,
  Bluetooth,
  Cable,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  Plug,
  Radio,
  ShieldCheck,
  Smartphone,
  Video,
  Watch,
  Wifi,
} from "lucide-react";

const DEVICE_TAGS = ["MMI Boxes", "Android Screens", "Wireless CarPlay", "Android Auto"];

const EXAMPLES = [
  { icon: Bluetooth, label: "The original BMW Bluetooth system" },
  { icon: Video, label: "Aftermarket dashcams with Bluetooth connectivity" },
  { icon: Cable, label: "OBD diagnostic devices" },
  { icon: Radio, label: "Bluetooth trackers" },
  { icon: Watch, label: "Smartwatches attempting to switch audio devices" },
  { icon: Plug, label: "Other aftermarket accessories" },
];

const CHECKS = [
  "Disconnect or forget the original BMW Bluetooth connection if it is no longer required.",
  "Temporarily disconnect any Bluetooth-enabled dashcams.",
  "Remove unused Bluetooth devices from your phone.",
  "Turn Bluetooth off and back on before testing.",
  "Test the system with only the CarPlay/Android Auto device paired.",
];

const ISSUES = [
  "Random disconnections.",
  "Failed automatic connections.",
  "Audio interruptions.",
  "Calls routing to the wrong device.",
  "CarPlay or Android Auto failing to launch.",
];

function Accordion({
  icon: Icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        open ? "border-blue-500/40 bg-zinc-900/60" : "border-white/10 bg-zinc-900/40 hover:border-white/20"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02] sm:p-6"
      >
        <span
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
            open
              ? "bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white"
              : "bg-white/5 text-blue-300"
          }`}
        >
          <Icon size={20} />
        </span>
        <span className="flex-1 text-base font-semibold text-white sm:text-lg">{title}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180 text-blue-300" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-5 pb-6 pt-5 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function TroubleshootingPage() {
  const [open, setOpen] = useState<string[]>(["disconnects"]);
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 py-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute top-0 left-1/2 h-64 w-2/3 -translate-x-1/2 bg-blue-500/10 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 px-4 py-2 backdrop-blur-sm">
              <LifeBuoy size={15} className="text-blue-300" />
              <span className="text-sm font-semibold text-gradient">Support Centre</span>
            </div>
            <h1 className="text-4xl font-bold text-white md:text-6xl">Troubleshooting</h1>
            <p className="mt-3 text-xl font-semibold text-gradient md:text-2xl">CarPlay &amp; Android Auto</p>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              Quick fixes for wireless Apple CarPlay and Android Auto on our MMI boxes and Android
              screens.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {DEVICE_TAGS.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-black pb-20 pt-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* How it connects */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Bluetooth size={18} />
                </span>
                <div>
                  <p className="font-semibold text-white">Bluetooth</p>
                  <p className="mt-0.5 text-sm text-gray-400">Handles pairing, phone calls and contacts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                  <Wifi size={18} />
                </span>
                <div>
                  <p className="font-semibold text-white">Wi-Fi</p>
                  <p className="mt-0.5 text-sm text-gray-400">
                    Carries the high-bandwidth CarPlay / Android Auto stream.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
              <HelpCircle size={15} className="text-blue-400" /> Common issues
            </h2>

            <div className="space-y-4">
              {/* Issue 1 */}
              <Accordion
                icon={Bluetooth}
                title="My wireless CarPlay or Android Auto disconnects randomly"
                open={open.includes("disconnects")}
                onToggle={() => toggle("disconnects")}
              >
                <p className="leading-relaxed text-gray-300">
                  The most common cause of random disconnections is that your phone is connected to{" "}
                  <span className="font-semibold text-white">
                    multiple Bluetooth devices in the vehicle at the same time.
                  </span>
                </p>

                <p className="mt-5 text-sm font-semibold text-white">Examples include:</p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {EXAMPLES.map(({ icon: Ic, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3.5 py-3"
                    >
                      <Ic size={16} className="flex-shrink-0 text-blue-300" />
                      <span className="text-sm text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 leading-relaxed text-gray-300">
                  Wireless CarPlay and Android Auto use{" "}
                  <span className="font-semibold text-white">both Bluetooth and Wi-Fi simultaneously</span>. If
                  your phone tries to maintain connections to multiple in-car devices, it can occasionally
                  interrupt the connection to the CarPlay/Android Auto system.
                </p>

                {/* Recommended checks */}
                <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/[0.07] p-5">
                  <p className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <ShieldCheck size={18} className="text-blue-300" /> Recommended checks
                  </p>
                  <ol className="space-y-3">
                    {CHECKS.map((c, i) => (
                      <li key={c} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-200">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-gray-300">{c}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                  <p className="text-sm leading-relaxed text-emerald-100/90">
                    In the vast majority of cases, stable operation is restored once competing Bluetooth
                    connections are removed.
                  </p>
                </div>
              </Accordion>

              {/* Issue 2 */}
              <Accordion
                icon={HelpCircle}
                title="Why do I need to disconnect the original BMW Bluetooth?"
                open={open.includes("why-disconnect")}
                onToggle={() => toggle("why-disconnect")}
              >
                <p className="leading-relaxed text-gray-300">
                  Your aftermarket CarPlay/Android Auto system creates its{" "}
                  <span className="font-semibold text-white">own Bluetooth and Wi-Fi connection</span> to your
                  phone.
                </p>
                <p className="mt-4 leading-relaxed text-gray-300">
                  If the phone is also connected to the factory BMW Bluetooth system, the phone may attempt to
                  switch audio, contacts, or call functions between both devices. This can lead to:
                </p>
                <div className="mt-4 space-y-2.5">
                  {ISSUES.map((issue) => (
                    <div
                      key={issue}
                      className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-2.5"
                    >
                      <AlertTriangle size={16} className="flex-shrink-0 text-amber-300" />
                      <span className="text-sm text-gray-300">{issue}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 p-5">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-gray-200">
                    <Smartphone size={18} className="mt-0.5 flex-shrink-0 text-blue-300" />
                    <span>
                      For the best experience, we recommend using{" "}
                      <span className="font-semibold text-white">only one in-car Bluetooth connection</span>{" "}
                      for phone functions wherever possible.
                    </span>
                  </p>
                </div>
              </Accordion>
            </div>

            {/* CTA */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 p-6 sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Still having trouble?</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    If the steps above don&apos;t resolve it, we&apos;re happy to help — get in touch and
                    we&apos;ll sort it.
                  </p>
                </div>
                <div className="flex w-full flex-shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:opacity-90"
                  >
                    Contact us <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/products/carplay-android-auto-retrofit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:border-blue-500/40 hover:bg-white/10"
                  >
                    CarPlay / Android Auto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
