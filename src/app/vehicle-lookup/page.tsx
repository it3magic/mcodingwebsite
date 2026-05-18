"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Car,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Info,
  Fuel,
  Gauge,
  Palette,
  Calendar,
  MapPin,
  Cog,
  Leaf,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap
} from "lucide-react";

// Type definitions based on API response
interface VehicleBasicData {
  vin: string;
  vinShort: string;
  vinWorld: string;
  vinType: string;
  vinYear: string;
  brand: string;
  brandName: string;
  modelCode: string;
  seriesDevt: string;
  series: string;
  model: string;
  bodyType: string;
  bodyTypeName: string;
  steering: string;
  steeringName: string;
  doorCount: string;
  transmissionType: string;
  transmissionName: string;
  powerTransmission: string;
  country: string;
  cubicCapacity: string;
  hybrid: string;
  hybridName: string;
  engineCode: string;
  cylinders: string;
  fuelType: string;
  fuelTypeName: string;
  productionDate: string;
  plant: string;
  powerKW: string;
  marketSalesDescription: string;
  colorCode: string;
  colorName: string;
  colorType: string;
  upholsteryCode: string;
  upholsteryName: string;
  upholsteryType: string;
  interiorColorCode?: string;
  interiorColorName?: string;
  additionalUpholsteryCode?: string;
  additionalUpholsteryName?: string;
  rimCode?: string;
  rimType?: string;
  rimSupplier?: string;
  tyreCode?: string;
}

interface VehicleOption {
  code: string;
  description: string;
  category: string;
}

interface VehicleOptionsData {
  options: VehicleOption[];
}

interface VehicleEmissionsData {
  vinLong: string;
  ecTypeApproval: string;
  emissionClass: string;
  wltpFlag: string;
  wltp: {
    combinedCO2: string;
    combinedFuelConsumption: string;
    electricRange: string;
    electricConsumption: string;
  };
  nedc: {
    combinedCO2: string;
    combinedFuelConsumption: string;
    urbanFuelConsumption: string;
    extraUrbanFuelConsumption: string;
  };
}

// iDrive system detection
function detectiDriveSystem(data: VehicleBasicData): {
  system: string;
  carplaySupport: string;
  recommendation: string;
  color: string;
} {
  const prodDate = data.productionDate ? new Date(data.productionDate) : null;
  const year = prodDate?.getFullYear() || 0;
  const series = data.seriesDevt?.toUpperCase() || "";

  // E-series vehicles
  if (series.startsWith("E")) {
    if (year < 2008) {
      return {
        system: "CCC (Car Communication Computer)",
        carplaySupport: "Not supported natively",
        recommendation: "MMI Box retrofit or aftermarket screen from €350",
        color: "red"
      };
    }
    return {
      system: "CIC (Car Information Computer)",
      carplaySupport: "Not supported natively",
      recommendation: "MMI Box retrofit available from €350",
      color: "red"
    };
  }

  // F-series vehicles
  if (series.startsWith("F")) {
    if (year >= 2012 && year <= 2014) {
      return {
        system: "NBT (Next Big Thing)",
        carplaySupport: "Not supported natively",
        recommendation: "MMI Box retrofit (€250) or NBT EVO retrofit (€1,200)",
        color: "yellow"
      };
    }
    if (year >= 2015 && year <= 2016) {
      return {
        system: "NBT EVO ID4",
        carplaySupport: "Via software flash",
        recommendation: "ID4 to ID5/ID6 flash for €350 - enables native CarPlay!",
        color: "green"
      };
    }
    if (year >= 2016) {
      return {
        system: "NBT EVO (ID5/ID6)",
        carplaySupport: "Via coding activation",
        recommendation: "CarPlay activation via coding: €120",
        color: "green"
      };
    }
  }

  // G-series vehicles
  if (series.startsWith("G") || series.startsWith("U") || series.startsWith("I")) {
    if (year >= 2019 && year <= 2022) {
      return {
        system: "MGU (iDrive 7.0)",
        carplaySupport: "Factory enabled",
        recommendation: "Native wireless CarPlay available",
        color: "green"
      };
    }
    if (year >= 2022) {
      return {
        system: "iDrive 8 / 8.5",
        carplaySupport: "Factory enabled",
        recommendation: "Latest iDrive with native wireless CarPlay",
        color: "green"
      };
    }
  }

  return {
    system: "Unknown",
    carplaySupport: "Contact us for identification",
    recommendation: "Send your VIN via WhatsApp for accurate identification",
    color: "gray"
  };
}

