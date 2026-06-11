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
  { id: "f-n47", code: "N47", chassis: "F Series", fuel: "diesel", oilCapacity: 5.2, oilFilter: 16.8, airFilter: 46.27, fuelFilter: 48.11, desc: "2.0 diesel, 2007–2015 — Ireland's most common diesel. The 320d (E90/F30), 520d (F10), 116d/118d/120d (F20) and X1/X3 18d/20d." },
  { id: "f-n57", code: "N57", chassis: "F Series", fuel: "diesel", oilCapacity: 6.5, oilFilter: 16.8, airFilter: 43.26, fuelFilter: 48.11, desc: "3.0 straight-six diesel, 2008–2016 — the bigger diesel. The 530d/535d (F10), 330d/335d (E90/F30) and X3/X5 30d & 40d." },
  { id: "f-b47", code: "B47", chassis: "F Series", fuel: "diesel", oilCapacity: 5.25, oilFilter: 18.8, airFilter: 35.19, fuelFilter: 48.11, desc: "2.0 diesel, 2015–2019 facelift — replaced the N47. The 320d (F30 LCI), 520d (F10 LCI), 118d/120d (F20 LCI) and X1/X3 20d." },
  // ---- G30 ----
  { id: "g30-b47", code: "B47", chassis: "G30", fuel: "diesel", oilCapacity: 5.25, oilFilter: 18.8, airFilter: 54.54, fuelFilter: 48.96, desc: "2.0 diesel, newest shape (2017 on). The 520d (G30) — same engine also in the 320d (G20) and X3 20d." },
  { id: "g30-b57", code: "B57", chassis: "G30", fuel: "diesel", oilCapacity: 6.5, oilFilter: 18.8, airFilter: 54.54, fuelFilter: 48.96, desc: "3.0 straight-six diesel, 2017 on. The 530d/540d (G30) — also the 330d (G20), 730d (G11) and X3/X5 30d." },
  { id: "g30-b48", code: "B48", chassis: "G30", fuel: "petrol", oilCapacity: 5.2, oilFilter: 18.8, airFilter: 54.54, sparkPlugCount: 4, desc: "2.0 turbo petrol, 2017 on. The 520i/530i and 530e plug-in (G30) — also 320i/330i (G20) and X1/X3 20i/30i." },
  { id: "g30-b58", code: "B58", chassis: "G30", fuel: "petrol", oilCapacity: 6.5, oilFilter: 18.8, airFilter: 54.54, sparkPlugCount: 6, desc: "3.0 straight-six turbo petrol, 2017 on. The 540i (G30) — also 340i/M340i (G20), 740i (G11) and X3/X4 M40i." },
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
  /** Optional explainer tooltip (string or multiple paragraphs) + heading. */
  tip?: string | string[];
  tipTitle?: string;
}

export const ADDONS: Addon[] = [
  { id: "air-filter", label: "Air Filter", desc: "Engine air filter replacement", fuel: "both", tipTitle: "How often?", tip: "A clogged air filter restricts airflow and hurts throttle response, power and economy. We recommend replacing it every second service or 30,000 km." },
  { id: "fuel-filter", label: "Fuel Filter", desc: "Diesel fuel filter replacement", fuel: "diesel" },
  { id: "spark-plugs", label: "Spark Plugs", desc: "Replace the full set of spark plugs", fuel: "petrol", tipTitle: "How often?", tip: "Worn plugs cause misfires, rough running and poor economy. We recommend fresh spark plugs every ~60,000 km (around every 4 years) — turbo petrol engines especially benefit." },
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
  /** Optional explainer tooltip (string or multiple paragraphs) + heading. */
  tip?: string | string[];
  tipTitle?: string;
}

