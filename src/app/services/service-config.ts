// Engine-based service configurator data.
// IMPORTANT: all monetary values below are EX-VAT. Irish VAT (13.5%) is added in the summary.

export const VAT_RATE = 0.135;

// Base service LABOUR (ex VAT) — oil + oil-filter change. Same for diesel & petrol.
// Parts (oil, oil filter) and any add-ons are charged on top.
export const BASE_LABOUR = 80;

// Add-on fitting LABOUR (ex VAT). The actual part price is added on top, per engine.
export const AIR_FILTER_LABOUR = 10;
export const FUEL_FILTER_LABOUR = 30;
export const SPARK_PLUG_LABOUR_PER = 10; // labour per plug
export const SPARK_PLUG_PRICE = 32.68; // ex VAT, per plug part

export type Fuel = "diesel" | "petrol";
export type Chassis = "F Series" | "G30";

export interface Engine {
  id: string;
  code: string; // e.g. "N47"
  chassis: Chassis;
  fuel: Fuel;
  /** Approx. service oil fill in litres (editable — used to price the chosen oil). */
  oilCapacity: number;
  /** Part prices (ex VAT) kept for the garage's records / parts list. */
  oilFilter: number;
  airFilter: number;
  fuelFilter?: number; // diesel only
  sparkPlugCount?: number; // petrol only
  /** Short customer-facing description. Model codes with a leading "x" are shown with the x highlighted. */
  desc?: string;
}

export const ENGINES: Engine[] = [
  // ---- F Series (diesel) ----
  { id: "f-n47", code: "N47", chassis: "F Series", fuel: "diesel", oilCapacity: 5.2, oilFilter: 16.8, airFilter: 46.27, fuelFilter: 48.11, desc: "2 litre diesel found in x16d x18d x20d models, like the 520d F10 (2010–2014)" },
  { id: "f-n57", code: "N57", chassis: "F Series", fuel: "diesel", oilCapacity: 6.5, oilFilter: 16.8, airFilter: 43.26, fuelFilter: 48.11, desc: "Diesel found in x30d x35d x40d models, like the 535d twin-turbo" },
  { id: "f-b47", code: "B47", chassis: "F Series", fuel: "diesel", oilCapacity: 5.25, oilFilter: 18.8, airFilter: 35.19, fuelFilter: 48.11, desc: "Same as the N47 but on facelift models, like the 520d (2015–2016)" },
  // ---- G30 ----
  { id: "g30-b47", code: "B47", chassis: "G30", fuel: "diesel", oilCapacity: 5.25, oilFilter: 18.8, airFilter: 54.54, fuelFilter: 48.96, desc: "2 litre diesel in G models, like the 520d G30" },
  { id: "g30-b57", code: "B57", chassis: "G30", fuel: "diesel", oilCapacity: 6.5, oilFilter: 18.8, airFilter: 54.54, fuelFilter: 48.96, desc: "6-cylinder 3 litre diesel in G models, like the 530d G30" },
  { id: "g30-b48", code: "B48", chassis: "G30", fuel: "petrol", oilCapacity: 5.2, oilFilter: 18.8, airFilter: 54.54, sparkPlugCount: 4, desc: "2 litre 4-cylinder petrol in G models, like the 530e G30" },
  { id: "g30-b58", code: "B58", chassis: "G30", fuel: "petrol", oilCapacity: 6.5, oilFilter: 18.8, airFilter: 54.54, sparkPlugCount: 6, desc: "3 litre 6-cylinder petrol in G models, like the 540i G30" },
];

// ---- Engine oil options (ex VAT, per litre) ----
export interface OilOption {
  id: string;
  name: string;
  note: string;
  pricePerL: number;
  recommended?: boolean;
}

export const OIL_OPTIONS: OilOption[] = [
  {
    id: "ll04",
    name: "Standard LL04 5W-30",
    note: "Quality BMW Longlife-04 approved oil that meets BMW service requirements. Suitable for normal daily driving and manufacturer service intervals.",
    pricePerL: 10,
  },
  {
    id: "toptec",
    name: "Liqui Moly TopTec 4200 5W-30",
    note: "Premium OEM-approved upgrade. Premium German-made BMW LL-04 approved oil offering excellent engine protection, cleanliness and long service life. A popular premium alternative to standard oil — works well with the Ceratec oil additive.",
    pricePerL: 18,
    recommended: true,
  },
  {
    id: "molygen",
    name: "Liqui Moly Molygen 5W-30",
    note: "High-performance synthetic oil featuring Liqui Moly's Molygen additive technology for enhanced wear protection and reduced engine friction. Ideal for enthusiasts or owners planning to keep their BMW long-term. Note: Ceratec additive not recommended with this oil.",
    pricePerL: 19,
  },
  {
    id: "bmw",
    name: "BMW Genuine 0W-30",
    note: "Factory BMW oil — the latest genuine BMW engine oil used by BMW dealerships.",
    pricePerL: 18,
  },
];

export const DEFAULT_OIL_ID = "ll04";

// ---- Optional add-ons (filters / spark plugs) ----
export type AddonId = "air-filter" | "fuel-filter" | "spark-plugs" | "cabin-filter";

export interface Addon {
  id: AddonId;
  label: string;
  desc: string;
  /** which fuel types this add-on applies to */
  fuel: Fuel | "both";
}

