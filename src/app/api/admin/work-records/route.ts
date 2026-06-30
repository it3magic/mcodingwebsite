import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getWorkRecords,
  saveWorkRecords,
  makeId,
  type WorkRecord,
} from "@/lib/work-records";

export const dynamic = "force-dynamic";

function sanitize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function requireAuth(): Promise<boolean> {
  return isAuthenticated();
}

// List all records (newest first)
export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await getWorkRecords();
  records.sort(
    (a, b) =>
      (b.date || "").localeCompare(a.date || "") ||
      (b.createdAt || "").localeCompare(a.createdAt || ""),
  );
  return NextResponse.json({ records });
}

// Create a new record
export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const record: WorkRecord = {
      id: makeId(),
      date: sanitize(body.date) || now.split("T")[0],
      customerName: sanitize(body.customerName),
      registration: sanitize(body.registration).toUpperCase(),
      vehicle: sanitize(body.vehicle),
      mileage: sanitize(body.mileage),
      workCarriedOut: sanitize(body.workCarriedOut),
      cost: sanitize(body.cost),
      notes: sanitize(body.notes),
      createdAt: now,
      updatedAt: now,
    };

    if (!record.registration && !record.vehicle && !record.workCarriedOut) {
      return NextResponse.json(
        { error: "Please provide at least a registration, vehicle, or work description." },
        { status: 400 },
      );
    }

    const records = await getWorkRecords();
    records.push(record);
    await saveWorkRecords(records);

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Work record create error:", error);
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
  }
}

// Update an existing record
export async function PUT(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = sanitize(body.id);
    if (!id) {
      return NextResponse.json({ error: "Missing record id" }, { status: 400 });
    }

    const records = await getWorkRecords();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    records[idx] = {
      ...records[idx],
      date: sanitize(body.date) || records[idx].date,
      customerName: sanitize(body.customerName),
      registration: sanitize(body.registration).toUpperCase(),
      vehicle: sanitize(body.vehicle),
      mileage: sanitize(body.mileage),
      workCarriedOut: sanitize(body.workCarriedOut),
      cost: sanitize(body.cost),
      notes: sanitize(body.notes),
      updatedAt: new Date().toISOString(),
    };

    await saveWorkRecords(records);
    return NextResponse.json({ success: true, record: records[idx] });
  } catch (error) {
    console.error("Work record update error:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

// Delete a record by id (?id=...)
export async function DELETE(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing record id" }, { status: 400 });
    }

    const records = await getWorkRecords();
    const filtered = records.filter((r) => r.id !== id);
    await saveWorkRecords(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Work record delete error:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
