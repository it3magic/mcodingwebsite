import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import {
  DEFAULT_POTS,
  type CostLibraryItem,
  type DelegationSettings,
} from "@/lib/payment-delegation";

const STORE_NAME = "site-data";
const SETTINGS_KEY = "payment-delegation-settings";
const LIBRARY_KEY = "payment-cost-library";
const SETTINGS_FILE = path.join(os.tmpdir(), "mcoding-payment-settings.json");
const LIBRARY_FILE = path.join(os.tmpdir(), "mcoding-cost-library.json");

const defaultSettings = (): DelegationSettings => ({
  pots: DEFAULT_POTS.map((pot) => ({ ...pot })),
  updatedAt: new Date().toISOString(),
});

async function readLocal<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function writeLocal(file: string, value: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(value), "utf-8");
}

export async function getDelegationSettings(): Promise<DelegationSettings> {
  try {
    const raw = await getStore(STORE_NAME).get(SETTINGS_KEY, { type: "text" });
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw) as Partial<DelegationSettings>;
    return Array.isArray(parsed.pots)
      ? { pots: parsed.pots, updatedAt: parsed.updatedAt || new Date().toISOString() }
      : defaultSettings();
  } catch {
    return readLocal(SETTINGS_FILE, defaultSettings());
  }
}

export async function saveDelegationSettings(settings: DelegationSettings): Promise<void> {
  try {
    await getStore(STORE_NAME).set(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    await writeLocal(SETTINGS_FILE, settings);
  }
}

export async function getCostLibrary(): Promise<CostLibraryItem[]> {
  try {
    const raw = await getStore(STORE_NAME).get(LIBRARY_KEY, { type: "text" });
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return readLocal<CostLibraryItem[]>(LIBRARY_FILE, []);
  }
}

export async function saveCostLibrary(items: CostLibraryItem[]): Promise<void> {
  try {
    await getStore(STORE_NAME).set(LIBRARY_KEY, JSON.stringify(items));
  } catch {
    await writeLocal(LIBRARY_FILE, items);
  }
}