export const EXTRAS: Extra[] = [
  {
    id: "engine-flush",
    name: "Liqui Moly Engine Flush 300ml",
    price: 15,
    note: "Cleans internal engine deposits before the oil change",
    tipTitle: "When do we use it?",
    tip: [
      "We recommend an engine flush on your first service with us, as we can't see how the car was cared for before. It loosens sludge and deposits so they drain away with the old oil, leaving the engine internally clean.",
      "When we remove the old oil filter we inspect it: if it's clean with no debris, your engine is healthy and won't need a flush again. If we find debris, we'll keep flushing at each service until it runs clean.",
    ],
  },
  {
    id: "ceratec",
    name: "Liqui Moly Ceratec",
    price: 35,
    note: "Ceramic wear protection & friction reduction additive",
    tipTitle: "Why add Ceratec?",
    tip: [
      "Ceratec is a ceramic (boron-nitride) additive that coats your engine's internals to cut friction and wear — for a smoother, quieter engine, better cold-start protection and a small gain in fuel economy.",
      "Its protective layer lasts roughly 50,000 km, so it doesn't need topping up at every oil change. Applying it every second or third service keeps the protection in place while keeping your costs down.",
      "Note: Ceratec isn't recommended with Liqui Moly Molygen oil, as Molygen already contains its own friction-reducing additive.",
    ],
  },
  {
    id: "diesel-purge",
    name: "Liqui Moly Diesel Purge",
    price: 30,
    note: "In-tank fuel additive that cleans the diesel injection system",
    fuel: "diesel",
    tipTitle: "Why use it?",
    tip: [
      "Diesel Purge cleans the injectors, pump and combustion chamber and restores a proper spray pattern — for smoother running, easier starting, better economy and lower emissions, while helping prevent costly injector problems.",
      "For most cars, using it every other service is enough to keep the diesel injection system clean and protected.",
    ],
  },
  {
    id: "fuel-cleaner",
    name: "Fuel System Cleaner Additive",
    price: 30,
    note: "In-tank additive that cleans the petrol fuel system & injectors",
    fuel: "petrol",
    tipTitle: "Why use it?",
    tip: [
      "This additive cleans the injectors, intake valves and combustion chamber, clearing carbon deposits and restoring spray pattern — for smoother running, sharper throttle response and better fuel economy.",
      "Using it every other service keeps deposits from building back up and helps protect the fuel system long-term.",
    ],
  },
  { id: "brake-fluid", name: "Brake Fluid Change", price: 50, note: "Brake fluid change to BMW procedure (not a full system bleed)", tipTitle: "How often?", tip: [
      "Brake fluid absorbs moisture from the air over time, which lowers its boiling point and can cause a soft pedal or brake fade under hard use.",
      "BMW recommends a brake fluid change every 2 years regardless of mileage — cheap insurance for safe, consistent braking.",
    ] },
  { id: "rear-diff", name: "Rear Differential Oil Change", price: 80, note: "Drain & refill the rear differential", tipTitle: "How often?", tip: [
      "BMW often lists differential oil as \"lifetime\", but it breaks down with heat and use. We recommend changing it roughly every 60,000–80,000 km — sooner if you tow, track the car or drive it hard.",
      "Fresh oil protects the gears and bearings, reduces wear and keeps the differential running quietly.",
    ] },
  { id: "transfer-box", name: "Transfer Box Oil Change", price: 150, note: "xDrive only — transfer case fluid service", xdrive: true, tipTitle: "How often?", tip: [
      "The xDrive transfer case splits drive between the front and rear axles and runs hot. BMW often calls it a \"lifetime\" fill, but the oil still degrades.",
      "We recommend changing it roughly every 60,000–80,000 km — sooner for hard or towing use — to keep the all-wheel-drive system smooth and prevent premature wear.",
    ] },
  { id: "front-diff", name: "Front Differential Fluid Change", price: 80, note: "xDrive only — front differential service", xdrive: true, tipTitle: "How often?", tip: [
      "BMW often lists differential oil as \"lifetime\", but it breaks down with heat and use. We recommend changing it roughly every 60,000–80,000 km — sooner if you tow, track the car or drive it hard.",
      "Fresh oil protects the gears and bearings, reduces wear and keeps the differential running quietly.",
    ] },
  { id: "battery-test", name: "Battery Health Test", price: 25, note: "Battery condition check" },
  { id: "diagnostics", name: "Diagnostics Scan", price: 45, note: "Dealer-level ISTA diagnostics of the complete vehicle", tipTitle: "What does it cover?", tip: [
      "We use BMW's dealer-level ISTA software to read every control module on the car — engine, gearbox, ABS/DSC, airbags, body, comfort and infotainment.",
      "It pulls stored and pending fault codes (including faults not yet showing a dashboard light), so we can pinpoint issues accurately rather than guessing.",
    ] },
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
