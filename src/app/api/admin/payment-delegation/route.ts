import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getWorkRecords } from "@/lib/work-records";
import {
  getCostLibrary,
  getDelegationSettings,
  saveCostLibrary,
  saveDelegationSettings,
} from "@/lib/profit-allocation-store";
import {
  COST_CATEGORY_LABELS,
  type CostLibraryItem,
  type DelegationPot,
  type JobCostCategory,
} from "@/lib/payment-delegation";

export const dynamic = "force-dynamic";

const categories = Object.keys(COST_CATEGORY_LABELS) as JobCostCategory[];
const text = (value: unknown, length = 120) =>
  (typeof value === "string" ? value : "").trim().slice(0, length);
const number = (value: unknown, max = 10000000) => {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(max, Math.round(parsed * 100) / 100)) : 0;
};
const id = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function sanitizePots(value: unknown): DelegationPot[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 30).map((raw, index) => {
    const pot = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    return {
      id: text(pot.id, 100) || id(),
      name: text(pot.name, 80) || `Pot ${index + 1}`,
      percentage: number(pot.percentage, 1000),
      enabled: pot.enabled !== false,
      order: index,
    };
  });
}

function sanitizeLibraryItem(raw: unknown, existingId = ""): CostLibraryItem {
  const item = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const category = categories.includes(item.category as JobCostCategory)
    ? (item.category as JobCostCategory)
    : "parts_materials";
  return {
    id: existingId || text(item.id, 100) || id(),
    name: text(item.name, 160),
    category,
    unitCost: number(item.unitCost),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [settings, library, records] = await Promise.all([
    getDelegationSettings(),
    getCostLibrary(),
    getWorkRecords(),
  ]);
  return NextResponse.json({ settings, library, records });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = text(body.action, 40);
    if (action === "saveSettings") {
      const pots = sanitizePots(body.pots);
      if (!pots.length) {
        return NextResponse.json({ error: "At least one allocation pot is required." }, { status: 400 });
      }
      const settings = { pots, updatedAt: new Date().toISOString() };
      await saveDelegationSettings(settings);
      return NextResponse.json({ settings });
    }

    if (action === "addLibraryItem" || action === "updateLibraryItem") {
      const library = await getCostLibrary();
      const requestedId = text(body.id, 100);
      const index = library.findIndex((item) => item.id === requestedId);
      if (action === "updateLibraryItem" && index < 0) {
        return NextResponse.json({ error: "Library item not found." }, { status: 404 });
      }
      const item = sanitizeLibraryItem(body.item, index >= 0 ? library[index].id : "");
      if (!item.name) {
        return NextResponse.json({ error: "Item name is required." }, { status: 400 });
      }
      if (index >= 0) library[index] = item;
      else library.push(item);
      await saveCostLibrary(library);
      return NextResponse.json({ item, library });
    }

    if (action === "deleteLibraryItem") {
      const requestedId = text(body.id, 100);
      const library = await getCostLibrary();
      const next = library.filter((item) => item.id !== requestedId);
      if (next.length === library.length) {
        return NextResponse.json({ error: "Library item not found." }, { status: 404 });
      }
      await saveCostLibrary(next);
      return NextResponse.json({ library: next });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Unable to save payment delegation data." }, { status: 400 });
  }
}
