"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Car,
  Gauge,
  CalendarDays,
  Euro,
  Wrench,
  FileText,
  ImageIcon,
  Paperclip,
  ChevronRight,
  Fingerprint,
  Palette,
  Cog,
  Hash,
  ClipboardList,
  Upload,
} from "lucide-react";

/* ------------------------------- types ------------------------------- */

interface VehicleDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}
interface ServiceEntry {
  id: string;
  date: string;
  mileage: string;
  title: string;
  workCarriedOut: string;
  cost: string;
  performedBy: string;
  notes: string;
  documents: VehicleDocument[];
  createdAt: string;
  updatedAt: string;
}
interface MyVehicle {
  id: string;
  nickname: string;
  make: string;
  model: string;
  year: string;
  registration: string;
  vin: string;
  color: string;
  engine: string;
  currentMileage: string;
  serviceEntries: ServiceEntry[];
  createdAt: string;
  updatedAt: string;
}

type VehicleForm = Omit<MyVehicle, "id" | "serviceEntries" | "createdAt" | "updatedAt">;
type EntryForm = Omit<ServiceEntry, "id" | "documents" | "createdAt" | "updatedAt">;

interface StagedFile {
  key: string;
  file: File;
  url: string; // object URL for image previews ("" for non-images)
  isImage: boolean;
}

/* ------------------------------ helpers ------------------------------ */

const emptyVehicle = (): VehicleForm => ({
  nickname: "",
  make: "",
  model: "",
  year: "",
  registration: "",
  vin: "",
  color: "",
  engine: "",
  currentMileage: "",
});

