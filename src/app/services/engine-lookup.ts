// Full "engine code → all models" reference used by the Service Configurator's
// Engine Lookup popup. Keyed by the engine ids defined in service-config.ts.

export interface ModelRow {
  /** Series / family name shown on the left. */
  series: string;
  /** Variants + chassis codes shown on the right. */
  variants: string;
}

export interface EngineLookup {
  /** Short engine spec, e.g. "3.0L 6-cyl diesel". */
  spec: string;
  /** Production years for this engine in this body family. */
  years: string;
  rows: ModelRow[];
}

export const ENGINE_MODELS: Record<string, EngineLookup> = {
  // ---- N47 — 2.0L 4-cyl diesel (F-chassis era) ----
  "f-n47": {
    spec: "2.0L 4-cyl diesel",
    years: "2007–2015",
    rows: [
      { series: "1 Series", variants: "116d · 118d · 120d · 123d (E81/E82/E87/E88, F20/F21)" },
      { series: "3 Series", variants: "316d · 318d · 320d · 325d (E90/E91/E92/E93, F30/F31/F34 GT)" },
      { series: "5 Series", variants: "518d · 520d (F10/F11)" },
      { series: "X1", variants: "sDrive/xDrive 18d · 20d (E84)" },
      { series: "X3", variants: "xDrive 18d · 20d (F25)" },
    ],
  },
  // ---- N57 — 3.0L 6-cyl diesel (F-chassis era) ----
  "f-n57": {
    spec: "3.0L 6-cyl diesel",
    years: "2008–2016",
    rows: [
      { series: "3 Series", variants: "330d · 335d (E90/E91/E92, F30/F31/F34 GT)" },
      { series: "4 Series", variants: "430d · 435d (F32/F33/F36)" },
      { series: "5 Series", variants: "525d · 530d · 535d (F10/F11/F07 GT)" },
      { series: "6 Series", variants: "630d · 640d (F06/F12/F13)" },
      { series: "7 Series", variants: "730d · 740d (F01/F02)" },
      { series: "X3 / X4", variants: "xDrive 30d · 35d (F25/F26)" },
      { series: "X5 / X6", variants: "xDrive 30d · 40d (E70/E71, F15/F16)" },
    ],
  },
  // ---- B47 — 2.0L 4-cyl diesel (F-chassis facelift) ----
  "f-b47": {
    spec: "2.0L 4-cyl diesel",
    years: "2015–2019",
    rows: [
      { series: "1 Series", variants: "116d · 118d · 120d · 125d (F20/F21 LCI)" },
      { series: "2 Series", variants: "218d · 220d · 225d (F22/F23, F45/F46)" },
      { series: "3 Series", variants: "316d · 318d · 320d · 325d (F30/F31/F34 LCI)" },
      { series: "4 Series", variants: "418d · 420d · 425d (F32/F33/F36 LCI)" },
      { series: "5 Series", variants: "518d · 520d · 525d (F10/F11 LCI)" },
      { series: "X1 / X2", variants: "sDrive/xDrive 18d · 20d · 25d (F48/F39)" },
      { series: "X3 / X4", variants: "xDrive 20d (F25 LCI / F26)" },
    ],
  },
  // ---- B47 — 2.0L 4-cyl diesel (G-chassis) ----
  "g30-b47": {
    spec: "2.0L 4-cyl diesel",
    years: "2017 on",
    rows: [
      { series: "1 Series", variants: "116d · 118d · 120d (F40)" },
      { series: "2 Series", variants: "216d · 218d · 220d (F44, F45/F46 LCI, U06)" },
      { series: "3 Series", variants: "316d · 318d · 320d (G20/G21)" },
      { series: "4 Series", variants: "418d · 420d (G22/G23/G26)" },
      { series: "5 Series", variants: "520d (G30/G31)" },
      { series: "X1 / X2", variants: "sDrive/xDrive 18d · 20d · 23d (U11/F39)" },
      { series: "X3 / X4", variants: "xDrive 20d (G01/G02)" },
    ],
  },
  // ---- B57 — 3.0L 6-cyl diesel (G-chassis) ----
  "g30-b57": {
    spec: "3.0L 6-cyl diesel",
    years: "2017 on",
    rows: [
      { series: "3 Series", variants: "330d · 340d (G20/G21)" },
      { series: "4 Series", variants: "430d · 440d (G22/G23/G26)" },
      { series: "5 Series", variants: "530d · 540d (G30/G31)" },
      { series: "6 Series GT", variants: "630d · 640d (G32)" },
      { series: "7 Series", variants: "730d · 740d (G11/G12)" },
      { series: "8 Series", variants: "840d (G14/G15/G16)" },
      { series: "X3 / X4", variants: "xDrive 30d (G01/G02)" },
      { series: "X5 / X6", variants: "xDrive 30d · 40d (G05/G06)" },
      { series: "X7", variants: "xDrive 30d · 40d (G07)" },
    ],
  },
  // ---- B48 — 2.0L 4-cyl petrol & plug-in hybrid (G-chassis) ----
  "g30-b48": {
    spec: "2.0L 4-cyl petrol / PHEV",
    years: "2017 on",
    rows: [
      { series: "1 Series", variants: "118i · 120i · 128ti (F40)" },
      { series: "2 Series", variants: "218i · 220i · 230i (F44, G42, U06) · 225xe/230e plug-in" },
      { series: "3 Series", variants: "318i · 320i · 330i (G20/G21) · 330e plug-in" },
      { series: "4 Series", variants: "420i · 430i (G22/G23/G26)" },
      { series: "5 Series", variants: "520i · 530i (G30/G31) · 530e plug-in" },
      { series: "6 Series GT", variants: "630i (G32)" },
      { series: "7 Series", variants: "730i (G11/G12) · 740e plug-in" },
      { series: "X1 / X2", variants: "sDrive/xDrive 18i · 20i · 25e (U11/F39)" },
      { series: "X3 / X4", variants: "xDrive 20i · 30i · 30e (G01/G02)" },
      { series: "Z4", variants: "sDrive 20i · 30i (G29)" },
    ],
  },
  // ---- B58 — 3.0L 6-cyl petrol & plug-in hybrid (G-chassis) ----
  "g30-b58": {
    spec: "3.0L 6-cyl petrol / PHEV",
    years: "2015 on",
    rows: [
      { series: "3 Series", variants: "340i (F30 LCI)" },
      { series: "4 Series", variants: "440i (F32 LCI)" },
      { series: "5 Series", variants: "540i (G30/G31) · 545e plug-in" },
      { series: "6 Series GT", variants: "640i (G32)" },
      { series: "7 Series", variants: "740i (G11/G12) · 745e plug-in" },
      { series: "8 Series", variants: "840i (G14/G15/G16)" },
      { series: "X5 / X6", variants: "xDrive 40i (G05/G06)" },
      { series: "X7", variants: "xDrive 40i (G07)" },
    ],
  },
};
