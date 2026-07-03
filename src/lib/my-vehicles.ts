import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

/** A scanned document (receipt, invoice, service sheet…) attached to a service record. */
export interface VehicleDocument {
  id: string;
  name: string; // original filename / label
  type: string; // MIME type (image/jpeg, application/pdf, …)
  size: number; // bytes
  uploadedAt: string;
}

/** A single entry in a vehicle's service history. */
export interface ServiceEntry {
  id: string;
  date: string; // yyyy-mm-dd
  mileage: string;
  title: string; // e.g. "Full Service", "Rod Bearings"
  workCarriedOut: string;
  cost: string;
  performedBy: string; // e.g. "M Coding", "Self", dealer name
  notes: string;
  documents: VehicleDocument[];
  createdAt: string;
  updatedAt: string;
}

/** One of the owner's own vehicles. */
export interface MyVehicle {
  id: string;
  nickname: string; // e.g. "The M3"
  make: string;
  model: string;
  year: string;
  registration: string;
  vin: string;
  color: string;
  engine: string;
  currentMileage: string;
  serviceEntries: ServiceEntry[];
  createdAt: string;
  updatedAt: string;
}

const STORE_NAME = "site-data";
const KEY = "my-vehicles";
const DOC_STORE_NAME = "vehicle-documents";

const FALLBACK_FILE = path.join(os.tmpdir(), "mcoding-my-vehicles.json");
const FALLBACK_DOC_DIR = path.join(os.tmpdir(), "mcoding-vehicle-docs");

/* -------------------------------------------------------------------------- */
/*  Vehicle metadata (JSON)                                                    */
/* -------------------------------------------------------------------------- */

async function readFallback(): Promise<MyVehicle[]> {
  try {
    const raw = await fs.readFile(FALLBACK_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFallback(vehicles: MyVehicle[]): Promise<void> {
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(vehicles), "utf-8");
}

/** Read all of the owner's vehicles. Netlify Blobs, falling back to a temp file locally. */
export async function getVehicles(): Promise<MyVehicle[]> {
  try {
    const store = getStore(STORE_NAME);
    const raw = await store.get(KEY, { type: "text" });
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return readFallback();
  }
}

/** Persist all of the owner's vehicles. Netlify Blobs, falling back to a temp file locally. */
export async function saveVehicles(vehicles: MyVehicle[]): Promise<void> {
  try {
    const store = getStore(STORE_NAME);
    await store.set(KEY, JSON.stringify(vehicles));
  } catch {
    await writeFallback(vehicles);
  }
}

/* -------------------------------------------------------------------------- */
/*  Scanned documents (binary)                                                 */
/* -------------------------------------------------------------------------- */

interface StoredDoc {
  data: Buffer;
  contentType: string;
  name: string;
}

async function saveDocFallback(id: string, doc: StoredDoc): Promise<void> {
  await fs.mkdir(FALLBACK_DOC_DIR, { recursive: true });
  await fs.writeFile(path.join(FALLBACK_DOC_DIR, id), doc.data);
  await fs.writeFile(
    path.join(FALLBACK_DOC_DIR, `${id}.json`),
    JSON.stringify({ contentType: doc.contentType, name: doc.name }),
    "utf-8",
  );
}

async function readDocFallback(id: string): Promise<StoredDoc | null> {
  try {
    const data = await fs.readFile(path.join(FALLBACK_DOC_DIR, id));
    let contentType = "application/octet-stream";
    let name = "document";
    try {
      const meta = JSON.parse(
        await fs.readFile(path.join(FALLBACK_DOC_DIR, `${id}.json`), "utf-8"),
      );
      contentType = meta.contentType || contentType;
      name = meta.name || name;
    } catch {
      /* metadata missing — use defaults */
    }
    return { data, contentType, name };
  } catch {
    return null;
  }
}

async function deleteDocFallback(id: string): Promise<void> {
  await fs.rm(path.join(FALLBACK_DOC_DIR, id), { force: true });
  await fs.rm(path.join(FALLBACK_DOC_DIR, `${id}.json`), { force: true });
}

/** Store a scanned document's binary. Netlify Blobs, falling back to local files. */
export async function saveDocument(id: string, doc: StoredDoc): Promise<void> {
  try {
    const store = getStore(DOC_STORE_NAME);
    // Copy into a fresh ArrayBuffer-backed view, then wrap in a Blob (a valid
    // BlobInput). This avoids sending the whole pooled buffer and sidesteps the
    // ArrayBufferLike/SharedArrayBuffer typing on Node's Buffer.
    const bytes = new Uint8Array(doc.data);
    const blob = new Blob([bytes], { type: doc.contentType });
    await store.set(id, blob, {
      metadata: { contentType: doc.contentType, name: doc.name },
    });
  } catch {
    await saveDocFallback(id, doc);
  }
}

/** Retrieve a scanned document's binary + metadata, or null if missing. */
export async function getDocument(id: string): Promise<StoredDoc | null> {
  try {
    const store = getStore(DOC_STORE_NAME);
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res || !res.data) return await readDocFallback(id);
    const md = (res.metadata || {}) as { contentType?: string; name?: string };
    return {
      data: Buffer.from(res.data as ArrayBuffer),
      contentType: md.contentType || "application/octet-stream",
      name: md.name || "document",
    };
  } catch {
    return readDocFallback(id);
  }
}

/** Delete a scanned document's binary. */
export async function deleteDocument(id: string): Promise<void> {
  try {
    const store = getStore(DOC_STORE_NAME);
    await store.delete(id);
  } catch {
    await deleteDocFallback(id);
  }
}

/** Generate a short unique id (avoids crypto.randomUUID for broad compatibility). */
export function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