export default function VehicleLookupPage() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "options" | "emissions">("basic");

  const [basicData, setBasicData] = useState<VehicleBasicData | null>(null);
  const [optionsData, setOptionsData] = useState<VehicleOptionsData | null>(null);
  const [emissionsData, setEmissionsData] = useState<VehicleEmissionsData | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleSearch = async (type: "basic" | "options" | "emissions" = "basic") => {
    if (!vin.trim()) {
      setError("Please enter a VIN");
      return;
    }

    const cleanVin = vin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");

    if (cleanVin.length !== 17) {
      setError("VIN must be exactly 17 characters");
      return;
    }

    setLoading(true);
    setLoadingType(type);
    setError(null);

    try {
      const response = await fetch("/api/vehicle/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: cleanVin, type }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch vehicle information");
      }

      if (!result.success) {
        throw new Error(result.error || "Invalid response from API");
      }

      switch (type) {
        case "basic":
          setBasicData(result.data);
          break;
        case "options":
          setOptionsData(result.data);
          break;
        case "emissions":
          setEmissionsData(result.data);
          break;
      }

      setActiveTab(type);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const iDriveInfo = basicData ? detectiDriveSystem(basicData) : null;

  // Group options by category
  const groupedOptions = optionsData?.options?.reduce((acc, option) => {
    const category = option.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(option);
    return acc;
  }, {} as Record<string, VehicleOption[]>);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-purple-950/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Car size={16} />
              <span>BMW Vehicle Identification System</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-white">Vehicle</span>{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                Lookup
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Enter your BMW or MINI VIN to access detailed vehicle specifications,
              factory equipment, emissions data, and compatible upgrade options.
            </p>

            {/* GDPR Notice */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="text-amber-400 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm text-amber-200/80">
                  <span className="font-semibold text-amber-300">EU-GDPR Compliance:</span>{" "}
                  By using this service, you confirm ownership of the vehicle or have explicit
                  consent from the owner to access this information.
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
              <div className="flex flex-col gap-4">
                {/* VIN Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
                      setVin(value);
                      setError(null);
                    }}
                    placeholder="Enter 17-character VIN (e.g., WBAPH5C55BA123456)"
                    maxLength={17}
                    className="w-full pl-12 pr-20 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-mono text-lg tracking-widest transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className={`text-sm font-medium ${vin.length === 17 ? 'text-green-400' : 'text-gray-500'}`}>
                      {vin.length}/17
                    </span>
                    {vin.length === 17 && <CheckCircle size={16} className="text-green-400" />}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={() => handleSearch("basic")}
                  disabled={loading || vin.length !== 17}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/20"
                >
                  {loading && loadingType === "basic" ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Searching BMW Database...
                    </>
                  ) : (
                    <>
                      <Search size={22} />
                      Look Up Vehicle
                    </>
                  )}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              {/* Helper Text */}
              <p className="text-gray-500 text-sm mt-4">
                Your VIN is located on your vehicle registration document, insurance card,
                or on the dashboard visible through the windshield.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(basicData || optionsData || emissionsData) && (
        <section className="py-12 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Vehicle Header */}
              {basicData && (
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full">
                          {basicData.brandName}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-semibold rounded-full">
                          {basicData.seriesDevt}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {basicData.model || basicData.marketSalesDescription || `${basicData.series} Series`}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">VIN</p>
                      <p className="font-mono text-lg text-white tracking-wider">{basicData.vin}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-2xl p-4 text-center">
                      <Calendar className="mx-auto text-blue-400 mb-2" size={24} />
                      <p className="text-gray-400 text-xs mb-1">Production Date</p>
                      <p className="text-white font-semibold text-sm">{formatDate(basicData.productionDate)}</p>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-4 text-center">
                      <Cog className="mx-auto text-purple-400 mb-2" size={24} />
                      <p className="text-gray-400 text-xs mb-1">Engine</p>
                      <p className="text-white font-semibold text-sm">{basicData.engineCode}</p>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-4 text-center">
                      <Zap className="mx-auto text-amber-400 mb-2" size={24} />
                      <p className="text-gray-400 text-xs mb-1">Power</p>
                      <p className="text-white font-semibold text-sm">{basicData.powerKW} kW</p>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-4 text-center">
                      <Fuel className="mx-auto text-green-400 mb-2" size={24} />
                      <p className="text-gray-400 text-xs mb-1">Fuel Type</p>
                      <p className="text-white font-semibold text-sm">{basicData.fuelTypeName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* iDrive Detection Card */}
              {iDriveInfo && activeTab === "basic" && (
                <div className={`border rounded-3xl p-6 mb-8 ${
                  iDriveInfo.color === 'green'
                    ? 'bg-green-500/5 border-green-500/20'
                    : iDriveInfo.color === 'yellow'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Settings className={`${
                      iDriveInfo.color === 'green' ? 'text-green-400'
                      : iDriveInfo.color === 'yellow' ? 'text-amber-400'
                      : 'text-red-400'
                    }`} size={24} />
                    iDrive System Detection
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Detected System</p>
                      <p className="text-white font-semibold">{iDriveInfo.system}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">CarPlay Support</p>
                      <p className={`font-semibold ${
                        iDriveInfo.color === 'green' ? 'text-green-400'
                        : iDriveInfo.color === 'yellow' ? 'text-amber-400'
                        : 'text-red-400'
                      }`}>{iDriveInfo.carplaySupport}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Our Recommendation</p>
                      <p className="text-white">{iDriveInfo.recommendation}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link
                      href="/blog/bmw-idrive-systems-guide"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 group"
                    >
                      Read our complete iDrive identification guide
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => basicData ? setActiveTab("basic") : handleSearch("basic")}
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "basic"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-800 border border-white/10"
                  }`}
                >
                  {loading && loadingType === "basic" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Car size={18} />
                  )}
                  Vehicle Info
                  {basicData && <CheckCircle size={14} className="text-green-400 ml-1" />}
                </button>

                <button
                  onClick={() => optionsData ? setActiveTab("options") : handleSearch("options")}
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "options"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-800 border border-white/10"
                  }`}
                >
                  {loading && loadingType === "options" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Settings size={18} />
                  )}
                  Factory Equipment
                  {optionsData && <CheckCircle size={14} className="text-green-400 ml-1" />}
                </button>

                <button
                  onClick={() => emissionsData ? setActiveTab("emissions") : handleSearch("emissions")}
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "emissions"
                      ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                      : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-800 border border-white/10"
                  }`}
                >
                  {loading && loadingType === "emissions" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Leaf size={18} />
                  )}
                  Emissions
                  {emissionsData && <CheckCircle size={14} className="text-green-400 ml-1" />}
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-zinc-900/50 backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
                {/* Basic Info Tab */}
                {activeTab === "basic" && basicData && (
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <Car className="text-blue-400" size={24} />
                      Complete Vehicle Specifications
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Vehicle Identity */}
                      <div className="col-span-full">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Vehicle Identity</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard label="Full VIN" value={basicData.vin} mono />
                          <InfoCard label="Short VIN" value={basicData.vinShort} mono />
                          <InfoCard label="Model Year Code" value={basicData.vinYear} mono />
                        </div>
                      </div>

                      {/* Model Information */}
                      <div className="col-span-full mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Model Information</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard label="Brand" value={basicData.brandName} />
                          <InfoCard label="Series" value={`${basicData.series} Series (${basicData.seriesDevt})`} />
                          <InfoCard label="Model" value={basicData.model || basicData.marketSalesDescription} />
                          <InfoCard label="Body Type" value={basicData.bodyTypeName} />
                          <InfoCard label="Doors" value={basicData.doorCount} />
                          <InfoCard label="Steering" value={basicData.steeringName} />
                        </div>
                      </div>

                      {/* Powertrain */}
                      <div className="col-span-full mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Powertrain</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard label="Engine Code" value={basicData.engineCode} mono />
                          <InfoCard label="Cylinders" value={basicData.cylinders} />
                          <InfoCard label="Displacement" value={basicData.cubicCapacity ? `${basicData.cubicCapacity}L` : '-'} />
                          <InfoCard label="Power Output" value={basicData.powerKW ? `${basicData.powerKW} kW` : '-'} />
                          <InfoCard label="Fuel Type" value={basicData.fuelTypeName} />
                          <InfoCard label="Transmission" value={basicData.transmissionName} />
                          <InfoCard label="Drive Type" value={basicData.powerTransmission} />
                          <InfoCard label="Hybrid" value={basicData.hybridName} />
                        </div>
                      </div>

                      {/* Production */}
                      <div className="col-span-full mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Production</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard label="Production Date" value={formatDate(basicData.productionDate)} icon={<Calendar size={16} />} />
                          <InfoCard label="Plant" value={basicData.plant} icon={<MapPin size={16} />} />
                          <InfoCard label="Market" value={basicData.country} />
                        </div>
                      </div>

                      {/* Exterior */}
                      <div className="col-span-full mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Exterior</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard
                            label="Color"
                            value={basicData.colorName}
                            subValue={`Code: ${basicData.colorCode}`}
                            icon={<Palette size={16} />}
                          />
                          <InfoCard label="Color Type" value={basicData.colorType} />
                          {basicData.rimCode && (
                            <InfoCard label="Rim Code" value={basicData.rimCode} />
                          )}
                        </div>
                      </div>

                      {/* Interior */}
                      <div className="col-span-full mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Interior</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <InfoCard
                            label="Upholstery"
                            value={basicData.upholsteryName}
                            subValue={`Code: ${basicData.upholsteryCode}`}
                          />
                          <InfoCard label="Upholstery Type" value={basicData.upholsteryType === 'L' ? 'Leather' : basicData.upholsteryType} />
                          {basicData.interiorColorName && (
                            <InfoCard label="Interior Color" value={basicData.interiorColorName} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Options Tab */}
                {activeTab === "options" && optionsData && (
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <Settings className="text-purple-400" size={24} />
                      Factory Equipment ({optionsData.options?.length || 0} options)
                    </h3>

                    {groupedOptions && Object.keys(groupedOptions).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(groupedOptions).sort(([a], [b]) => a.localeCompare(b)).map(([category, options]) => (
                          <div key={category} className="border border-white/10 rounded-2xl overflow-hidden">
                            <button
                              onClick={() => toggleCategory(category)}
                              className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
                            >
                              <span className="font-semibold text-white">{category}</span>
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                                  {options.length}
                                </span>
                                <ChevronDown
                                  size={18}
                                  className={`text-gray-400 transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`}
                                />
                              </div>
                            </button>
                            {expandedCategories.has(category) && (
                              <div className="p-4 grid gap-2">
                                {options.map((option, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl">
                                    <span className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2.5 py-1 rounded-lg shrink-0">
                                      {option.code}
                                    </span>
                                    <span className="text-gray-300 text-sm">{option.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-8">No equipment data available for this vehicle.</p>
                    )}
                  </div>
                )}

                {/* Emissions Tab */}
                {activeTab === "emissions" && emissionsData && (
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <Leaf className="text-green-400" size={24} />
                      Emissions & Consumption Data
                    </h3>

                    <div className="space-y-6">
                      {/* General Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Type Approval</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <InfoCard label="EC Type Approval" value={emissionsData.ecTypeApproval || '-'} />
                          <InfoCard label="Emission Class" value={emissionsData.emissionClass || '-'} />
                        </div>
                      </div>

                      {/* WLTP Values */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">WLTP (New Standard)</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <InfoCard
                            label="CO₂ Combined"
                            value={emissionsData.wltp?.combinedCO2 ? `${emissionsData.wltp.combinedCO2} g/km` : '-'}
                            icon={<Gauge size={16} />}
                          />
                          <InfoCard
                            label="Fuel Consumption"
                            value={emissionsData.wltp?.combinedFuelConsumption ? `${emissionsData.wltp.combinedFuelConsumption} L/100km` : '-'}
                            icon={<Fuel size={16} />}
                          />
                          <InfoCard
                            label="Electric Range"
                            value={emissionsData.wltp?.electricRange ? `${emissionsData.wltp.electricRange} km` : '-'}
                          />
                          <InfoCard
                            label="Electric Consumption"
                            value={emissionsData.wltp?.electricConsumption ? `${emissionsData.wltp.electricConsumption} kWh/100km` : '-'}
                          />
                        </div>
                      </div>

                      {/* NEDC Values */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">NEDC (Legacy Standard)</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <InfoCard
                            label="CO₂ Combined"
                            value={emissionsData.nedc?.combinedCO2 ? `${emissionsData.nedc.combinedCO2} g/km` : '-'}
                          />
                          <InfoCard
                            label="Fuel Combined"
                            value={emissionsData.nedc?.combinedFuelConsumption ? `${emissionsData.nedc.combinedFuelConsumption} L/100km` : '-'}
                          />
                          <InfoCard
                            label="Fuel Urban"
                            value={emissionsData.nedc?.urbanFuelConsumption ? `${emissionsData.nedc.urbanFuelConsumption} L/100km` : '-'}
                          />
                          <InfoCard
                            label="Fuel Extra Urban"
                            value={emissionsData.nedc?.extraUrbanFuelConsumption ? `${emissionsData.nedc.extraUrbanFuelConsumption} L/100km` : '-'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Section */}
              <div className="mt-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/10 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Upgrade Your BMW?</h3>
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                  Contact us for expert coding, retrofits, and performance upgrades tailored to your vehicle.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Contact Us
                  </Link>
                  <a
                    href={`https://wa.me/353876096830?text=Hi%2C%20I%20just%20looked%20up%20my%20${basicData?.brandName || 'BMW'}%20${basicData?.model || ''}%20(VIN%3A%20${basicData?.vin || vin}).%20I%27d%20like%20to%20discuss%20upgrade%20options.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20BD5A] transition-all flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section - shown when no results */}
      {!basicData && !optionsData && !emissionsData && (
        <section className="py-16 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">What You Can Discover</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-colors">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Car className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Vehicle Specifications</h3>
                  <p className="text-gray-400 text-sm">
                    Model, series, engine, transmission, production date, and more.
                  </p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-colors">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="text-purple-400" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Factory Equipment</h3>
                  <p className="text-gray-400 text-sm">
                    Complete list of options and features installed at production.
                  </p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 text-center hover:border-green-500/30 transition-colors">
                  <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Leaf className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Emissions Data</h3>
                  <p className="text-gray-400 text-sm">
                    WLTP and NEDC consumption and CO₂ emission values.
                  </p>
                </div>
              </div>

              {/* VIN Location Help */}
              <div className="mt-12 bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="text-blue-400" size={20} />
                  Where to Find Your VIN
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                    Vehicle Registration Certificate
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                    Dashboard (visible through windshield)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                    Driver's door frame sticker
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" />
                    Insurance documents
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Reusable Info Card Component
function InfoCard({
  label,
  value,
  subValue,
  mono,
  icon
}: {
  label: string;
  value: string | undefined;
  subValue?: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-black/30 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-white font-semibold ${mono ? 'font-mono tracking-wide' : ''}`}>
        {value || '-'}
      </p>
      {subValue && (
        <p className="text-gray-500 text-xs mt-1">{subValue}</p>
      )}
    </div>
  );
}
