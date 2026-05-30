"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Download, Printer, Loader2, Check, Wrench, Settings } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type StickerType = "engine" | "service";

export default function EngineStickerPage() {
  // Sticker type selector
  const [stickerType, setStickerType] = useState<StickerType>("engine");

  // Engine service sticker state
  const [rodBearings, setRodBearings] = useState(false);
  const [mainBearings, setMainBearings] = useState(false);
  const [timingChain, setTimingChain] = useState(false);
  const [engineRebuild, setEngineRebuild] = useState(false);

  // Regular service sticker state
  const [oilFilter, setOilFilter] = useState(false);
  const [airFilter, setAirFilter] = useState(false);
  const [fuelFilter, setFuelFilter] = useState(false);
  const [cabinFilter, setCabinFilter] = useState(false);
  const [sparkPlugs, setSparkPlugs] = useState(false);

  // Common fields
  const [date, setDate] = useState("");
  const [mileage, setMileage] = useState("");

  // Next service fields (for regular service)
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!stickerRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(stickerRef.current, {
        backgroundColor: null,
        scale: 3, // High resolution
        useCORS: true,
        logging: false,
      });

      // Convert to PNG and download
      const link = document.createElement("a");
      const dateStr = date ? new Date(date).toISOString().split("T")[0] : "undated";
      const prefix = stickerType === "engine" ? "engine-sticker" : "service-sticker";
      link.download = `${prefix}-${dateStr}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reusable checkbox component for sticker - now using consistent gradient colors
  const StickerCheckbox = ({ checked, label }: { checked: boolean; label: string }) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 rounded border-2 ${checked ? 'border-purple-500' : 'border-gray-500'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: checked ? 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444)' : 'transparent',
          }}
        >
          {checked && (
            <Check
              size={14}
              strokeWidth={3}
              color="white"
              style={{ display: 'block' }}
            />
          )}
        </div>
        <span className="text-gray-300 text-xs font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Service Sticker Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate professional service stickers for the engine bay</p>

        {/* Sticker Type Tabs */}
        <div className="max-w-md mx-auto mb-6 print:hidden">
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
          {/* Date and Mileage - Common to both */}
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
            <div className="grid grid-cols-2 gap-4">
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={engineRebuild}
                  onChange={(e) => setEngineRebuild(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Engine Rebuild</span>
              </label>
            </div>
          )}

          {/* Regular Service Checkboxes */}
          {stickerType === "service" && (
            <div className="grid grid-cols-2 gap-4">
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
              <label className="flex items-center gap-2 cursor-pointer col-span-2">
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
          <div
            ref={stickerRef}
            className="sticker-preview bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-transparent rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: stickerType === "service" ? "360px" : "320px",
              borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444) 1",
            }}
          >
            {/* Gradient Border Effect */}
            <div className="relative">
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

              {/* Content */}
              <div className="p-4">
                {/* Logo - Much bigger, almost filling the width */}
                <div className="flex justify-center mb-2">
                  <Image
                    src="/LogoFinal-01.png"
                    alt="M Coding Ireland"
                    width={320}
                    height={100}
                    className="w-full max-w-[280px] h-auto"
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-3">
                  <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 uppercase tracking-widest">
                    {stickerType === "engine" ? "Engine Service Record" : "Service Record"}
                  </h2>
                </div>

                {/* Engine Service Checkboxes */}
                {stickerType === "engine" && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                    <StickerCheckbox checked={rodBearings} label="Rod Bearings" />
                    <StickerCheckbox checked={mainBearings} label="Main Bearings" />
                    <StickerCheckbox checked={timingChain} label="Timing Chain" />
                    <StickerCheckbox checked={engineRebuild} label="Engine Rebuild" />
                  </div>
                )}

                {/* Regular Service Checkboxes */}
                {stickerType === "service" && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                    <StickerCheckbox checked={oilFilter} label="Oil Filter" />
                    <StickerCheckbox checked={airFilter} label="Air Filter" />
                    <StickerCheckbox checked={fuelFilter} label="Fuel Filter" />
                    <StickerCheckbox checked={cabinFilter} label="Cabin Filter" />
                    <StickerCheckbox checked={sparkPlugs} label="Spark Plugs" />
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />

                {/* Date and Mileage */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-black/40 rounded-lg p-2.5 border border-white/10">
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Date</div>
                    <div className="text-white font-bold text-xs">
                      {date ? new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '___/___/______'}
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-2.5 border border-white/10">
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Mileage</div>
                    <div className="text-white font-bold text-xs">
                      {mileage ? `${mileage} km` : '__________ km'}
                    </div>
                  </div>
                </div>

                {/* Next Service - Only for Regular Service */}
                {stickerType === "service" && (
                  <>
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider text-center mb-2">Next Service Due</div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-2.5 border border-blue-500/20">
                        <div className="text-[9px] text-blue-400 uppercase tracking-wider mb-0.5">Date</div>
                        <div className="text-white font-bold text-xs">
                          {nextServiceDate ? new Date(nextServiceDate).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '___/___/______'}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-2.5 border border-blue-500/20">
                        <div className="text-[9px] text-blue-400 uppercase tracking-wider mb-0.5">Or At</div>
                        <div className="text-white font-bold text-xs">
                          {nextServiceMileage ? `${nextServiceMileage} km` : '__________ km'}
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="bg-white p-1.5 rounded-lg">
                        <QRCodeSVG
                          value="https://m-coding.ie/services#pricing"
                          size={50}
                          level="M"
                          bgColor="white"
                          fgColor="black"
                        />
                      </div>
                      <div className="text-[9px] text-gray-400 leading-tight">
                        <div className="font-semibold text-white mb-0.5">Book Your Next Service</div>
                        <div>Scan to visit</div>
                        <div className="text-blue-400">m-coding.ie</div>
                      </div>
                    </div>
                  </>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-white/10 text-center">
                  <p className="text-[9px] text-gray-500">
                    www.m-coding.ie • Ardfinnan, Co. Tipperary
                  </p>
                </div>
              </div>

              {/* Bottom gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
            </div>
          </div>
        </div>

        {/* Print Instructions */}
        <div className="max-w-md mx-auto mt-8 p-4 bg-zinc-900/50 border border-white/10 rounded-xl print:hidden">
          <h3 className="text-white font-semibold mb-2">Instructions:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• <strong className="text-white">Download PNG:</strong> Saves a high-resolution image file</li>
            <li>• <strong className="text-white">Print:</strong> Opens print dialog for direct printing</li>
            <li>• Use waterproof/vinyl sticker paper for durability</li>
            <li>• Recommended size: 80mm x 100mm</li>
            <li>• Apply to a clean, dry surface in the engine bay</li>
            <li>• Avoid areas with extreme heat</li>
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
