"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Gauge, TrendingUp, Zap, CheckCircle, Info } from "lucide-react";

type RemapData = {
  series: string;
  model: string;
  year: string;
  engine: string;
  stockHP: number;
  stockNM: number;
  stage1HP: number;
  stage1NM: number;
  availableOptions: string[];
};

// Diesel options available for all diesel variants
const dieselOptions = [
  "Specific DTC Disable",
  "Swirl-flap solution",
  "DPF Solution",
  "EGR Solution",
  "Speed Limiter Disable"
];

// Additional options for LCI models with Adblue
const dieselOptionsWithAdblue = [
  "Specific DTC Disable",
  "Swirl-flap solution",
  "DPF Solution",
  "EGR Solution",
  "Speed Limiter Disable",
  "Adblue Delete"
];

// Petrol options
const petrolOptions = [
  "Speed Limiter Disable",
  "Launch Control",
  "Pop & Bang (Crackle Map)",
  "Specific DTC Disable"
];

// Hybrid options
const hybridOptions = [
  "Speed Limiter Disable",
  "Specific DTC Disable"
];

// Add your BMW models with accurate Stage 1 remap data here
const bmwRemapData: RemapData[] = [
  // 1 Series - Petrol
  { series: "1 Series", model: "116i", year: "F20", engine: "1.6 Petrol - 136hp", stockHP: 136, stockNM: 220, stage1HP: 165, stage1NM: 300, availableOptions: petrolOptions },
  { series: "1 Series", model: "118i", year: "F20", engine: "1.5 Petrol - 170hp", stockHP: 170, stockNM: 250, stage1HP: 220, stage1NM: 310, availableOptions: petrolOptions },
  { series: "1 Series", model: "118i", year: "F20 LCI", engine: "1.5 Petrol - 170hp", stockHP: 170, stockNM: 250, stage1HP: 220, stage1NM: 310, availableOptions: petrolOptions },
  { series: "1 Series", model: "M135i", year: "F20 <07/13", engine: "3.0 Petrol - 320hp", stockHP: 320, stockNM: 450, stage1HP: 365, stage1NM: 520, availableOptions: petrolOptions },
  { series: "1 Series", model: "M135i", year: "F20 LCI", engine: "3.0 Petrol - 326hp", stockHP: 326, stockNM: 450, stage1HP: 380, stage1NM: 520, availableOptions: petrolOptions },
  { series: "1 Series", model: "M140i", year: "F20 LCI", engine: "3.0 Petrol - 340hp", stockHP: 340, stockNM: 500, stage1HP: 400, stage1NM: 580, availableOptions: petrolOptions },

  // 1 Series - Diesel
  { series: "1 Series", model: "116d", year: "F20", engine: "2.0 Diesel - 116hp", stockHP: 116, stockNM: 270, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptions },
  { series: "1 Series", model: "116d", year: "F20 LCI", engine: "2.0 Diesel - 116hp", stockHP: 116, stockNM: 270, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptionsWithAdblue },
  { series: "1 Series", model: "118d", year: "F20", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "1 Series", model: "118d", year: "F20", engine: "2.0 Diesel - 143hp", stockHP: 143, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "1 Series", model: "118d", year: "F20 LCI", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "1 Series", model: "118d", year: "F20 LCI", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "1 Series", model: "120d", year: "F20", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "1 Series", model: "120d", year: "F20", engine: "2.0 Diesel - 184hp", stockHP: 184, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "1 Series", model: "120d", year: "F20 LCI", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "1 Series", model: "120d", year: "F20 LCI", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },

  // 2 Series
  { series: "2 Series", model: "216d", year: "F22", engine: "2.0 Diesel - 116hp", stockHP: 116, stockNM: 270, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptions },
  { series: "2 Series", model: "218d", year: "F22", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "2 Series", model: "218d", year: "F22", engine: "2.0 Diesel - 143hp", stockHP: 143, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "2 Series", model: "218d", year: "F22 LCI", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "2 Series", model: "220d", year: "F22", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "2 Series", model: "220d", year: "F22", engine: "2.0 Diesel - 184hp", stockHP: 184, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "2 Series", model: "220d", year: "F22", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },

  // 3 Series - Petrol
  { series: "3 Series", model: "316i", year: "F30", engine: "1.6 Petrol - 136hp", stockHP: 136, stockNM: 220, stage1HP: 165, stage1NM: 300, availableOptions: petrolOptions },
  { series: "3 Series", model: "335i", year: "F30", engine: "3.0 Petrol - 306hp", stockHP: 306, stockNM: 400, stage1HP: 365, stage1NM: 520, availableOptions: petrolOptions },
  { series: "3 Series", model: "340i", year: "F30 LCI", engine: "3.0 Petrol - 326hp", stockHP: 326, stockNM: 450, stage1HP: 400, stage1NM: 580, availableOptions: petrolOptions },

  // 3 Series - Hybrid
  { series: "3 Series", model: "330e", year: "F30 LCI", engine: "2.0 Hybrid - 252hp", stockHP: 252, stockNM: 420, stage1HP: 310, stage1NM: 500, availableOptions: hybridOptions },

  // 3 Series - Diesel
  { series: "3 Series", model: "316d", year: "F30", engine: "2.0 Diesel - 116hp", stockHP: 116, stockNM: 270, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptions },
  { series: "3 Series", model: "316d", year: "F30 LCI", engine: "2.0 Diesel - 116hp", stockHP: 116, stockNM: 270, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "318d", year: "F30", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "3 Series", model: "318d", year: "F30", engine: "2.0 Diesel - 143hp", stockHP: 143, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "3 Series", model: "318d", year: "F30 LCI", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "318d", year: "F30 LCI", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "320d", year: "F30", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "3 Series", model: "320d", year: "F30", engine: "2.0 Diesel - 184hp", stockHP: 184, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "3 Series", model: "320d", year: "F30 LCI", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "330d", year: "F30", engine: "3.0 Diesel - 258hp", stockHP: 258, stockNM: 560, stage1HP: 310, stage1NM: 650, availableOptions: dieselOptions },
  { series: "3 Series", model: "330d", year: "F30 LCI", engine: "3.0 Diesel - 258hp", stockHP: 258, stockNM: 560, stage1HP: 310, stage1NM: 650, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "335xd", year: "F30", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptions },
  { series: "3 Series", model: "335xd", year: "F30 LCI", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "318d", year: "G20", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 320, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "320d", year: "G20", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 225, stage1NM: 430, availableOptions: dieselOptionsWithAdblue },
  { series: "3 Series", model: "330d", year: "G20", engine: "3.0 Diesel - 265hp", stockHP: 265, stockNM: 620, stage1HP: 310, stage1NM: 720, availableOptions: dieselOptionsWithAdblue },

  // 4 Series - Petrol
  { series: "4 Series", model: "418i", year: "F32/F33", engine: "1.5 Petrol - 136hp", stockHP: 136, stockNM: 220, stage1HP: 165, stage1NM: 300, availableOptions: petrolOptions },
  { series: "4 Series", model: "440i", year: "F32/F33", engine: "3.0 Petrol - 326hp", stockHP: 326, stockNM: 450, stage1HP: 400, stage1NM: 580, availableOptions: petrolOptions },

  // 4 Series - Diesel
  { series: "4 Series", model: "418d", year: "F32/F33", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "4 Series", model: "418d", year: "F32/F33 LCI", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptionsWithAdblue },
  { series: "4 Series", model: "420d", year: "F32/F33", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "4 Series", model: "420d", year: "F32/F33", engine: "2.0 Diesel - 184hp", stockHP: 184, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "4 Series", model: "420d", year: "F32/F33", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "4 Series", model: "430d", year: "F32/F33", engine: "3.0 Diesel - 258hp", stockHP: 258, stockNM: 560, stage1HP: 310, stage1NM: 650, availableOptions: dieselOptions },
  { series: "4 Series", model: "435d", year: "F32/F33", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptions },
  { series: "4 Series", model: "420d", year: "G22", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 225, stage1NM: 430, availableOptions: dieselOptionsWithAdblue },
  { series: "4 Series", model: "430d", year: "G22", engine: "3.0 Diesel - 265hp", stockHP: 265, stockNM: 620, stage1HP: 310, stage1NM: 720, availableOptions: dieselOptionsWithAdblue },

  // 5 Series - Petrol
  { series: "5 Series", model: "540i", year: "G30", engine: "3.0 Petrol - 340hp", stockHP: 340, stockNM: 450, stage1HP: 405, stage1NM: 590, availableOptions: petrolOptions },

  // 5 Series - Hybrid
  { series: "5 Series", model: "530e", year: "G30", engine: "2.0 Hybrid - 252hp", stockHP: 252, stockNM: 420, stage1HP: 340, stage1NM: 440, availableOptions: hybridOptions },

  // 5 Series - Diesel
  { series: "5 Series", model: "518d", year: "F10", engine: "2.0 Diesel - 136hp", stockHP: 136, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "518d", year: "F10", engine: "2.0 Diesel - 143hp", stockHP: 143, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "518d", year: "F10", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 360, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "520d", year: "F10", engine: "2.0 Diesel - 163hp", stockHP: 163, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "520d", year: "F10", engine: "2.0 Diesel - 184hp", stockHP: 184, stockNM: 380, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "520d", year: "F10", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 220, stage1NM: 440, availableOptions: dieselOptions },
  { series: "5 Series", model: "530d", year: "F10", engine: "3.0 Diesel - 245hp", stockHP: 245, stockNM: 540, stage1HP: 300, stage1NM: 620, availableOptions: dieselOptions },
  { series: "5 Series", model: "530d", year: "F10", engine: "3.0 Diesel - 258hp", stockHP: 258, stockNM: 560, stage1HP: 310, stage1NM: 650, availableOptions: dieselOptions },
  { series: "5 Series", model: "535d", year: "F10", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptions },
  { series: "5 Series", model: "518d", year: "G30", engine: "2.0 Diesel - 150hp", stockHP: 150, stockNM: 320, stage1HP: 190, stage1NM: 400, availableOptions: dieselOptionsWithAdblue },
  { series: "5 Series", model: "520d", year: "G30", engine: "2.0 Diesel - 190hp", stockHP: 190, stockNM: 400, stage1HP: 225, stage1NM: 430, availableOptions: dieselOptionsWithAdblue },
  { series: "5 Series", model: "530d", year: "G30", engine: "3.0 Diesel - 265hp", stockHP: 265, stockNM: 620, stage1HP: 310, stage1NM: 720, availableOptions: dieselOptionsWithAdblue },
  { series: "5 Series", model: "540d", year: "G30", engine: "3.0 Diesel - 320hp", stockHP: 320, stockNM: 680, stage1HP: 400, stage1NM: 800, availableOptions: dieselOptionsWithAdblue },

  // 6 Series
  { series: "6 Series", model: "640d", year: "F06/F13", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptions },

  // 7 Series - Hybrid
  { series: "7 Series", model: "740e", year: "G11/G12", engine: "2.0 Hybrid - 258hp", stockHP: 258, stockNM: 400, stage1HP: 365, stage1NM: 600, availableOptions: hybridOptions },

  // 7 Series - Diesel
  { series: "7 Series", model: "730d", year: "F01", engine: "3.0 Diesel - 245hp", stockHP: 245, stockNM: 540, stage1HP: 300, stage1NM: 620, availableOptions: dieselOptions },
  { series: "7 Series", model: "730d", year: "F01", engine: "3.0 Diesel - 258hp", stockHP: 258, stockNM: 560, stage1HP: 310, stage1NM: 650, availableOptions: dieselOptions },
  { series: "7 Series", model: "740d", year: "F01", engine: "3.0 Diesel - 313hp", stockHP: 313, stockNM: 630, stage1HP: 360, stage1NM: 700, availableOptions: dieselOptions },
  { series: "7 Series", model: "730d", year: "G11/G12", engine: "3.0 Diesel - 265hp", stockHP: 265, stockNM: 620, stage1HP: 310, stage1NM: 720, availableOptions: dieselOptionsWithAdblue },
  { series: "7 Series", model: "740d", year: "G11/G12", engine: "3.0 Diesel - 320hp", stockHP: 320, stockNM: 680, stage1HP: 400, stage1NM: 800, availableOptions: dieselOptionsWithAdblue },

  // 8 Series
  { series: "8 Series", model: "840d", year: "G15", engine: "3.0 Diesel - 320hp", stockHP: 320, stockNM: 680, stage1HP: 400, stage1NM: 800, availableOptions: dieselOptionsWithAdblue },
];

