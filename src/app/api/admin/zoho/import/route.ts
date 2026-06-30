import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { isZohoConfigured, listInvoicesInRange, getInvoiceDraftsBatch } from "@/lib/zoho";
import { getWorkRecords, saveWorkRecords, makeId, type WorkRecord } from "@/lib/work-records";

export const dynamic = "force-dynamic";

// Keep each POST well under the serverless timeout (each id = 1-2 Zoho calls).
const MAX_BATCH = 15;

/** Build the set of Zoho invoice identifiers (ids + numbers) already in Work Records. */
function existingZohoKeys(records: WorkRecord[]): Set<string> {
  const keys = new Set<string>();
  for (const r of records) {
    if (r.zohoInvoiceId) keys.add(r.zohoInvoiceId);
    // Also catch records imported one-at-a-time, whose number lives in the notes
    // (e.g. "Imported from Zoho invoice INV-00936 (draft) · Ref: …").
    const m = (r.notes || "").match(/invoice\s+(\S+)/i);
    if (m) keys.add(m[1].replace(/[)\].,]+$/, ""));
  }
  return keys;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isZohoConfigured()) {
    return NextResponse.json({ configured: false });
  }
  try {
    const now = new Date();
    const from = request.nextUrl.searchParams.get("from") || `${now.getFullYear()}-01-01`;
    const to = request.nextUrl.searchParams.get("to") || undefined;

    const [invoices, records] = await Promise.all([
      listInvoicesInRange(from, to),
      getWorkRecords(),
    ]);
    const keys = existingZohoKeys(records);

    const candidates = invoices.map((inv) => ({
      ...inv,
      imported: keys.has(inv.id) || keys.has(inv.number),
    }));
    const alreadyImported = candidates.filter((c) => c.imported).length;

    return NextResponse.json({
      configured: true,
      from,
      to: to || null,
      total: candidates.length,
      alreadyImported,
      toImport: candidates.length - alreadyImported,
      candidates,
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      error: error instanceof Error ? error.message : "Failed to list invoices.",
    });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isZohoConfigured()) {
    return NextResponse.json({ configured: false }, { status: 400 });
  }
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.map((x: unknown) => String(x)).filter(Boolean)
      : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: "No invoice ids provided." }, { status: 400 });
    }
    if (ids.length > MAX_BATCH) {
      return NextResponse.json(
        { error: `Too many ids in one request (max ${MAX_BATCH}).` },
        { status: 400 },
      );
    }

    const records = await getWorkRecords();
    const keys = existingZohoKeys(records);

    // Skip ids already present (number-level dedupe also applied after fetch).
    const toFetch = ids.filter((id) => !keys.has(id));
    let skipped = ids.length - toFetch.length;

    const { results, errors } = await getInvoiceDraftsBatch(toFetch);

    const now = new Date().toISOString();
    let imported = 0;
    for (const r of results) {
      if (keys.has(r.id) || keys.has(r.number)) {
        skipped += 1;
        continue;
      }
      const record: WorkRecord = {
        id: makeId(),
        date: r.draft.date,
        customerName: r.draft.customerName,
        registration: (r.draft.registration || "").toUpperCase(),
        vehicle: r.draft.vehicle,
        mileage: r.draft.mileage,
        workCarriedOut: r.draft.workCarriedOut,
        cost: r.draft.cost,
        notes: r.draft.notes,
        zohoInvoiceId: r.id,
        createdAt: now,
        updatedAt: now,
      };
      records.push(record);
      keys.add(r.id);
      keys.add(r.number);
      imported += 1;
    }

    if (imported > 0) await saveWorkRecords(records);

    return NextResponse.json({
      imported,
      skipped,
      errors: errors.map((e) => e.error),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed." },
      { status: 400 },
    );
  }
}
