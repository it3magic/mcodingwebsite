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
} from "lucide-react";

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

export default function WorkRecordsPage() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    if (!q) return records;
    return records.filter((r) =>
      [r.registration, r.vehicle, r.customerName, r.workCarriedOut, r.notes]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [records, search]);

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

              {error && (
                <p className="mt-4 text-sm text-red-400">{error}</p>
              )}

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
          <div className="flex flex-wrap items-center gap-3 mb-5">
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
              disabled={records.length === 0}
              className="px-4 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export CSV
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
                    : "Try a different search term."}
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
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-[320px]">
                          <span className="line-clamp-2" title={r.workCarriedOut}>
                            {r.workCarriedOut || "—"}
                          </span>
                          {r.notes && (
                            <span className="mt-1 block text-xs text-gray-500 line-clamp-1" title={r.notes}>
                              Note: {r.notes}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200 text-right whitespace-nowrap">
                          {r.cost ? `€${r.cost.replace(/^€/, "")}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
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
    </div>
  );
}