const emptyEntry = (): EntryForm => ({
  date: new Date().toISOString().split("T")[0],
  mileage: "",
  title: "",
  workCarriedOut: "",
  cost: "",
  performedBy: "",
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

const fmtMoney = (n: number): string =>
  `€${n.toLocaleString("en-IE", { maximumFractionDigits: 0 })}`;

const fmtBytes = (n: number): string => {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const docUrl = (id: string) => `/api/admin/my-vehicles/documents/${id}`;
const isImageType = (t: string) => t.startsWith("image/");

const inputClass =
  "w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors";

/* =================================================================== */

export default function MyGaragePage() {
  const [vehicles, setVehicles] = useState<MyVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Vehicle form
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState<VehicleForm>(emptyVehicle());
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Entry form
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState<EntryForm>(emptyEntry());
  const [savingEntry, setSavingEntry] = useState(false);
  const [staged, setStaged] = useState<StagedFile[]>([]);

  // Inline document uploads (from a saved entry card)
  const [uploadingEntryId, setUploadingEntryId] = useState<string | null>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const inlineTargetEntry = useRef<string | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/my-vehicles", { cache: "no-store" });
      const data = await res.json();
      setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
    } catch {
      setError("Could not load your garage.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId) || null,
    [vehicles, selectedId],
  );

  /* --------------------------- staged files --------------------------- */

  const revokeStaged = (list: StagedFile[]) => {
    for (const s of list) if (s.url) URL.revokeObjectURL(s.url);
  };

  const addStagedFiles = (files: FileList | null) => {
    if (!files) return;
    const next: StagedFile[] = Array.from(files).map((file) => {
      const isImage = isImageType(file.type);
      return {
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        isImage,
        url: isImage ? URL.createObjectURL(file) : "",
      };
    });
    setStaged((prev) => [...prev, ...next]);
  };

  const removeStaged = (key: string) => {
    setStaged((prev) => {
      const found = prev.find((s) => s.key === key);
      if (found?.url) URL.revokeObjectURL(found.url);
      return prev.filter((s) => s.key !== key);
    });
  };

  // Revoke any remaining object URLs on unmount.
  const stagedRef = useRef<StagedFile[]>([]);
  stagedRef.current = staged;
  useEffect(() => () => revokeStaged(stagedRef.current), []);

  /* ------------------------------ vehicles ---------------------------- */

  const openAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm(emptyVehicle());
    setError("");
    setShowVehicleForm(true);
  };

  const openEditVehicle = (v: MyVehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm({
      nickname: v.nickname,
      make: v.make,
      model: v.model,
      year: v.year,
      registration: v.registration,
      vin: v.vin,
      color: v.color,
      engine: v.engine,
      currentMileage: v.currentMileage,
    });
    setError("");
    setShowVehicleForm(true);
  };

  const submitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVehicle(true);
    setError("");
    try {
      const res = await fetch("/api/admin/my-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingVehicleId
            ? { action: "updateVehicle", vehicle: { ...vehicleForm, id: editingVehicleId } }
            : { action: "addVehicle", vehicle: vehicleForm },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save vehicle.");
        return;
      }
      setVehicles(data.vehicles || []);
      if (!editingVehicleId && data.vehicle?.id) setSelectedId(data.vehicle.id);
      setShowVehicleForm(false);
    } catch {
      setError("Something went wrong while saving the vehicle.");
    } finally {
      setSavingVehicle(false);
    }
  };

  const deleteVehicle = async (v: MyVehicle) => {
    const label = v.nickname || [v.make, v.model].filter(Boolean).join(" ") || "this vehicle";
    if (
      !window.confirm(
        `Delete ${label} and its entire service history (including scanned documents)? This cannot be undone.`,
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/my-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteVehicle", id: v.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.vehicles || []);
        if (selectedId === v.id) setSelectedId(null);
      }
    } catch {
      /* ignore */
    }
  };

  /* --------------------------- service entries ------------------------ */

  const openAddEntry = () => {
    setEditingEntryId(null);
    setEntryForm(emptyEntry());
    revokeStaged(staged);
    setStaged([]);
    setError("");
    setShowEntryForm(true);
  };

  const openEditEntry = (entry: ServiceEntry) => {
    setEditingEntryId(entry.id);
    setEntryForm({
      date: entry.date,
      mileage: entry.mileage,
      title: entry.title,
      workCarriedOut: entry.workCarriedOut,
      cost: entry.cost,
      performedBy: entry.performedBy,
      notes: entry.notes,
    });
    revokeStaged(staged);
    setStaged([]);
    setError("");
    setShowEntryForm(true);
  };

  const uploadOne = async (vehicleId: string, entryId: string, file: File) => {
    const fd = new FormData();
    fd.append("vehicleId", vehicleId);
    fd.append("entryId", entryId);
    fd.append("file", file);
    const res = await fetch("/api/admin/my-vehicles/documents", { method: "POST", body: fd });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Upload failed");
    }
  };

  const submitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSavingEntry(true);
    setError("");
    try {
      const res = await fetch("/api/admin/my-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingEntryId
            ? {
                action: "updateEntry",
                vehicleId: selected.id,
                entry: { ...entryForm, id: editingEntryId },
              }
            : { action: "addEntry", vehicleId: selected.id, entry: entryForm },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save the service record.");
        return;
      }

      const entryId: string = editingEntryId || data.entry?.id;
      if (entryId && staged.length > 0) {
        for (const s of staged) {
          try {
            await uploadOne(selected.id, entryId, s.file);
          } catch (err) {
            setError(
              err instanceof Error ? `${err.message} (${s.file.name})` : "A document failed to upload.",
            );
          }
        }
      }

      revokeStaged(staged);
      setStaged([]);
      await loadVehicles();
      setShowEntryForm(false);
    } catch {
      setError("Something went wrong while saving the record.");
    } finally {
      setSavingEntry(false);
    }
  };

  const deleteEntry = async (entry: ServiceEntry) => {
    if (!selected) return;
    if (!window.confirm(`Delete the "${entry.title || "service"}" record and its documents?`)) return;
    try {
      const res = await fetch("/api/admin/my-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteEntry", vehicleId: selected.id, entryId: entry.id }),
      });
      const data = await res.json();
      if (res.ok) setVehicles(data.vehicles || []);
    } catch {
      /* ignore */
    }
  };

  /* ---------------------- inline document handling -------------------- */

  const triggerInlineUpload = (entryId: string) => {
    inlineTargetEntry.current = entryId;
    inlineInputRef.current?.click();
  };

  const onInlineFilesPicked = async (files: FileList | null) => {
    const entryId = inlineTargetEntry.current;
    if (!files || !files.length || !entryId || !selected) return;
    setUploadingEntryId(entryId);
    setError("");
    try {
      for (const file of Array.from(files)) {
        try {
          await uploadOne(selected.id, entryId, file);
        } catch (err) {
          setError(
            err instanceof Error ? `${err.message} (${file.name})` : "A document failed to upload.",
          );
        }
      }
      await loadVehicles();
    } finally {
      setUploadingEntryId(null);
      inlineTargetEntry.current = null;
      if (inlineInputRef.current) inlineInputRef.current.value = "";
    }
  };

  const deleteDocument = async (entryId: string, docId: string) => {
    if (!selected) return;
    if (!window.confirm("Remove this document?")) return;
    try {
      const res = await fetch(
        `/api/admin/my-vehicles/documents?vehicleId=${encodeURIComponent(
          selected.id,
        )}&entryId=${encodeURIComponent(entryId)}&docId=${encodeURIComponent(docId)}`,
        { method: "DELETE" },
      );
      if (res.ok) await loadVehicles();
    } catch {
      /* ignore */
    }
  };

  /* ------------------------------ derived ----------------------------- */

  const garageStats = useMemo(() => {
    let records = 0;
    let spent = 0;
    let docs = 0;
    for (const v of vehicles) {
      for (const e of v.serviceEntries || []) {
        records += 1;
        spent += parseCost(e.cost);
        docs += (e.documents || []).length;
      }
    }
    return { vehicles: vehicles.length, records, spent, docs };
  }, [vehicles]);

  const vehicleSummary = (v: MyVehicle) => {
    const entries = v.serviceEntries || [];
    const spent = entries.reduce((s, e) => s + parseCost(e.cost), 0);
    const docs = entries.reduce((s, e) => s + (e.documents || []).length, 0);
    const last = entries[0]?.date || ""; // API returns newest first
    return { count: entries.length, spent, docs, last };
  };

  /* =============================== render ============================= */

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hidden input reused for inline uploads on saved records */}
      <input
        ref={inlineInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => onInlineFilesPicked(e.target.files)}
      />

      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Car className="text-blue-400" />
                My <span className="text-gradient">Garage</span>
              </h1>
              <p className="text-gray-400">
                Private service history &amp; document archive for your own vehicles
              </p>
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
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              Loading your garage…
            </div>
          ) : selected ? (
            /* ----------------------- VEHICLE DETAIL ----------------------- */
            <VehicleDetail
              vehicle={selected}
              onBack={() => setSelectedId(null)}
              onEditVehicle={() => openEditVehicle(selected)}
              onDeleteVehicle={() => deleteVehicle(selected)}
              onAddEntry={openAddEntry}
              onEditEntry={openEditEntry}
              onDeleteEntry={deleteEntry}
              onAttach={triggerInlineUpload}
              onDeleteDoc={deleteDocument}
              uploadingEntryId={uploadingEntryId}
            />
          ) : (
            /* -------------------------- GARAGE GRID ------------------------ */
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Car size={22} />} tint="blue" value={garageStats.vehicles} label="Vehicles" />
                <StatCard
                  icon={<ClipboardList size={22} />}
                  tint="purple"
                  value={garageStats.records}
                  label="Service Records"
                />
                <StatCard
                  icon={<Paperclip size={22} />}
                  tint="emerald"
                  value={garageStats.docs}
                  label="Documents"
                />
                <StatCard
                  icon={<Euro size={22} />}
                  tint="red"
                  value={fmtMoney(garageStats.spent)}
                  label="Total Spent"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Your Vehicles</h2>
                <button
                  onClick={openAddVehicle}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="bg-zinc-950 border border-white/10 rounded-xl text-center py-20 px-6">
                  <Car className="mx-auto text-gray-700 mb-4" size={48} />
                  <p className="text-gray-300 font-medium mb-1">No vehicles yet</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Add your first car to start building its service history.
                  </p>
                  <button
                    onClick={openAddVehicle}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add First Vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {vehicles.map((v) => {
                    const s = vehicleSummary(v);
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedId(v.id)}
                        className="group text-left bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/10 rounded-2xl p-5 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xl font-bold text-white truncate">
                              {v.nickname || [v.make, v.model].filter(Boolean).join(" ") || "Untitled"}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                              {[v.make, v.model, v.year].filter(Boolean).join(" ") || "—"}
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {v.registration && (
                            <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-white text-sm font-semibold uppercase tracking-wide">
                              {v.registration}
                            </span>
                          )}
                          {v.currentMileage && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Gauge size={13} /> {v.currentMileage} km
                            </span>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-white font-semibold">{s.count}</div>
                            <div className="text-[11px] text-gray-500">Records</div>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{s.docs}</div>
                            <div className="text-[11px] text-gray-500">Docs</div>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{fmtMoney(s.spent)}</div>
                            <div className="text-[11px] text-gray-500">Spent</div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          {s.last ? `Last service ${fmtDate(s.last)}` : "No services logged yet"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ------------------------- Vehicle modal ------------------------- */}
      {showVehicleForm && (
        <Modal
          title={editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
          onClose={() => setShowVehicleForm(false)}
        >
          <form onSubmit={submitVehicle} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Labeled label="Nickname">
                <input
                  className={inputClass}
                  value={vehicleForm.nickname}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, nickname: e.target.value })}
                  placeholder="e.g. The M3"
                />
              </Labeled>
              <Labeled label="Registration">
                <input
                  className={`${inputClass} uppercase`}
                  value={vehicleForm.registration}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registration: e.target.value })}
                  placeholder="e.g. 06-D-12345"
                />
              </Labeled>
              <Labeled label="Make">
                <input
                  className={inputClass}
                  value={vehicleForm.make}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                  placeholder="e.g. BMW"
                />
              </Labeled>
              <Labeled label="Model">
                <input
                  className={inputClass}
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  placeholder="e.g. M3 (F80)"
                />
              </Labeled>
              <Labeled label="Year">
                <input
                  className={inputClass}
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                  placeholder="e.g. 2015"
                />
              </Labeled>
              <Labeled label="Engine">
                <input
                  className={inputClass}
                  value={vehicleForm.engine}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, engine: e.target.value })}
                  placeholder="e.g. S55"
                />
              </Labeled>
              <Labeled label="Colour">
                <input
                  className={inputClass}
                  value={vehicleForm.color}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                  placeholder="e.g. Yas Marina Blue"
                />
              </Labeled>
              <Labeled label="Current Mileage (km)">
                <input
                  className={inputClass}
                  value={vehicleForm.currentMileage}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, currentMileage: e.target.value })
                  }
                  placeholder="e.g. 95,000"
                />
              </Labeled>
              <div className="md:col-span-2">
                <Labeled label="VIN">
                  <input
                    className={`${inputClass} uppercase font-mono tracking-wide`}
                    value={vehicleForm.vin}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                    placeholder="17-character VIN (optional)"
                    maxLength={17}
                  />
                </Labeled>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={savingVehicle}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {savingVehicle && <Loader2 size={18} className="animate-spin" />}
                {editingVehicleId ? "Save Changes" : "Add Vehicle"}
              </button>
              <button
                type="button"
                onClick={() => setShowVehicleForm(false)}
                className="px-5 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* -------------------------- Entry modal -------------------------- */}
      {showEntryForm && selected && (
        <Modal
          title={editingEntryId ? "Edit Service Record" : "New Service Record"}
          subtitle={selected.nickname || [selected.make, selected.model].filter(Boolean).join(" ")}
          onClose={() => setShowEntryForm(false)}
        >
          <form onSubmit={submitEntry} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Labeled label="Date">
                <input
                  type="date"
                  className={inputClass}
                  value={entryForm.date}
                  onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                />
              </Labeled>
              <Labeled label="Mileage (km)">
                <input
                  className={inputClass}
                  value={entryForm.mileage}
                  onChange={(e) => setEntryForm({ ...entryForm, mileage: e.target.value })}
                  placeholder="e.g. 95,000"
                />
              </Labeled>
              <Labeled label="Title">
                <input
                  className={inputClass}
                  value={entryForm.title}
                  onChange={(e) => setEntryForm({ ...entryForm, title: e.target.value })}
                  placeholder="e.g. Full Service"
                />
              </Labeled>
              <Labeled label="Performed By">
                <input
                  className={inputClass}
                  value={entryForm.performedBy}
                  onChange={(e) => setEntryForm({ ...entryForm, performedBy: e.target.value })}
                  placeholder="e.g. M Coding / Self / Dealer"
                />
              </Labeled>
              <div className="md:col-span-2">
                <Labeled label="Cost (€)">
                  <input
                    className={inputClass}
                    value={entryForm.cost}
                    onChange={(e) => setEntryForm({ ...entryForm, cost: e.target.value })}
                    placeholder="e.g. 450"
                  />
                </Labeled>
              </div>
              <div className="md:col-span-2">
                <Labeled label="Work Carried Out">
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={entryForm.workCarriedOut}
                    onChange={(e) => setEntryForm({ ...entryForm, workCarriedOut: e.target.value })}
                    placeholder="e.g. Oil & filters, spark plugs, brake fluid, inspection"
                  />
                </Labeled>
              </div>
              <div className="md:col-span-2">
                <Labeled label="Notes (optional)">
                  <textarea
                    rows={2}
                    className={`${inputClass} resize-none`}
                    value={entryForm.notes}
                    onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                    placeholder="Parts used, part numbers, follow-ups…"
                  />
                </Labeled>
              </div>
            </div>

            {/* Document staging */}
            <div className="mt-5">
              <label className="block text-sm text-gray-400 mb-2">
                Scanned documents{" "}
                <span className="text-gray-600">(receipts, invoices, service sheets)</span>
              </label>
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-black/40 px-4 py-6 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/[0.04] transition-colors">
                <Upload size={22} className="text-gray-500" />
                <span className="text-sm text-gray-300">
                  Click to add images or PDFs
                </span>
                <span className="text-xs text-gray-600">JPG, PNG, WEBP, HEIC or PDF · up to 10 MB each</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addStagedFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              {staged.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {staged.map((s) => (
                    <div
                      key={s.key}
                      className="relative group rounded-lg border border-white/10 bg-black/40 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => removeStaged(s.key)}
                        className="absolute top-1.5 right-1.5 z-10 p-1 rounded-md bg-black/70 text-gray-300 hover:text-white hover:bg-red-600/80 transition-colors"
                        aria-label="Remove"
                      >
                        <X size={13} />
                      </button>
                      {s.isImage ? (
                        <img src={s.url} alt={s.file.name} className="h-24 w-full object-cover" />
                      ) : (
                        <div className="h-24 w-full flex items-center justify-center bg-white/[0.03]">
                          <FileText size={28} className="text-red-400" />
                        </div>
                      )}
                      <div className="px-2 py-1.5">
                        <div className="text-[11px] text-gray-300 truncate" title={s.file.name}>
                          {s.file.name}
                        </div>
                        <div className="text-[10px] text-gray-600">{fmtBytes(s.file.size)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {editingEntryId && (
                <p className="mt-2 text-xs text-gray-600">
                  Newly added files upload when you save. Existing documents are managed on the record card.
                </p>
              )}
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={savingEntry}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {savingEntry && <Loader2 size={18} className="animate-spin" />}
                {editingEntryId ? "Save Changes" : "Add Record"}
              </button>
              <button
                type="button"
                onClick={() => setShowEntryForm(false)}
                className="px-5 py-2.5 bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ============================ subcomponents =========================== */

function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  tint: "blue" | "purple" | "red" | "emerald";
}) {
  const tints: Record<string, string> = {
    blue: "from-blue-900/20 bg-blue-500/20 text-blue-400",
    purple: "from-purple-900/20 bg-purple-500/20 text-purple-400",
    red: "from-red-900/20 bg-red-500/20 text-red-400",
    emerald: "from-emerald-900/20 bg-emerald-500/20 text-emerald-400",
  };
  const [grad, chipBg, chipText] = tints[tint].split(" ");
  return (
    <div
      className={`bg-gradient-to-br ${grad} to-zinc-900/40 border border-white/10 rounded-xl p-5 flex items-center gap-4`}
    >
      <div className={`p-3 ${chipBg} rounded-lg ${chipText}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-white truncate">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="mt-16 mb-10 w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function VehicleDetail({
  vehicle,
  onBack,
  onEditVehicle,
  onDeleteVehicle,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onAttach,
  onDeleteDoc,
  uploadingEntryId,
}: {
  vehicle: MyVehicle;
  onBack: () => void;
  onEditVehicle: () => void;
  onDeleteVehicle: () => void;
  onAddEntry: () => void;
  onEditEntry: (e: ServiceEntry) => void;
  onDeleteEntry: (e: ServiceEntry) => void;
  onAttach: (entryId: string) => void;
  onDeleteDoc: (entryId: string, docId: string) => void;
  uploadingEntryId: string | null;
}) {
  const entries = vehicle.serviceEntries || [];
  const spent = entries.reduce((s, e) => s + parseCost(e.cost), 0);
  const title =
    vehicle.nickname || [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle";

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Cog size={14} />, label: "Engine", value: vehicle.engine },
    { icon: <Palette size={14} />, label: "Colour", value: vehicle.color },
    { icon: <Gauge size={14} />, label: "Mileage", value: vehicle.currentMileage ? `${vehicle.currentMileage} km` : "" },
    { icon: <Hash size={14} />, label: "Year", value: vehicle.year },
    { icon: <Fingerprint size={14} />, label: "VIN", value: vehicle.vin },
  ].filter((s) => s.value);

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to garage
      </button>

      {/* Vehicle header */}
      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
              {vehicle.registration && (
                <span className="px-3 py-1 rounded-md bg-white/[0.06] border border-white/10 text-white text-sm font-semibold uppercase tracking-wide">
                  {vehicle.registration}
                </span>
              )}
            </div>
            <p className="text-gray-400">
              {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(" ") || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onEditVehicle}
              className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-white/10"
              aria-label="Edit vehicle"
              title="Edit vehicle"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={onDeleteVehicle}
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-white/10"
              aria-label="Delete vehicle"
              title="Delete vehicle"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {specs.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="bg-black/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] uppercase tracking-wider mb-1">
                  {s.icon}
                  {s.label}
                </div>
                <div
                  className={`text-white font-semibold text-sm truncate ${
                    s.label === "VIN" ? "font-mono tracking-wide" : ""
                  }`}
                  title={s.value}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <span className="text-gray-400">
            <span className="text-white font-semibold">{entries.length}</span> service record
            {entries.length === 1 ? "" : "s"}
          </span>
          <span className="text-gray-400">
            <span className="text-white font-semibold">{fmtMoney(spent)}</span> total spent
          </span>
          {entries[0]?.date && (
            <span className="text-gray-400">
              Last service <span className="text-white font-semibold">{fmtDate(entries[0].date)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Timeline header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wrench size={18} className="text-purple-400" />
          Service History
        </h3>
        <button
          onClick={onAddEntry}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Service Record
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-xl text-center py-16 px-6">
          <ClipboardList className="mx-auto text-gray-700 mb-4" size={44} />
          <p className="text-gray-300 font-medium mb-1">No service records yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Log your first service and attach the receipt or invoice.
          </p>
          <button
            onClick={onAddEntry}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add First Record
          </button>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* timeline spine */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/30 to-red-500/40" />
          <div className="space-y-5">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => onEditEntry(entry)}
                onDelete={() => onDeleteEntry(entry)}
                onAttach={() => onAttach(entry.id)}
                onDeleteDoc={(docId) => onDeleteDoc(entry.id, docId)}
                uploading={uploadingEntryId === entry.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({
  entry,
  onEdit,
  onDelete,
  onAttach,
  onDeleteDoc,
  uploading,
}: {
  entry: ServiceEntry;
  onEdit: () => void;
  onDelete: () => void;
  onAttach: () => void;
  onDeleteDoc: (docId: string) => void;
  uploading: boolean;
}) {
  const cost = parseCost(entry.cost);
  const docs = entry.documents || [];
  return (
    <div className="relative">
      {/* node */}
      <div className="absolute -left-6 top-6 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-black" />

      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <CalendarDays size={13} />
              {fmtDate(entry.date)}
              {entry.mileage && (
                <>
                  <span className="text-gray-700">·</span>
                  <Gauge size={13} />
                  {entry.mileage} km
                </>
              )}
            </div>
            <h4 className="text-lg font-bold text-white">{entry.title || "Service"}</h4>
            {entry.performedBy && (
              <span className="mt-1 inline-block px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-xs text-gray-300">
                {entry.performedBy}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {cost > 0 && (
              <span className="text-white font-semibold whitespace-nowrap">{fmtMoney(cost)}</span>
            )}
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              aria-label="Edit record"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label="Delete record"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {entry.workCarriedOut && (
          <p className="mt-3 text-sm text-gray-300 whitespace-pre-line">{entry.workCarriedOut}</p>
        )}
        {entry.notes && (
          <p className="mt-2 text-xs text-gray-500 whitespace-pre-line">Note: {entry.notes}</p>
        )}

        {/* Documents */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Paperclip size={12} />
              Documents{docs.length ? ` (${docs.length})` : ""}
            </span>
            <button
              onClick={onAttach}
              disabled={uploading}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Plus size={13} /> Attach
                </>
              )}
            </button>
          </div>

          {docs.length === 0 ? (
            <p className="text-xs text-gray-600">No documents attached yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {docs.map((d) => (
                <DocTile key={d.id} doc={d} onDelete={() => onDeleteDoc(d.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocTile({ doc, onDelete }: { doc: VehicleDocument; onDelete: () => void }) {
  const image = isImageType(doc.type);
  return (
    <div className="relative group rounded-lg border border-white/10 bg-black/40 overflow-hidden">
      <button
        onClick={onDelete}
        className="absolute top-1.5 right-1.5 z-10 p-1 rounded-md bg-black/70 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-red-600/80 transition-all"
        aria-label="Delete document"
      >
        <Trash2 size={13} />
      </button>
      <a href={docUrl(doc.id)} target="_blank" rel="noopener noreferrer" className="block">
        {image ? (
          <img
            src={docUrl(doc.id)}
            alt={doc.name}
            className="h-28 w-full object-cover group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="h-28 w-full flex flex-col items-center justify-center gap-1.5 bg-white/[0.03] group-hover:bg-white/[0.05] transition-colors">
            {doc.type === "application/pdf" ? (
              <FileText size={26} className="text-red-400" />
            ) : (
              <ImageIcon size={26} className="text-gray-400" />
            )}
            <span className="text-[10px] uppercase tracking-wide text-gray-500">
              {doc.type === "application/pdf" ? "PDF" : "File"}
            </span>
          </div>
        )}
      </a>
      <div className="px-2 py-1.5">
        <div className="text-[11px] text-gray-300 truncate" title={doc.name}>
          {doc.name}
        </div>
        <div className="text-[10px] text-gray-600">{fmtBytes(doc.size)}</div>
      </div>
    </div>
  );
}
