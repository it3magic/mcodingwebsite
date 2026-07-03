import { NextRequest, NextResponse } from "next/server";
import {
  getVehicles,
  saveVehicles,
  saveDocument,
  deleteDocument,
  makeId,
  type VehicleDocument,
} from "@/lib/my-vehicles";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Keep uploads within Netlify's function payload limits.
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

/** Upload a scanned document and attach it to a service record. */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart form upload" }, { status: 400 });
  }

  const vehicleId = String(form.get("vehicleId") || "");
  const entryId = String(form.get("entryId") || "");
  const file = form.get("file");

  if (!vehicleId || !entryId) {
    return NextResponse.json({ error: "vehicleId and entryId are required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload an image (JPG, PNG, WEBP, HEIC) or a PDF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 10 MB)." }, { status: 413 });
  }

  const vehicles = await getVehicles();
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }
  const entry = (vehicle.serviceEntries || []).find((e) => e.id === entryId);
  if (!entry) {
    return NextResponse.json({ error: "Service record not found" }, { status: 404 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = makeId();
  await saveDocument(id, { data: buffer, contentType: type, name: file.name || "document" });

  const doc: VehicleDocument = {
    id,
    name: file.name || "document",
    type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
  entry.documents = entry.documents || [];
  entry.documents.push(doc);
  entry.updatedAt = new Date().toISOString();
  vehicle.updatedAt = entry.updatedAt;
  await saveVehicles(vehicles);

  return NextResponse.json({ document: doc });
}

/** Remove a scanned document from a service record. */
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const vehicleId = params.get("vehicleId") || "";
  const entryId = params.get("entryId") || "";
  const docId = params.get("docId") || "";

  if (!vehicleId || !entryId || !docId) {
    return NextResponse.json(
      { error: "vehicleId, entryId and docId are required" },
      { status: 400 },
    );
  }

  const vehicles = await getVehicles();
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  const entry = (vehicle.serviceEntries || []).find((e) => e.id === entryId);
  if (!entry) return NextResponse.json({ error: "Service record not found" }, { status: 404 });

  const before = (entry.documents || []).length;
  entry.documents = (entry.documents || []).filter((d) => d.id !== docId);
  if (entry.documents.length === before) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await deleteDocument(docId).catch(() => {});
  entry.updatedAt = new Date().toISOString();
  vehicle.updatedAt = entry.updatedAt;
  await saveVehicles(vehicles);

  return NextResponse.json({ success: true });
}
