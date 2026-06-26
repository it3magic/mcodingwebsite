"use client";

import { useState, useRef, type ReactNode } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Download, Printer, Loader2, Check, Wrench, Settings, Cog } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type StickerType = "engine" | "rebuild" | "service";

const GRADIENT = "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444)";

export default function EngineStickerPage() {
  // Sticker type selector
  const [stickerType, setStickerType] = useState<StickerType>("engine");

  // Engine service sticker state
  const [rodBearings, setRodBearings] = useState(false);
  const [mainBearings, setMainBearings] = useState(false);
  const [timingChain, setTimingChain] = useState(false);

  // Regular service sticker state
  const [oilFilter, setOilFilter] = useState(false);
  const [airFilter, setAirFilter] = useState(false);
  const [fuelFilter, setFuelFilter] = useState(false);
  const [cabinFilter, setCabinFilter] = useState(false);
  const [sparkPlugs, setSparkPlugs] = useState(false);
  const [liquiMolyOil, setLiquiMolyOil] = useState(false);

  // Common fields
  const [date, setDate] = useState("");
  const [mileage, setMileage] = useState("");

  // Next service fields (for regular service)
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);

  const fmtDate = (value: string) =>
    value
      ? new Date(value).toLocaleDateString("en-IE", { day: "2-digit", month: "short", year: "numeric" })
      : "—";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!stickerRef.current) return;

    setIsGenerating(true);
    try {
      // Make sure the custom fonts have loaded before capturing the canvas
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(stickerRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      const dateStr = date ? new Date(date).toISOString().split("T")[0] : "undated";
      const prefixMap = { engine: "engine-sticker", rebuild: "rebuild-sticker", service: "service-sticker" };
      link.download = `${prefixMap[stickerType]}-${dateStr}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------- Reusable sticker building blocks ---------- */

  // Outer gradient-border shell + dark panel + vertical accent spine + watermark
  const StickerShell = ({ children }: { children: ReactNode }) => (
    <div
      ref={stickerRef}
      className="sticker-preview rounded-[18px] p-[3px] shadow-2xl"
      style={{ width: "450px", height: "800px", background: GRADIENT }}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[15px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        {/* Vertical accent spine */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500" />
        {/* Faint motorsport watermark */}
        <div
          className="pointer-events-none absolute -right-10 bottom-16 select-none leading-none text-white/[0.035]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "300px" }}
        >
          M
        </div>
        {children}
      </div>
    </div>
  );

  // Brand header (wordmark + condensed tagline)
  const StickerHeader = ({ maxWidth = 240 }: { maxWidth?: number }) => (
    <div className="flex flex-col items-center">
      <Image
        src="/LogoFinal-01.png"
        alt="M Coding Ireland"
        width={400}
        height={120}
        className="h-auto"
        style={{ width: "100%", maxWidth }}
      />
      <div
        className="mt-1.5 text-gray-400"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px", letterSpacing: "0.42em" }}
      >
        BMW &amp; MINI SPECIALIST
      </div>
    </div>
  );

  // Big condensed section title with gradient underline.
  // NOTE: `lineHeight` is kept >= 1.15 and real `paddingBottom` reserves space
  // below the glyphs so the underline never overlaps the text once rasterised
  // by html2canvas (which renders Bebas Neue slightly lower than the browser).
  const StickerTitle = ({ overline, title, size = 52 }: { overline?: string; title: string; size?: number }) => (
    <div className="text-center">
      {overline && (
        <div className="mb-1 text-[10px] uppercase tracking-[0.35em] text-gray-500">{overline}</div>
      )}
      <div
        className="text-white"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: `${size}px`,
          lineHeight: 1.15,
          letterSpacing: "0.03em",
          paddingBottom: "12px",
        }}
      >
        {title}
      </div>
      <div className="mx-auto h-1 w-24 rounded-full" style={{ background: GRADIENT, marginTop: "2px" }} />
    </div>
  );

  // Small uppercase label with trailing hairline
  const SectionLabel = ({ children }: { children: ReactNode }) => (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );

  // Monospace data card (date / mileage)
  const DataField = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
    <div
      className={`rounded-lg border px-3 py-2.5 ${
        accent ? "border-blue-500/30 bg-blue-500/[0.08]" : "border-white/10 bg-black/40"
      }`}
    >
      <div className={`text-[8px] uppercase tracking-[0.2em] ${accent ? "text-blue-300" : "text-gray-500"}`}>
        {label}
      </div>
      <div className="mt-0.5 text-white" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );

  // Checklist pill.
  // NOTE: a fixed row height + matching 20px line-height on both the checkbox
  // and the label keep them vertically aligned once rasterised by html2canvas
  // (which otherwise places the text baseline lower than the browser does).
  const CheckItem = ({ checked, label }: { checked: boolean; label: string }) => (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 ${
        checked ? "border-white/10 bg-white/[0.05]" : "border-white/5 bg-white/[0.02]"
      }`}
      style={{ height: "38px" }}
    >
      <span
        className="flex flex-shrink-0 items-center justify-center rounded-md border"
        style={{
          width: "20px",
          height: "20px",
          borderColor: checked ? "transparent" : "rgba(255,255,255,0.25)",
          background: checked ? GRADIENT : "transparent",
        }}
      >
        {checked && <Check size={13} strokeWidth={3} color="white" style={{ display: "block" }} />}
      </span>
      <span
        className={`font-medium tracking-wide ${checked ? "text-white" : "text-gray-400"}`}
        style={{ fontSize: "13px", lineHeight: "20px" }}
      >
        {label}
      </span>
    </div>
  );

  // Footer with QR + contact
  const StickerFooter = ({
    qrValue = "https://m-coding.ie",
    ctaTitle,
    ctaSub,
  }: {
    qrValue?: string;
    ctaTitle: string;
    ctaSub: string;
  }) => (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
      <div className="flex items-center gap-2.5">
        <div className="rounded-md bg-white p-1">
          <QRCodeSVG value={qrValue} size={42} level="M" bgColor="#ffffff" fgColor="#000000" />
        </div>
        <div className="text-[9px] leading-tight text-gray-400">
          <div className="font-semibold text-white">{ctaTitle}</div>
          <div>{ctaSub}</div>
        </div>
      </div>
      <div className="text-right text-[9px] leading-tight text-gray-500">
        <div
          className="text-gray-200"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "0.08em" }}
        >
          m-coding.ie
        </div>
        <div>Ardfinnan, Co. Tipperary</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
      {/* Google Fonts: condensed display + mono data + handwriting signature */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dancing+Script:wght@600;700&family=JetBrains+Mono:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Service Sticker Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate professional service stickers for the engine bay</p>

        {/* Sticker Type Tabs - 3 options */}
        <div className="max-w-2xl mx-auto mb-6 print:hidden">
          <div className="flex rounded-lg bg-zinc-900 p-1 border border-white/10">
            <button
              onClick={() => setStickerType("engine")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-medium text-sm transition-all ${
                stickerType === "engine"
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Wrench size={16} />
              Engine Service
            </button>
            <button
              onClick={() => setStickerType("rebuild")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-medium text-sm transition-all ${
                stickerType === "rebuild"
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Cog size={16} />
              Engine Rebuild
            </button>
            <button
              onClick={() => setStickerType("service")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-medium text-sm transition-all ${
                stickerType === "service"
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Settings size={16} />
              Regular Service
            </button>
          </div>
        </div>

        {/* Controls - Hidden when printing */}
        <div className="max-w-md mx-auto mb-8 space-y-4 print:hidden">
          {/* Date and Mileage - Common to all */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Service Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mileage (km)</label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 150,000"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Next Service Fields - Only for Regular Service */}
          {stickerType === "service" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Next Service Due</label>
                <input
                  type="date"
                  value={nextServiceDate}
                  onChange={(e) => setNextServiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Or at (km)</label>
                <input
                  type="text"
                  value={nextServiceMileage}
                  onChange={(e) => setNextServiceMileage(e.target.value)}
                  placeholder="e.g. 165,000"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* Engine Service Checkboxes */}
          {stickerType === "engine" && (
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rodBearings}
                  onChange={(e) => setRodBearings(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Rod Bearings</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mainBearings}
                  onChange={(e) => setMainBearings(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Main Bearings</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={timingChain}
                  onChange={(e) => setTimingChain(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Timing Chain</span>
              </label>
            </div>
          )}

          {/* Regular Service Checkboxes */}
          {stickerType === "service" && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liquiMolyOil}
                  onChange={(e) => setLiquiMolyOil(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Liqui Moly Oil</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oilFilter}
                  onChange={(e) => setOilFilter(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Oil Filter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airFilter}
                  onChange={(e) => setAirFilter(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Air Filter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Fuel Filter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cabinFilter}
                  onChange={(e) => setCabinFilter(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Cabin Filter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sparkPlugs}
                  onChange={(e) => setSparkPlugs(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Spark Plugs</span>
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download PNG
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-bold rounded-lg hover:opacity-90 transition-all"
            >
              <Printer size={20} />
              Print Sticker
            </button>
          </div>
        </div>

        {/* Sticker Preview */}
        <div className="flex justify-center">
          {/* Engine Service Sticker - Portrait 9:16 */}
          {stickerType === "engine" && (
            <StickerShell>
              <div className="relative z-10 flex h-full flex-col px-7 py-7">
                <StickerHeader maxWidth={240} />

                <div className="mt-7">
                  <StickerTitle title="ENGINE SERVICE" size={50} />
                </div>

                <div className="mt-6 text-center">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Assembled with pride by</div>
                  <div className="mt-0.5 text-3xl text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Maciej Cymerys
                  </div>
                </div>

                <div className="mt-8">
                  <SectionLabel>Work Completed</SectionLabel>
                  <div className="space-y-2.5">
                    <CheckItem checked={rodBearings} label="Rod Bearings" />
                    <CheckItem checked={mainBearings} label="Main Bearings" />
                    <CheckItem checked={timingChain} label="Timing Chain" />
                  </div>
                </div>

                <div className="mt-8">
                  <SectionLabel>Service Details</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <DataField label="Date" value={fmtDate(date)} />
                    <DataField label="Mileage" value={mileage ? `${mileage} km` : "—"} />
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <StickerFooter ctaTitle="Book a Service" ctaSub="Scan to enquire" />
                </div>
              </div>
            </StickerShell>
          )}

          {/* Complete Engine Rebuild Sticker - Portrait 9:16 (certificate style) */}
          {stickerType === "rebuild" && (
            <StickerShell>
              <div className="relative z-10 flex h-full flex-col px-7 py-7">
                <StickerHeader maxWidth={240} />

                <div className="mt-6">
                  <StickerTitle overline="Certificate of" title="ENGINE REBUILD" size={50} />
                </div>

                {/* Hero statement fills the tall middle */}
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: GRADIENT }}>
                      <Cog size={28} color="white" />
                    </div>
                  </div>
                  <p className="text-[28px] leading-snug text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Rebuilt to M&nbsp;Coding standards
                  </p>
                  <p className="mt-1 text-[28px] text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    by Maciej Cymerys
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DataField label="Build Date" value={fmtDate(date)} />
                  <DataField label="Mileage" value={mileage ? `${mileage} km` : "—"} />
                </div>

                <div className="mt-6">
                  <StickerFooter ctaTitle="Our Workshop" ctaSub="Scan to view" />
                </div>
              </div>
            </StickerShell>
          )}

          {/* Regular Service Sticker - Portrait 9:16 */}
          {stickerType === "service" && (
            <StickerShell>
              <div className="relative z-10 flex h-full flex-col px-6 py-6">
                <StickerHeader maxWidth={220} />

                <div className="mt-5">
                  <StickerTitle title="SERVICE RECORD" size={44} />
                </div>

                <div className="mt-6">
                  <SectionLabel>Work Completed</SectionLabel>
                  <div className="grid grid-cols-2 gap-2.5">
                    <CheckItem checked={liquiMolyOil} label="Liqui Moly Oil" />
                    <CheckItem checked={oilFilter} label="Oil Filter" />
                    <CheckItem checked={airFilter} label="Air Filter" />
                    <CheckItem checked={fuelFilter} label="Fuel Filter" />
                    <CheckItem checked={cabinFilter} label="Cabin Filter" />
                    <CheckItem checked={sparkPlugs} label="Spark Plugs" />
                  </div>
                </div>

                <div className="mt-5">
                  <SectionLabel>This Service</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <DataField label="Date" value={fmtDate(date)} />
                    <DataField label="Mileage" value={mileage ? `${mileage} km` : "—"} />
                  </div>
                </div>

                <div className="mt-4">
                  <SectionLabel>Next Service Due</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <DataField label="Date" value={fmtDate(nextServiceDate)} accent />
                    <DataField label="Or At" value={nextServiceMileage ? `${nextServiceMileage} km` : "—"} accent />
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <StickerFooter
                    qrValue="https://m-coding.ie/services#pricing"
                    ctaTitle="Book Next Service"
                    ctaSub="Scan QR code"
                  />
                </div>
              </div>
            </StickerShell>
          )}
        </div>

        {/* Print Instructions */}
        <div className="max-w-md mx-auto mt-8 p-4 bg-zinc-900/50 border border-white/10 rounded-xl print:hidden">
          <h3 className="text-white font-semibold mb-2">Instructions:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• <strong className="text-white">Download PNG:</strong> Saves a high-resolution image file</li>
            <li>• <strong className="text-white">Print:</strong> Opens print dialog for direct printing</li>
            <li>• Use waterproof/vinyl sticker paper for durability</li>
            <li>• Recommended size: 75mm x 133mm (portrait, 9:16)</li>
            <li>• Apply to a clean, dry surface in the engine bay</li>
          </ul>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .sticker-preview {
            margin: 0 auto;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
