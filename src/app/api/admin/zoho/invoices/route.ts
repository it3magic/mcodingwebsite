import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { isZohoConfigured, listInvoices, getInvoiceDraft } from "@/lib/zoho";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isZohoConfigured()) {
    return NextResponse.json({ configured: false });
  }

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const { invoice, draft } = await getInvoiceDraft(id);
      return NextResponse.json({ configured: true, invoice, draft });
    }
    const search = request.nextUrl.searchParams.get("search") || undefined;
    const invoices = await listInvoices(search);
    return NextResponse.json({ configured: true, invoices });
  } catch (error) {
    // Surface a readable message to the admin UI (kept at 200 for simple handling).
    return NextResponse.json({
      configured: true,
      error: error instanceof Error ? error.message : "Zoho request failed.",
    });
  }
}
