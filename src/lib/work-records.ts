import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export interface WorkRecord {
  id: string;
  date: string; // service date (yyyy-mm-dd)
  customerName: string;
  registration: string; // reg plate
  vehicle: string; // make / model
  mileage: string;
  workCarriedOut: string;
  cost: string;
  notes: string;
  /** Set when the record was imported from a Zoho Books invoice (used to skip duplicates). */
  zohoInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORE_NAME = "site-data";
const KEY = "work-records";
const FALLBACK_FILE = path.join(os.tmpdir(), "mcoding-work-records.json");

async function readFallback(): Promise<WorkRecord[]> {
  try {
    const raw = await fs.readFile(FALLBACK_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFallback(records: WorkRecord[]): Promise<void> {
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(records), "utf-8");
}

/** Read all work records. Uses Netlify Blobs, falling back to a temp file in local dev. */
export async function getWorkRecords(): Promise<WorkRecord[]> {
  try {
    const store = getStore(STORE_NAME);
    const raw = await store.get(KEY, { type: "text" });
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Netlify Blobs not configured (e.g. local dev) — use temp-file fallback
    return readFallback();
  }
}

/** Persist all work records. Uses Netlify Blobs, falling back to a temp file in local dev. */
export async function saveWorkRecords(records: WorkRecord[]): Promise<void> {
  try {
    const store = getStore(STORE_NAME);
    await store.set(KEY, JSON.stringify(records));
  } catch {
    await writeFallback(records);
  }
}

/** Generate a short unique id (avoids crypto.randomUUID for broad compatibility). */
export function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
