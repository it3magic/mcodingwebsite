"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  X,
  Loader2,
  Car,
  ClipboardList,
  CalendarDays,
  Euro,
  Sticker,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ReceiptText,
  RefreshCw,
  DownloadCloud,
  CheckCircle2,
} from "lucide-react";

interface ZohoInvoiceSummary {
  id: string;
  number: string;
  date: string;
  customerName: string;
  total: number;
  currencySymbol: string;
  status: string;
}

const zohoStatusClass = (status: string): string => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/15 text-emerald-300";
    case "overdue":
      return "bg-red-500/15 text-red-300";
    case "sent":
    case "viewed":
      return "bg-blue-500/15 text-blue-300";
    case "partially_paid":
      return "bg-amber-500/15 text-amber-300";
    default:
      return "bg-white/10 text-gray-300";
  }
};

interface WorkRecord {
  id: string;
  date: string;
  customerName: string;
  registration: string;
  vehicle: string;
  mileage: string;
  workCarriedOut: string;
  cost: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

type FormState = Omit<WorkRecord, "id" | "createdAt" | "updatedAt">;

const emptyForm = (): FormState => ({
  date: new Date().toISOString().split("T")[0],
  customerName: "",
  registration: "",
  vehicle: "",
  mileage: "",
  workCarriedOut: "",
  cost: "",
  notes: "",
});

const parseCost = (cost: string): number => {
  const n = Number.parseFloat((cost || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const fmtDate = (value: string): string => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-IE", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtMonth = (key: string): string => {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString("en-IE", { month: "short", year: "numeric" });
};

export default function WorkRecordsPage() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Zoho Books importer
  const [showZoho, setShowZoho] = useState(false);
  const [zohoConfigured, setZohoConfigured] = useState<boolean | null>(null);
  const [zohoInvoices, setZohoInvoices] = useState<ZohoInvoiceSummary[]>([]);
  const [zohoLoading, setZohoLoading] = useState(false);
  const [zohoSearch, setZohoSearch] = useState("");
  const [zohoError, setZohoError] = useState("");
  const [importingId, setImportingId] = useState<string | null>(null);

  // Bulk "import a whole year" state
  const currentYear = new Date().getFullYear();
  const [bulkYear, setBulkYear] = useState<number>(currentYear);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [bulkResult, setBulkResult] = useState<{
    imported: number;
    skipped: number;
    errors: number;
  } | null>(null);
  const [bulkError, setBulkError] = useState("");

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/work-records", { cache: "no-store" });
      const data = await res.json();
      setRecords(Array.isArray(data.records) ? data.records : []);
    } catch {
      setError("Could not load records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (r: WorkRecord) => {
    setEditingId(r.id);
    setForm({
      date: r.date,
      customerName: r.customerName,
      registration: r.registration,
      vehicle: r.vehicle,
      mileage: r.mileage,
      workCarriedOut: r.workCarriedOut,
      cost: r.cost,
      notes: r.notes,
    });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setError("");
  };

  const loadZohoInvoices = useCallback(async (term = "") => {
    setZohoLoading(true);
    setZohoError("");
    try {
      const res = await fetch(
        `/api/admin/zoho/invoices${term ? `?search=${encodeURIComponent(term)}` : ""}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      setZohoConfigured(Boolean(data.configured));
      if (data.error) setZohoError(data.error);
      setZohoInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch {
      setZohoError("Could not reach Zoho Books. Please try again.");
    } finally {
      setZohoLoading(false);
    }
  }, []);

  const openZoho = () => {
    setShowZoho(true);
    setZohoSearch("");
    setBulkResult(null);
    setBulkError("");
    setBulkRunning(false);
    setBulkProgress({ done: 0, total: 0 });
    setBulkYear(currentYear);
    loadZohoInvoices("");
  };

  const runBulkImport = async () => {
    setBulkRunning(true);
    setBulkError("");
    setBulkResult(null);
    setBulkProgress({ done: 0, total: 0 });
    try {
      const from = `${bulkYear}-01-01`;
      const to = `${bulkYear}-12-31`;
      const res = await fetch(`/api/admin/zoho/import?from=${from}&to=${to}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.configured === false) {
        setZohoConfigured(false);
        return;
      }
      if (data.error) {
        setBulkError(data.error);
        return;
      }
      const candidates: (ZohoInvoiceSummary & { imported: boolean })[] = data.candidates || [];
      const toImport = candidates.filter((c) => !c.imported).map((c) => c.id);
      const alreadyImported = candidates.length - toImport.length;

      if (toImport.length === 0) {
        setBulkResult({ imported: 0, skipped: alreadyImported, errors: 0 });
        await loadRecords();
        return;
      }

      setBulkProgress({ done: 0, total: toImport.length });
      let imported = 0;
      let skipped = alreadyImported;
      let errorsCount = 0;
      const BATCH = 5;
      for (let i = 0; i < toImport.length; i += BATCH) {
        const batch = toImport.slice(i, i + BATCH);
        try {
          const r = await fetch("/api/admin/zoho/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: batch }),
          });
          const d = await r.json();
          imported += Number(d.imported || 0);
          skipped += Number(d.skipped || 0);
          errorsCount += Array.isArray(d.errors) ? d.errors.length : 0;
        } catch {
          errorsCount += batch.length;
        }
        setBulkProgress({ done: Math.min(i + BATCH, toImport.length), total: toImport.length });
      }
      setBulkResult({ imported, skipped, errors: errorsCount });
      await loadRecords();
    } catch {
      setBulkError("Bulk import failed. Please try again.");
    } finally {
      setBulkRunning(false);
    }
  };

  const importInvoice = async (id: string) => {
    setImportingId(id);
    setZohoError("");
    try {
      const res = await fetch(`/api/admin/zoho/invoices?id=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.error || !data.draft) {
        setZohoError(data.error || "Could not load that invoice.");
        return;
      }
      setEditingId(null);
      setForm({ ...emptyForm(), ...data.draft });
      setError("");
      setShowForm(true);
      setShowZoho(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setZohoError("Could not import that invoice.");
    } finally {
      setImportingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/work-records", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save.");
        return;
      }
      await loadRecords();
      closeForm();
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: WorkRecord) => {
    const label = [r.registration, r.vehicle].filter(Boolean).join(" • ") || "this record";
    if (!window.confirm(`Delete the record for ${label}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/work-records?id=${encodeURIComponent(r.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((x) => x.id !== r.id));
      }
    } catch {
      /* ignore */
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (dateFrom && r.date && r.date < dateFrom) return false;
      if (dateTo && r.date && r.date > dateTo) return false;
      if (!q) return true;
      return [r.registration, r.vehicle, r.customerName, r.workCarriedOut, r.notes]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [records, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let thisMonth = 0;
    let revenue = 0;
    for (const r of records) {
      revenue += parseCost(r.cost);
      const d = new Date(r.date);
      if (!Number.isNaN(d.getTime()) && d.getMonth() === month && d.getFullYear() === year) {
        thisMonth += 1;
      }
    }
    return { total: records.length, thisMonth, revenue };
  }, [records]);

  // Monthly breakdown over the currently-filtered set.
  const monthly = useMemo(() => {
    const map = new Map<string, { jobs: number; revenue: number }>();
    for (const r of filtered) {
      const key = (r.date || "").slice(0, 7); // yyyy-mm
      if (!key) continue;
      const entry = map.get(key) || { jobs: 0, revenue: 0 };
      entry.jobs += 1;
      entry.revenue += parseCost(r.cost);
      map.set(key, entry);
    }
    const rows = Array.from(map.entries())
      .map(([month, v]) => ({ month, ...v }))
      .sort((a, b) => b.month.localeCompare(a.month));
    const maxRevenue = rows.reduce((m, r) => Math.max(m, r.revenue), 0);
    const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
    return { rows, maxRevenue, totalRevenue };
  }, [filtered]);

  const hasFilters = Boolean(search.trim() || dateFrom || dateTo);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Registration",
      "Vehicle",
      "Customer",
      "Mileage",
      "Work Carried Out",
      "Cost",
      "Notes",
    ];
    const esc = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const rows = filtered.map((r) =>
      [r.date, r.registration, r.vehicle, r.customerName, r.mileage, r.workCarriedOut, r.cost, r.notes]
        .map(esc)
        .join(","),
    );
    const csv = [headers.map(esc).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `work-records-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stickerHref = (r: WorkRecord) => {
    const params = new URLSearchParams({ type: "service" });
    if (r.date) params.set("date", r.date);
    if (r.mileage) params.set("mileage", r.mileage);
    return `/admin/engine-sticker?${params.toString()}`;
  };

  const inputClass =
    "w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <ClipboardList className="text-blue-400" />
                Work <span className="text-gradient">Records</span>
              </h1>
              <p className="text-gray-400">Track every car and the work carried out</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900/40 border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Car className="text-blue-400" size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Jobs Logged</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900/40 border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CalendarDays className="text-purple-400" size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.thisMonth}</div>
                <div className="text-sm text-gray-400">Jobs This Month</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-900/20 to-zinc-900/40 border border-white/10 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Euro className="text-red-400" size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  €{stats.revenue.toLocaleString("en-IE", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-400">Total Logged Value</div>
              </div>
            </div>
          </div>

          {/* Add / Edit form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-zinc-950 border border-white/10 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Record" : "New Record"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Registration</label>
                  <input
                    type="text"
                    value={form.registration}
                    onChange={(e) => setForm({ ...form, registration: e.target.value })}
                    placeholder="e.g. 06-D-12345"
                    className={`${inputClass} uppercase`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vehicle (make / model)</label>
                  <input
                    type="text"
                    value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                    placeholder="e.g. BMW 335i F30"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="e.g. John Murphy"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mileage (km)</label>
                  <input
                    type="text"
                    value={form.mileage}
                    onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                    placeholder="e.g. 150,000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cost (€)</label>
                  <input
                    type="text"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="e.g. 450"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm text-gray-400 mb-1">Work Carried Out</label>
                  <textarea
                    value={form.workCarriedOut}
                    onChange={(e) => setForm({ ...form, workCarriedOut: e.target.value })}
                    placeholder="e.g. Full service, rod bearings replaced, oil & filters, coding"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any extra details, parts ordered, follow-ups…"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                  {editingId ? "Save Changes" : "Add Record"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by reg, vehicle, customer or work…"
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-950 border border-white/15 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="px-4 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={openZoho}
              className="px-4 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <ReceiptText size={18} className="text-emerald-400" />
              Import from Zoho
            </button>
            {!showForm && (
              <button
                onClick={openAdd}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                New Record
              </button>
            )}
          </div>

          {/* Date range filter */}
          <div className="flex flex-wrap items-end gap-3 mb-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 bg-zinc-950 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 bg-zinc-950 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Monthly breakdown */}
          {monthly.rows.length > 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-xl mb-6 overflow-hidden">
              <button
                onClick={() => setShowBreakdown((s) => !s)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-semibold">
                  <BarChart3 size={18} className="text-purple-400" />
                  Monthly Breakdown
                  <span className="text-sm font-normal text-gray-500">
                    · €{monthly.totalRevenue.toLocaleString("en-IE", { maximumFractionDigits: 0 })} across{" "}
                    {filtered.length} job{filtered.length === 1 ? "" : "s"}
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${showBreakdown ? "rotate-180" : ""}`}
                />
              </button>
              {showBreakdown && (
                <div className="px-5 pb-5 space-y-3">
                  {monthly.rows.map((row) => (
                    <div key={row.month} className="flex items-center gap-4">
                      <div className="w-20 shrink-0 text-sm text-gray-400">{fmtMonth(row.month)}</div>
                      <div className="flex-1 h-7 bg-white/[0.04] rounded-md overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-md flex items-center justify-end pr-2"
                          style={{
                            width: `${
                              monthly.maxRevenue > 0
                                ? Math.max(6, (row.revenue / monthly.maxRevenue) * 100)
                                : 6
                            }%`,
                          }}
                        >
                          <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                            €{row.revenue.toLocaleString("en-IE", { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 shrink-0 text-right text-sm text-gray-500">
                        {row.jobs} job{row.jobs === 1 ? "" : "s"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Records */}
          <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
                <Loader2 className="animate-spin" size={20} />
                Loading records…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 px-6">
                <ClipboardList className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-300 font-medium mb-1">
                  {records.length === 0 ? "No work records yet" : "No matching records"}
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  {records.length === 0
                    ? "Add your first job to start building the log."
                    : "Try a different search term or date range."}
                </p>
                {records.length === 0 && (
                  <button
                    onClick={openAdd}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add First Record
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: "920px" }}>
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/10">
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Reg</th>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Mileage</th>
                      <th className="px-4 py-3 font-semibold">Work Carried Out</th>
                      <th className="px-4 py-3 font-semibold text-right">Cost</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors align-top"
                      >
                        <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                          {fmtDate(r.date)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap uppercase">
                          {r.registration || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">{r.vehicle || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{r.customerName || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                          {r.mileage ? `${r.mileage} km` : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-[300px]">
                          <span className="line-clamp-2" title={r.workCarriedOut}>
                            {r.workCarriedOut || "—"}
                          </span>
                          {r.notes && (
                            <span
                              className="mt-1 block text-xs text-gray-500 line-clamp-1"
                              title={r.notes}
                            >
                              Note: {r.notes}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200 text-right whitespace-nowrap">
                          {r.cost ? `€${r.cost.replace(/^€/, "")}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={stickerHref(r)}
                              className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              aria-label="Create service sticker"
                              title="Create service sticker"
                            >
                              <Sticker size={16} />
                            </Link>
                            <button
                              onClick={() => openEdit(r)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              aria-label="Edit record"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(r)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              aria-label="Delete record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Showing {filtered.length} of {records.length} record{records.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      {/* Zoho Books importer */}
      {showZoho && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowZoho(false)}
        >
          <div
            className="mt-20 w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ReceiptText size={20} className="text-emerald-400" />
                Import from Zoho Books
              </h2>
              <div className="flex items-center gap-1">
                {zohoConfigured && (
                  <button
                    onClick={() => loadZohoInvoices(zohoSearch)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Refresh"
                    title="Refresh"
                  >
                    <RefreshCw size={16} className={zohoLoading ? "animate-spin" : ""} />
                  </button>
                )}
                <button
                  onClick={() => setShowZoho(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {zohoConfigured === false ? (
                <div className="text-sm text-gray-300 space-y-3">
                  <p className="text-gray-200 font-medium">Zoho Books isn&apos;t connected yet.</p>
                  <p className="text-gray-400">
                    Add these environment variables (from the Zoho API Console &amp; your
                    organisation settings), then redeploy:
                  </p>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {[
                      "ZOHO_CLIENT_ID",
                      "ZOHO_CLIENT_SECRET",
                      "ZOHO_REFRESH_TOKEN",
                      "ZOHO_ORGANIZATION_ID",
                      "ZOHO_ACCOUNTS_DOMAIN  (EU: https://accounts.zoho.eu)",
                    ].map((v) => (
                      <li key={v} className="text-emerald-300 bg-black/40 border border-white/10 rounded px-2 py-1">
                        {v}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-xs">
                    Scope required: <span className="text-gray-300">ZohoBooks.invoices.READ</span>
                  </p>
                </div>
              ) : (
                <>
                  {/* Bulk import a whole year */}
                  <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                    {bulkRunning ? (
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-emerald-200">
                          <Loader2 size={16} className="animate-spin" />
                          Importing {bulkYear} invoices… {bulkProgress.done}/{bulkProgress.total}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
                            style={{
                              width: `${
                                bulkProgress.total
                                  ? Math.max(5, (bulkProgress.done / bulkProgress.total) * 100)
                                  : 5
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : bulkResult ? (
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 font-medium text-emerald-300">
                            <CheckCircle2 size={16} />
                            Import complete
                          </div>
                          <div className="mt-1 text-gray-300">
                            <span className="font-semibold text-white">{bulkResult.imported}</span> imported
                            {" · "}
                            {bulkResult.skipped} already there
                            {bulkResult.errors > 0 && (
                              <span className="text-amber-300"> · {bulkResult.errors} failed</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setBulkResult(null)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 font-medium text-white">
                            <DownloadCloud size={16} className="text-emerald-400" />
                            Bulk import a whole year
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400">
                            Pulls every invoice for the year and skips any already imported.
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={bulkYear}
                            onChange={(e) => setBulkYear(Number(e.target.value))}
                            className="rounded-lg border border-white/15 bg-black px-2.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          >
                            {[0, 1, 2, 3].map((d) => {
                              const y = currentYear - d;
                              return (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            onClick={runBulkImport}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                          >
                            <DownloadCloud size={16} />
                            Import all {bulkYear}
                          </button>
                        </div>
                      </div>
                    )}
                    {bulkError && <p className="mt-2 text-sm text-red-400">{bulkError}</p>}
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Or import one at a time
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <input
                      type="text"
                      value={zohoSearch}
                      onChange={(e) => setZohoSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") loadZohoInvoices(zohoSearch);
                      }}
                      placeholder="Search invoices by number or customer… (Enter)"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/15 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {zohoError && (
                    <p className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {zohoError}
                    </p>
                  )}

                  <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
                    {zohoLoading ? (
                      <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
                        <Loader2 className="animate-spin" size={18} />
                        Loading invoices…
                      </div>
                    ) : zohoInvoices.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        No invoices found.
                      </div>
                    ) : (
                      <ul className="divide-y divide-white/5">
                        {zohoInvoices.map((inv) => (
                          <li key={inv.id}>
                            <button
                              onClick={() => importInvoice(inv.id)}
                              disabled={importingId !== null}
                              className="w-full text-left py-3 px-2 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center gap-3 disabled:opacity-60"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white text-sm">
                                    {inv.number || "—"}
                                  </span>
                                  {inv.status && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${zohoStatusClass(
                                        inv.status,
                                      )}`}
                                    >
                                      {inv.status.replace(/_/g, " ")}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  {inv.customerName || "—"} · {fmtDate(inv.date)}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-semibold text-white">
                                  {inv.currencySymbol}
                                  {inv.total.toLocaleString("en-IE", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                              {importingId === inv.id ? (
                                <Loader2 size={16} className="animate-spin text-emerald-400 shrink-0" />
                              ) : (
                                <ChevronRight size={16} className="text-gray-600 shrink-0" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-4">
                    Selecting an invoice pre-fills a new record — review the details, then save.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
