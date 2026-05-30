"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Download, Printer, Loader2, Check } from "lucide-react";

export default function EngineStickerPage() {
  const [rodBearings, setRodBearings] = useState(false);
  const [mainBearings, setMainBearings] = useState(false);
  const [timingChain, setTimingChain] = useState(false);
  const [engineRebuild, setEngineRebuild] = useState(false);
  const [date, setDate] = useState("");
  const [mileage, setMileage] = useState("");
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
      link.download = `engine-sticker-${dateStr}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reusable checkbox component for sticker
  const StickerCheckbox = ({ checked, color, label }: { checked: boolean; color: string; label: string }) => {
    const colorClasses: Record<string, string> = {
      blue: checked ? 'bg-blue-500 border-blue-500' : 'border-gray-500',
      purple: checked ? 'bg-purple-500 border-purple-500' : 'border-gray-500',
      red: checked ? 'bg-red-500 border-red-500' : 'border-gray-500',
      gradient: checked ? 'bg-purple-500 border-purple-500' : 'border-gray-500',
    };

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 rounded border-2 ${colorClasses[color]}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
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
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Engine Service Sticker Generator</h1>
        <p className="text-gray-400 text-center mb-8">Fill in the details below and print or download the sticker for the engine bay</p>

        {/* Controls - Hidden when printing */}
        <div className="max-w-md mx-auto mb-8 space-y-4 print:hidden">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
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

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rodBearings}
                onChange={(e) => setRodBearings(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-white">Rod Bearings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mainBearings}
                onChange={(e) => setMainBearings(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-white">Main Bearings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={timingChain}
                onChange={(e) => setTimingChain(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-white">Timing Chain</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={engineRebuild}
                onChange={(e) => setEngineRebuild(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-white">Engine Rebuild</span>
            </label>
          </div>

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
              width: "320px",
              borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ef4444) 1",
            }}
          >
            {/* Gradient Border Effect */}
            <div className="relative">
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />

              {/* Content */}
              <div className="p-5">
                {/* Logo - Made bigger */}
                <div className="flex justify-center mb-3">
                  <Image
                    src="/LogoFinal-01.png"
                    alt="M Coding Ireland"
                    width={260}
                    height={80}
                    className="h-16 w-auto"
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 uppercase tracking-widest">
                    Engine Service Record
                  </h2>
                </div>

                {/* Checkboxes Grid - Using SVG Check icons for proper rendering */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                  <StickerCheckbox checked={rodBearings} color="blue" label="Rod Bearings" />
                  <StickerCheckbox checked={mainBearings} color="purple" label="Main Bearings" />
                  <StickerCheckbox checked={timingChain} color="red" label="Timing Chain" />
                  <StickerCheckbox checked={engineRebuild} color="gradient" label="Engine Rebuild" />
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4" />

                {/* Date and Mileage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Date</div>
                    <div className="text-white font-bold text-sm">
                      {date ? new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) : '___/___/______'}
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Mileage</div>
                    <div className="text-white font-bold text-sm">
                      {mileage ? `${mileage} km` : '__________ km'}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 text-center">
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