export const ADDONS: Addon[] = [
  { id: "air-filter", label: "Air Filter", desc: "Engine air filter replacement", fuel: "both" },
  { id: "fuel-filter", label: "Fuel Filter", desc: "Diesel fuel filter replacement", fuel: "diesel" },
  { id: "spark-plugs", label: "Spark Plugs", desc: "Replace the full set of spark plugs", fuel: "petrol" },
  { id: "cabin-filter", label: "Cabin / Pollen Filter", desc: "Price varies by model — confirmed on booking", fuel: "both" },
];

export interface Extra {
  id: string;
  name: string;
  /** ex VAT. null = price on request. */
  price: number | null;
  note?: string;
  /** Restrict to a fuel type (omit = applies to both). */
  fuel?: Fuel;
  /** Restrict to xDrive (all-wheel-drive) vehicles. */
  xdrive?: boolean;
}

export const EXTRAS: Extra[] = [
  { id: "engine-flush", name: "Liqui Moly Engine Flush 300ml", price: 15, note: "Cleans internal engine deposits before the oil change" },
  { id: "ceratec", name: "Liqui Moly Ceratec", price: 35, note: "Ceramic wear protection & friction reduction additive" },
  { id: "diesel-purge", name: "Liqui Moly Diesel Purge", price: 30, note: "In-tank fuel additive that cleans the diesel injection system", fuel: "diesel" },
  { id: "fuel-cleaner", name: "Fuel System Cleaner Additive", price: 30, note: "In-tank additive that cleans the petrol fuel system & injectors", fuel: "petrol" },
  { id: "brake-fluid", name: "Brake Fluid Change", price: 50, note: "Brake fluid change to BMW procedure (not a full system bleed)" },
  { id: "rear-diff", name: "Rear Differential Oil Change", price: 80, note: "Drain & refill the rear differential" },
  { id: "transfer-box", name: "Transfer Box Oil Change", price: 150, note: "xDrive only — transfer case fluid service", xdrive: true },
  { id: "front-diff", name: "Front Differential Fluid Change", price: 80, note: "xDrive only — front differential service", xdrive: true },
  { id: "battery-test", name: "Battery Health Test", price: 25, note: "Battery condition check" },
  { id: "diagnostics", name: "Diagnostics Scan", price: 45, note: "Dealer-level ISTA diagnostics of the complete vehicle" },
  { id: "wipers", name: "Windscreen Wipers", price: null, note: "Price varies by model" },
];

// ---- helpers ----

const round2 = (n: number) => Math.round(n * 100) / 100;

export const formatEur = (n: number) => `€${n.toFixed(2)}`;

export function getEngine(id: string | null | undefined): Engine | null {
  if (!id) return null;
  return ENGINES.find((e) => e.id === id) ?? null;
}

export function getOil(id: string | null | undefined): OilOption {
  return OIL_OPTIONS.find((o) => o.id === id) ?? OIL_OPTIONS[0];
}

/** Base service LABOUR (ex VAT) — oil + oil-filter change, same for every engine. */
export function baseLabour(_engine: Engine): number {
  return BASE_LABOUR;
}

export function baseLabourLabel(_engine: Engine): string {
  return "Oil & filter change labour (incl. waste oil disposal)";
}

/** Total oil cost for an engine with the selected oil (litres × €/L). */
export function oilCost(engine: Engine, oilId: string): number {
  return round2(engine.oilCapacity * getOil(oilId).pricePerL);
}

/** Add-on options available for a given engine. */
export function getAddons(engine: Engine): Addon[] {
  return ADDONS.filter((a) => a.fuel === "both" || a.fuel === engine.fuel);
}

/** Extras available for a given engine + drivetrain (filters fuel-specific & xDrive-only items). */
export function getExtras(engine: Engine, xdrive: boolean): Extra[] {
  return EXTRAS.filter((e) => {
    if (e.fuel && e.fuel !== engine.fuel) return false;
    if (e.xdrive && !xdrive) return false;
    return true;
  });
}

/** Fitting labour (ex VAT) for an add-on on a given engine. null = on request. */
export function addonLabour(engine: Engine, id: AddonId): number | null {
  switch (id) {
    case "air-filter":
      return AIR_FILTER_LABOUR;
    case "fuel-filter":
      return FUEL_FILTER_LABOUR;
    case "spark-plugs":
      return round2((engine.sparkPlugCount ?? 0) * SPARK_PLUG_LABOUR_PER);
    case "cabin-filter":
      return null;
  }
}

/** Part price (ex VAT) for an add-on on a given engine. null = on request. */
export function addonPart(engine: Engine, id: AddonId): number | null {
  switch (id) {
    case "air-filter":
      return engine.airFilter;
    case "fuel-filter":
      return engine.fuelFilter ?? null;
    case "spark-plugs":
      return round2((engine.sparkPlugCount ?? 0) * SPARK_PLUG_PRICE);
    case "cabin-filter":
      return null;
  }
}

/** Full add-on price = fitting labour + part. null = on request. */
export function addonTotal(engine: Engine, id: AddonId): number | null {
  const l = addonLabour(engine, id);
  const p = addonPart(engine, id);
  if (l === null || p === null) return null;
  return round2(l + p);
}

/** Human label for a selected add-on, engine-aware. */
export function addonLabel(engine: Engine, id: AddonId): string {
  switch (id) {
    case "air-filter":
      return `Air filter (${engine.code})`;
    case "fuel-filter":
      return `Fuel filter (${engine.chassis === "G30" ? "G30" : "F10"})`;
    case "spark-plugs":
      return `Spark plugs (${engine.sparkPlugCount})`;
    case "cabin-filter":
      return "Cabin / pollen filter";
  }
}
