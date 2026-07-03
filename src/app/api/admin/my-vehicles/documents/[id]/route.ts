import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/lib/my-vehicles";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Stream a stored scanned document back to the browser (auth-protected). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getDocument(id);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const safeName = doc.name.replace(/[^\w.\-() ]+/g, "_");
  const body = new Uint8Array(doc.data);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.contentType,
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