export default function RemapCalculator() {
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  // Get unique series
  const availableSeries = useMemo(() => {
    const series = [...new Set(bmwRemapData.map(d => d.series))];
    return series.sort();
  }, []);

  // Get models based on selected series
  const availableModels = useMemo(() => {
    if (!selectedSeries) return [];
    const models = [...new Set(bmwRemapData.filter(d => d.series === selectedSeries).map(d => d.model))];
    return models.sort();
  }, [selectedSeries]);

  // Get years based on selected series and model
  const availableYears = useMemo(() => {
    if (!selectedSeries || !selectedModel) return [];
    const years = [...new Set(bmwRemapData.filter(d => d.series === selectedSeries && d.model === selectedModel).map(d => d.year))];
    return years.sort();
  }, [selectedSeries, selectedModel]);

  // Get engines based on selected series, model and year
  const availableEngines = useMemo(() => {
    if (!selectedSeries || !selectedModel || !selectedYear) return [];
    const engines = [...new Set(bmwRemapData.filter(d => d.series === selectedSeries && d.model === selectedModel && d.year === selectedYear).map(d => d.engine))];
    return engines.sort();
  }, [selectedSeries, selectedModel, selectedYear]);

  // Get the selected remap data
  const remapData = useMemo(() => {
    if (!selectedSeries || !selectedModel || !selectedYear || !selectedEngine) return null;
    return bmwRemapData.find(d => d.series === selectedSeries && d.model === selectedModel && d.year === selectedYear && d.engine === selectedEngine);
  }, [selectedSeries, selectedModel, selectedYear, selectedEngine]);

  const handleSeriesChange = (series: string) => {
    setSelectedSeries(series);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedEngine("");
    setShowResults(false);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedYear("");
    setSelectedEngine("");
    setShowResults(false);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedEngine("");
    setShowResults(false);
  };

  const handleEngineChange = (engine: string) => {
    setSelectedEngine(engine);
    setShowResults(true);
  };

  const hpGain = remapData ? remapData.stage1HP - remapData.stockHP : 0;
  const nmGain = remapData ? remapData.stage1NM - remapData.stockNM : 0;
  const hpPercentage = remapData ? ((hpGain / remapData.stockHP) * 100).toFixed(1) : "0";
  const nmPercentage = remapData ? ((nmGain / remapData.stockNM) * 100).toFixed(1) : "0";

  return (
    <div id="remapping" className="w-full py-20 bg-gradient-to-b from-zinc-950 to-black relative scroll-mt-20">
      {/* Top Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-purple-500/5 blur-3xl" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Stage 1 Performance</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              BMW Remap <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Calculator</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Select your BMW model to see Stage 1 remap performance gains
            </p>
          </div>

          {/* Model Selectors */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Series Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Series
                </label>
                <select
                  value={selectedSeries}
                  onChange={(e) => handleSeriesChange(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="">Select Series</option>
                  {availableSeries.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={!selectedSeries}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Model</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generation Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Generation
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  disabled={!selectedModel}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Generation</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engine Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Engine
                </label>
                <select
                  value={selectedEngine}
                  onChange={(e) => handleEngineChange(e.target.value)}
                  disabled={!selectedYear}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Engine</option>
                  {availableEngines.map((engine) => (
                    <option key={engine} value={engine}>
                      {engine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Not Seeing Your BMW */}
            <div className="mt-6 p-4 bg-black/30 border border-white/10 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Info className="w-5 h-5 text-blue-400" />
                <span className="text-sm">
                  Not seeing your BMW?{" "}
                  <Link
                    href="/contact?subject=Remap Calculator Model Request"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    Let us know which model, year and engine
                  </Link>
                  {" "}so we can improve this experience
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && remapData && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Model Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{remapData.model} {remapData.year}</h3>
                <p className="text-gray-400">{remapData.engine} Engine</p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Horsepower Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Gauge className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Horsepower (HP)</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stock:</span>
                      <span className="text-2xl font-bold text-white">{remapData.stockHP} HP</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stage 1:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        {remapData.stage1HP} HP
                      </span>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Gain:</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-xl font-bold text-green-400">+{hpGain} HP</span>
                          <span className="text-sm text-gray-400">({hpPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Torque Card */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Torque (Nm)</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stock:</span>
                      <span className="text-2xl font-bold text-white">{remapData.stockNM} Nm</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stage 1:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        {remapData.stage1NM} Nm
                      </span>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Gain:</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-xl font-bold text-green-400">+{nmGain} Nm</span>
                          <span className="text-sm text-gray-400">({nmPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-gray-300 mb-2">
                  Total Performance Increase
                </p>
                <p className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    +{hpGain} HP
                  </span>
                  <span className="text-white mx-3">/</span>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
                    +{nmGain} Nm
                  </span>
                </p>
              </div>

              {/* Options Available */}
              {remapData.availableOptions && remapData.availableOptions.length > 0 && (
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4 text-center">Options Available</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {remapData.availableOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="text-center pt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Zap className="w-5 h-5" />
                  Book Your Stage 1 Remap
                </a>
              </div>

              {/* Results Disclaimer */}
              <div className="mt-8 p-4 bg-zinc-900/30 border border-white/5 rounded-xl">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  <strong className="text-gray-300">*Performance Disclaimer:</strong> The figures shown are approximate and based on optimal conditions.
                  Actual results may vary depending on vehicle condition, fuel quality, ambient temperature, and modifications.
                </p>
              </div>
            </div>
          )}

          {/* General Disclaimer - Always Visible */}
          <div className="mt-8 p-6 bg-black/30 border border-white/5 rounded-xl max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Performance Information</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  All performance figures displayed are approximate estimates based on typical results achieved under optimal conditions.
                  Individual results may vary based on factors including but not limited to: vehicle condition, maintenance history, fuel quality,
                  ambient temperature, altitude, and existing modifications. Contact us for a personalized consultation and
                  accurate expectations for your specific vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
