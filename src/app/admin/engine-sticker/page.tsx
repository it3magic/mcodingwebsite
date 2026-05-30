"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Download, Printer, Loader2, Check, Wrench, Settings, Cog } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type StickerType = "engine" | "rebuild" | "service";

export default function EngineStickerPage() {
  // Sticker type selector
  const [stickerType, setStickerType] = useState<StickerType>("engine");

  // Engine service sticker state (removed engineRebuild)
  const [rodBearings, setRodBearings] = useState(false);
  const [mainBearings, setMainBearings] = useState(false);
  const [timingChain, setTimingChain] = useState(false);

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

  // Checkbox component for stickers
  const StickerCheckbox = ({ checked, label, large = false }: { checked: boolean; label: string; large?: boolean }) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`${large ? 'w-6 h-6' : 'w-5 h-5'} rounded border-2 ${checked ? 'border-purple-500' : 'border-gray-600'}`}
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
              size={large ? 16 : 14}
              strokeWidth={3}
              color="white"
              style={{ display: 'block' }}
            />
          )}
        </div>
        <span className={`text-gray-200 ${large ? 'text-sm font-semibold' : 'text-xs font-medium'} tracking-wide`}>{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
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

          {/* Engine Service Checkboxes - No Engine Rebuild */}
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
          {/* Engine Service Sticker - Landscape */}
          {stickerType === "engine" && (
            <div
              ref={stickerRef}
              className="sticker-preview bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: "520px",
                border: "3px solid transparent",
                borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444) 1",
              }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

              <div className="p-5">
                {/* Header - Big Logo */}
                <div className="flex justify-center mb-3">
                  <Image
                    src="/LogoFinal-01.png"
                    alt="M Coding Ireland"
                    width={400}
                    height={120}
                    className="w-full max-w-[380px] h-auto"
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-red-500/50 mb-4" />

                {/* Content Row */}
                <div className="flex gap-6">
                  {/* Left Side - Checkboxes */}
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Work Completed</div>
                    <div className="space-y-2">
                      <StickerCheckbox checked={rodBearings} label="Rod Bearings" large />
                      <StickerCheckbox checked={mainBearings} label="Main Bearings" large />
                      <StickerCheckbox checked={timingChain} label="Timing Chain" large />
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

                  {/* Right Side - Date and Mileage */}
                  <div className="w-44">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Service Details</div>
                    <div className="space-y-2">
                      <div className="bg-black/50 rounded-lg p-3 border border-white/10">
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Date</div>
                        <div className="text-white font-bold text-sm">
                          {date ? new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '__ / ___ / ____'}
                        </div>
                      </div>
                      <div className="bg-black/50 rounded-lg p-3 border border-white/10">
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Mileage</div>
                        <div className="text-white font-bold text-sm">
                          {mileage ? `${mileage} km` : '________ km'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assembled by text */}
                <div className="mt-4 pt-3 border-t border-white/10 text-center">
                  <p className="text-sm text-gray-300 italic">
                    Assembled with pride by: <span className="text-white font-semibold not-italic">Maciej Cymerys</span>
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-between text-[9px] text-gray-500">
                  <span>BMW & MINI Specialist</span>
                  <span className="text-gray-400 font-medium">www.m-coding.ie</span>
                  <span>Ardfinnan, Co. Tipperary</span>
                </div>
              </div>

              <div className="h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
            </div>
          )}

          {/* Complete Engine Rebuild Sticker - Landscape */}
          {stickerType === "rebuild" && (
            <div
              ref={stickerRef}
              className="sticker-preview bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: "520px",
                border: "3px solid transparent",
                borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444) 1",
              }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

              <div className="p-5">
                {/* Header - Big Logo */}
                <div className="flex justify-center mb-3">
                  <Image
                    src="/LogoFinal-01.png"
                    alt="M Coding Ireland"
                    width={400}
                    height={120}
                    className="w-full max-w-[380px] h-auto"
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 uppercase tracking-wider">
                    Complete Engine Rebuild
                  </h2>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-red-500/50 mb-4" />

                {/* Date and Mileage - Centered */}
                <div className="flex justify-center gap-6 mb-4">
                  <div className="w-44 bg-black/50 rounded-lg p-3 border border-white/10">
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider text-center">Date</div>
                    <div className="text-white font-bold text-lg text-center">
                      {date ? new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '__ / ___ / ____'}
                    </div>
                  </div>
                  <div className="w-44 bg-black/50 rounded-lg p-3 border border-white/10">
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider text-center">Mileage</div>
                    <div className="text-white font-bold text-lg text-center">
                      {mileage ? `${mileage} km` : '________ km'}
                    </div>
                  </div>
                </div>

                {/* Assembled by text */}
                <div className="pt-3 border-t border-white/10 text-center">
                  <p className="text-sm text-gray-300 italic">
                    Assembled with pride by: <span className="text-white font-semibold not-italic">Maciej Cymerys</span>
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-between text-[9px] text-gray-500">
                  <span>BMW & MINI Specialist</span>
                  <span className="text-gray-400 font-medium">www.m-coding.ie</span>
                  <span>Ardfinnan, Co. Tipperary</span>
                </div>
              </div>

              <div className="h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
            </div>
          )}

          {/* Regular Service Sticker - Landscape */}
          {stickerType === "service" && (
            <div
              ref={stickerRef}
              className="sticker-preview bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: "520px",
                border: "3px solid transparent",
                borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444) 1",
              }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

              <div className="p-4">
                {/* Header Row - Logo and Title */}
                <div className="flex items-center justify-between mb-3">
                  <Image
                    src="/LogoFinal-01.png"
                    alt="M Coding Ireland"
                    width={220}
                    height={70}
                    className="h-12 w-auto"
                  />
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 uppercase tracking-wider">
                      Service Record
                    </h2>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-red-500/50 mb-3" />

                {/* Content Row */}
                <div className="flex gap-4">
                  {/* Left Side - Checkboxes */}
                  <div className="flex-1">
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Work Completed</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <StickerCheckbox checked={oilFilter} label="Oil Filter" />
                      <StickerCheckbox checked={airFilter} label="Air Filter" />
                      <StickerCheckbox checked={fuelFilter} label="Fuel Filter" />
                      <StickerCheckbox checked={cabinFilter} label="Cabin Filter" />
                      <StickerCheckbox checked={sparkPlugs} label="Spark Plugs" />
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent" />

                  {/* Right Side - Dates */}
                  <div className="w-48">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-black/50 rounded p-2 border border-white/10">
                        <div className="text-[8px] text-gray-500 uppercase">Date</div>
                        <div className="text-white font-bold text-[11px]">
                          {date ? new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '__/__/____'}
                        </div>
                      </div>
                      <div className="bg-black/50 rounded p-2 border border-white/10">
                        <div className="text-[8px] text-gray-500 uppercase">Mileage</div>
                        <div className="text-white font-bold text-[11px]">
                          {mileage ? `${mileage} km` : '______ km'}
                        </div>
                      </div>
                    </div>
                    <div className="text-[8px] text-gray-500 uppercase text-center mb-1">Next Service</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-900/30 rounded p-2 border border-blue-500/20">
                        <div className="text-[8px] text-blue-400 uppercase">Date</div>
                        <div className="text-white font-bold text-[11px]">
                          {nextServiceDate ? new Date(nextServiceDate).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '__/__/____'}
                        </div>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2 border border-blue-500/20">
                        <div className="text-[8px] text-blue-400 uppercase">Or At</div>
                        <div className="text-white font-bold text-[11px]">
                          {nextServiceMileage ? `${nextServiceMileage} km` : '______ km'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code and Footer */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded">
                      <QRCodeSVG
                        value="https://m-coding.ie/services#pricing"
                        size={36}
                        level="M"
                        bgColor="white"
                        fgColor="black"
                      />
                    </div>
                    <div className="text-[8px] text-gray-400 leading-tight">
                      <div className="font-semibold text-white">Book Next Service</div>
                      <div>Scan QR code</div>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-500">
                    www.m-coding.ie • Ardfinnan, Co. Tipperary
                  </p>
                </div>
              </div>

              <div className="h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
            </div>
          )}
        </div>

        {/* Print Instructions */}
        <div className="max-w-md mx-auto mt-8 p-4 bg-zinc-900/50 border border-white/10 rounded-xl print:hidden">
          <h3 className="text-white font-semibold mb-2">Instructions:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• <strong className="text-white">Download PNG:</strong> Saves a high-resolution image file</li>
            <li>• <strong className="text-white">Print:</strong> Opens print dialog for direct printing</li>
            <li>• Use waterproof/vinyl sticker paper for durability</li>
            <li>• Recommended size: 130mm x 75mm (landscape)</li>
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
