import { NextRequest, NextResponse } from "next/server";
import {
  getVehicles,
  saveVehicles,
  deleteDocument,
  makeId,
  type MyVehicle,
  type ServiceEntry,
} from "@/lib/my-vehicles";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

function sanitizeVehicle(input: Record<string, unknown>) {
  return {
    nickname: str(input.nickname).trim(),
    make: str(input.make).trim(),
    model: str(input.model).trim(),
    year: str(input.year).trim(),
    registration: str(input.registration).trim().toUpperCase(),
    vin: str(input.vin).trim().toUpperCase(),
    color: str(input.color).trim(),
    engine: str(input.engine).trim(),
    currentMileage: str(input.currentMileage).trim(),
  };
}

function sanitizeEntry(input: Record<string, unknown>) {
  return {
    date: str(input.date),
    mileage: str(input.mileage).trim(),
    title: str(input.title).trim(),
    workCarriedOut: str(input.workCarriedOut).trim(),
    cost: str(input.cost).trim(),
    performedBy: str(input.performedBy).trim(),
    notes: str(input.notes).trim(),
  };
}

/** Newest service date first; fall back to creation order. */
function sortEntries(entries: ServiceEntry[]): ServiceEntry[] {
  return [...entries].sort((a, b) => {
    const byDate = (b.date || "").localeCompare(a.date || "");
    if (byDate !== 0) return byDate;
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });
}

/** Return vehicles with their entries sorted newest-first. */
function withSortedEntries(vehicles: MyVehicle[]): MyVehicle[] {
  return vehicles.map((v) => ({ ...v, serviceEntries: sortEntries(v.serviceEntries || []) }));
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vehicles = await getVehicles();
  return NextResponse.json({ vehicles: withSortedEntries(vehicles) });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const action = str(body.action);
  const now = new Date().toISOString();
  const vehicles = await getVehicles();

  const findVehicle = (id: string) => vehicles.find((v) => v.id === id);

  switch (action) {
    /* ----------------------------- Vehicles ----------------------------- */
    case "addVehicle": {
      const vehicle: MyVehicle = {
        id: makeId(),
        ...sanitizeVehicle((body.vehicle as Record<string, unknown>) || {}),
        serviceEntries: [],
        createdAt: now,
        updatedAt: now,
      };
      vehicles.push(vehicle);
      await saveVehicles(vehicles);
      return NextResponse.json({ vehicle, vehicles: withSortedEntries(vehicles) });
    }

    case "updateVehicle": {
      const input = (body.vehicle as Record<string, unknown>) || {};
      const id = str(input.id);
      const v = findVehicle(id);
      if (!v) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      Object.assign(v, sanitizeVehicle(input), { updatedAt: now });
      await saveVehicles(vehicles);
      return NextResponse.json({ vehicle: v, vehicles: withSortedEntries(vehicles) });
    }

    case "deleteVehicle": {
      const id = str(body.id);
      const v = findVehicle(id);
      if (!v) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      // Best-effort cleanup of all attached document binaries.
      for (const entry of v.serviceEntries || []) {
        for (const doc of entry.documents || []) {
          await deleteDocument(doc.id).catch(() => {});
        }
      }
      const next = vehicles.filter((x) => x.id !== id);
      await saveVehicles(next);
      return NextResponse.json({ vehicles: withSortedEntries(next) });
    }

    /* -------------------------- Service entries -------------------------- */
    case "addEntry": {
      const v = findVehicle(str(body.vehicleId));
      if (!v) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      const entry: ServiceEntry = {
        id: makeId(),
        ...sanitizeEntry((body.entry as Record<string, unknown>) || {}),
        documents: [],
        createdAt: now,
        updatedAt: now,
      };
      v.serviceEntries = v.serviceEntries || [];
      v.serviceEntries.push(entry);
      // Optionally bump the vehicle's current mileage to the latest reading.
      if (entry.mileage) v.currentMileage = entry.mileage;
      v.updatedAt = now;
      await saveVehicles(vehicles);
      return NextResponse.json({ entry, vehicles: withSortedEntries(vehicles) });
    }

    case "updateEntry": {
      const v = findVehicle(str(body.vehicleId));
      if (!v) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      const input = (body.entry as Record<string, unknown>) || {};
      const entry = (v.serviceEntries || []).find((e) => e.id === str(input.id));
      if (!entry) return NextResponse.json({ error: "Record not found" }, { status: 404 });
      Object.assign(entry, sanitizeEntry(input), { updatedAt: now });
      v.updatedAt = now;
      await saveVehicles(vehicles);
      return NextResponse.json({ entry, vehicles: withSortedEntries(vehicles) });
    }

    case "deleteEntry": {
      const v = findVehicle(str(body.vehicleId));
      if (!v) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      const entry = (v.serviceEntries || []).find((e) => e.id === str(body.entryId));
      if (!entry) return NextResponse.json({ error: "Record not found" }, { status: 404 });
      for (const doc of entry.documents || []) {
        await deleteDocument(doc.id).catch(() => {});
      }
      v.serviceEntries = v.serviceEntries.filter((e) => e.id !== entry.id);
      v.updatedAt = now;
      await saveVehicles(vehicles);
      return NextResponse.json({ vehicles: withSortedEntries(vehicles) });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
