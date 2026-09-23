import { NextRequest, NextResponse } from "next/server";
import {
  getWorkRecords,
  saveWorkRecords,
  makeId,
  type WorkRecord,
} from "@/lib/work-records";
import { isAuthenticated } from "@/lib/auth";
import {
  type JobCost,
  type JobCostCategory,
  type PaymentStatus,
} from "@/lib/payment-delegation";

export const dynamic = "force-dynamic";

const categories: JobCostCategory[] = [
  "parts_materials",
  "subcontractor",
  "fuel_travel",
  "other",
];
const statuses: PaymentStatus[] = ["unpaid", "partial", "paid"];
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const money = (v: unknown) => {
  const n = typeof v === "number" ? v : Number.parseFloat(str(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? Math.max(0, Math.round(n * 100) / 100) : 0;
};

function sanitizeJobCosts(value: unknown): JobCost[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 250).map((raw): JobCost => {
    const item = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const category = categories.includes(item.category as JobCostCategory)
      ? (item.category as JobCostCategory)
      : "other";
    return {
      id: str(item.id).slice(0, 100) || makeId(),
      category,
      description: str(item.description).trim().slice(0, 300),
      quantity: Math.max(0, Math.min(100000, money(item.quantity))),
      unitCost: Math.min(10000000, money(item.unitCost)),
      ...(str(item.libraryItemId)
        ? { libraryItemId: str(item.libraryItemId).slice(0, 100) }
        : {}),
    };
  });
}

/** Coerce arbitrary request input into the fields we store. */
function sanitize(input: Record<string, unknown>, existing?: WorkRecord) {
  const has = (key: string) => Object.prototype.hasOwnProperty.call(input, key);
  const invoiceTotal = has("invoiceTotal")
    ? money(input.invoiceTotal)
    : existing?.invoiceTotal ?? money(input.cost);
  const vatAmount = Math.min(
    invoiceTotal,
    has("vatAmount") ? money(input.vatAmount) : existing?.vatAmount ?? 0,
  );
  const requestedStatus = has("paymentStatus") ? input.paymentStatus : existing?.paymentStatus;
  const status = statuses.includes(requestedStatus as PaymentStatus)
    ? (requestedStatus as PaymentStatus)
    : "unpaid";
  const enteredReceived = has("amountReceived")
    ? money(input.amountReceived)
    : existing?.amountReceived ?? 0;
  return {
    date: str(input.date),
    customerName: str(input.customerName).trim(),
    registration: str(input.registration).trim().toUpperCase(),
    vehicle: str(input.vehicle).trim(),
    mileage: str(input.mileage).trim(),
    workCarriedOut: str(input.workCarriedOut).trim(),
    cost: str(input.cost).trim(),
    notes: str(input.notes).trim(),
    invoiceNumber: has("invoiceNumber")
      ? str(input.invoiceNumber).trim().slice(0, 100)
      : existing?.invoiceNumber ?? "",
    invoiceTotal,
    vatAmount,
    paymentStatus: status,
    amountReceived: Math.min(
      invoiceTotal,
      status === "paid" && enteredReceived === 0 ? invoiceTotal : enteredReceived,
    ),
    jobCosts: has("jobCosts") ? sanitizeJobCosts(input.jobCosts) : existing?.jobCosts ?? [],
  };
}

/** Newest service date first; fall back to creation order. */
function sortRecords(records: WorkRecord[]): WorkRecord[] {
  return [...records].sort((a, b) => {
    const byDate = (b.date || "").localeCompare(a.date || "");
    if (byDate !== 0) return byDate;
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const records = await getWorkRecords();
  return NextResponse.json({ records: sortRecords(records) });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const record: WorkRecord = {
      id: makeId(),
      ...sanitize(body),
      createdAt: now,
      updatedAt: now,
    };
    const records = await getWorkRecords();
    records.push(record);
    await saveWorkRecords(records);
    return NextResponse.json({ record });
  } catch {
    return NextResponse.json({ error: "Failed to create record" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Record id is required" }, { status: 400 });
    }
    const records = await getWorkRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    const updated: WorkRecord = {
      ...records[index],
      ...sanitize(body, records[index]),
      updatedAt: new Date().toISOString(),
    };
    records[index] = updated;
    await saveWorkRecords(records);
    return NextResponse.json({ record: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update record" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Record id is required" }, { status: 400 });
  }
  const records = await getWorkRecords();
  const next = records.filter((r) => r.id !== id);
  if (next.length === records.length) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  await saveWorkRecords(next);
  return NextResponse.json({ success: true });
}
