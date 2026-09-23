"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarRange,
  ChevronRight,
  CircleDollarSign,
  Library,
  Loader2,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import {
  COST_CATEGORY_LABELS,
  calculateDelegation,
  calculateFinancials,
  formatEuro,
  type CostLibraryItem,
  type DelegationPot,
  type DelegationSettings,
  type FinancialRecord,
  type JobCostCategory,
} from "@/lib/payment-delegation";

interface WorkRecord extends FinancialRecord {
  id: string;
  date: string;
  customerName: string;
  registration: string;
  vehicle: string;
  invoiceNumber?: string;
}

interface PeriodSummary {
  invoices: number;
  gross: number;
  received: number;
  vat: number;
  net: number;
  parts: number;
  other: number;
  profit: number;
  cashProfit: number;
  margin: number;
  allocations: Map<string, number>;
  remaining: number;
}

const inputClass = "w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500";
const today = new Date().toISOString().slice(0, 10);
const yearStart = `${new Date().getFullYear()}-01-01`;
const monthStart = `${today.slice(0, 7)}-01`;

function summarize(records: WorkRecord[], pots: DelegationPot[]): PeriodSummary {
  const result: PeriodSummary = {
    invoices: records.length, gross: 0, received: 0, vat: 0, net: 0, parts: 0,
    other: 0, profit: 0, cashProfit: 0, margin: 0, allocations: new Map(), remaining: 0,
  };
  for (const record of records) {
    const f = calculateFinancials(record);
    const d = calculateDelegation(f, pots);
    result.gross += f.grossCents;
    result.received += f.amountReceivedCents;
    result.vat += f.cashVatCents;
    result.net += f.netRevenueCents;
    result.parts += f.partsCents;
    result.other += f.otherCostsCents;
    result.profit += f.grossProfitCents;
    result.cashProfit += f.cashProfitCents;
    result.remaining += d.cashRemainingCents;
    for (const pot of d.pots) result.allocations.set(pot.id, (result.allocations.get(pot.id) || 0) + pot.amountCents);
  }
  result.margin = result.net > 0 ? (result.profit / result.net) * 100 : 0;
  return result;
}

function Metrics({ title, subtitle, data, pots }: { title: string; subtitle: string; data: PeriodSummary; pots: DelegationPot[] }) {
  const cards = [
    ["Invoices", String(data.invoices)], ["Customer payments", formatEuro(data.received)],
    ["VAT from payments", formatEuro(data.vat)], ["Invoice net revenue", formatEuro(data.net)],
    ["Parts / materials", formatEuro(data.parts)], ["Other job costs", formatEuro(data.other)],
    ["Job gross profit", formatEuro(data.profit)], ["Gross margin", `${data.margin.toFixed(2)}%`],
  ];
  return <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
    <div className="mb-5"><h2 className="text-xl font-bold text-white">{title}</h2><p className="text-sm text-gray-500">{subtitle}</p></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.07] bg-black/50 p-4"><div className="text-xs text-gray-500">{label}</div><div className="mt-1 text-lg font-bold text-white sm:text-xl">{value}</div></div>)}</div>
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Cash profit allocation</div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{pots.filter((p) => p.enabled).map((pot) => <div key={pot.id} className="flex items-center justify-between rounded-lg bg-white/[0.035] px-3 py-2 text-sm"><span className="text-gray-400">{pot.name} <span className="text-gray-600">{pot.percentage}%</span></span><span className="font-semibold text-white">{formatEuro(data.allocations.get(pot.id) || 0)}</span></div>)}</div>
      <div className={`mt-3 flex items-center justify-between rounded-lg border px-4 py-3 ${data.remaining < 0 ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/20 bg-emerald-500/[0.07]"}`}><span className="text-sm text-gray-300">Still available after allocations</span><span className="font-bold text-white">{formatEuro(data.remaining)}</span></div>
    </div>
  </section>;
}

export default function PaymentDelegationPage() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [settings, setSettings] = useState<DelegationSettings | null>(null);
  const [library, setLibrary] = useState<CostLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"dashboard" | "settings" | "library">("dashboard");
  const [from, setFrom] = useState(yearStart);
  const [to, setTo] = useState(today);
  const [saving, setSaving] = useState(false);
  const [libraryForm, setLibraryForm] = useState({ id: "", name: "", category: "parts_materials" as JobCostCategory, unitCost: "" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/payment-delegation", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecords(data.records || []); setSettings(data.settings); setLibrary(data.library || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load financial records."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const pots = useMemo(() => settings?.pots || [], [settings?.pots]);
  const monthRecords = useMemo(() => records.filter((r) => r.date >= monthStart && r.date <= today), [records]);
  const ytdRecords = useMemo(() => records.filter((r) => r.date >= yearStart && r.date <= today), [records]);
  const filtered = useMemo(() => records.filter((r) => (!from || r.date >= from) && (!to || r.date <= to)), [records, from, to]);
  const monthSummary = useMemo(() => summarize(monthRecords, pots), [monthRecords, pots]);
  const ytdSummary = useMemo(() => summarize(ytdRecords, pots), [ytdRecords, pots]);
  const filteredSummary = useMemo(() => summarize(filtered, pots), [filtered, pots]);
  const report = useMemo(() => {
    const rows = filtered.map((record) => ({ record, f: calculateFinancials(record) })).sort((a, b) => b.f.grossProfitCents - a.f.grossProfitCents);
    const totalProfit = rows.reduce((s, row) => s + row.f.grossProfitCents, 0);
    const parts = rows.reduce((s, row) => s + row.f.partsCents, 0);
    const net = rows.reduce((s, row) => s + row.f.netRevenueCents, 0);
    const monthly = new Map<string, { revenue: number; profit: number; parts: number; vat: number }>();
    for (const row of rows) { const key = row.record.date.slice(0, 7); if (!key) continue; const m = monthly.get(key) || { revenue: 0, profit: 0, parts: 0, vat: 0 }; m.revenue += row.f.netRevenueCents; m.profit += row.f.grossProfitCents; m.parts += row.f.partsCents; m.vat += row.f.vatCents; monthly.set(key, m); }
    return { rows, average: rows.length ? totalProfit / rows.length : 0, partsPercent: net ? (parts / net) * 100 : 0, monthly: [...monthly.entries()].sort((a, b) => b[0].localeCompare(a[0])) };
  }, [filtered]);

  const saveSettings = async () => {
    if (!settings) return; setSaving(true); setError("");
    try { const res = await fetch("/api/admin/payment-delegation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "saveSettings", pots: settings.pots }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setSettings(data.settings); }
    catch (e) { setError(e instanceof Error ? e.message : "Settings could not be saved."); } finally { setSaving(false); }
  };
  const updatePot = (index: number, patch: Partial<DelegationPot>) => setSettings((current) => current ? { ...current, pots: current.pots.map((pot, i) => i === index ? { ...pot, ...patch } : pot) } : current);
  const saveLibrary = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const action = libraryForm.id ? "updateLibraryItem" : "addLibraryItem"; const res = await fetch("/api/admin/payment-delegation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id: libraryForm.id, item: { ...libraryForm, unitCost: Number(libraryForm.unitCost) } }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setLibrary(data.library); setLibraryForm({ id: "", name: "", category: "parts_materials", unitCost: "" }); } catch (e) { setError(e instanceof Error ? e.message : "Item could not be saved."); } finally { setSaving(false); } };
  const deleteLibrary = async (item: CostLibraryItem) => { if (!window.confirm(`Delete ${item.name} from the library?`)) return; const res = await fetch("/api/admin/payment-delegation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "deleteLibraryItem", id: item.id }) }); const data = await res.json(); if (res.ok) setLibrary(data.library); };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3 bg-black text-gray-400"><Loader2 className="animate-spin" /> Loading payment data…</div>;
  return <div className="min-h-screen bg-black pt-20 text-white">
    <header className="border-b border-white/10 bg-zinc-950"><div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8 lg:px-8"><div><h1 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl"><WalletCards className="text-red-400" /> Payment <span className="text-gradient">Delegation</span></h1><p className="mt-2 text-gray-400">Separate VAT and job costs, then allocate real cash profit.</p></div><Link href="/admin" className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 hover:bg-white/20"><ArrowLeft size={16} /> Back to Admin</Link></div></header>
    <main className="container mx-auto px-4 py-8 lg:px-8"><div className="mx-auto max-w-6xl">
      {error && <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <nav className="mb-7 flex overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-1">{([{ id: "dashboard", label: "Dashboard", icon: CircleDollarSign }, { id: "settings", label: "Allocation settings", icon: Settings }, { id: "library", label: "Parts / cost library", icon: Library }] as const).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${tab === id ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}><Icon size={17} /> {label}</button>)}</nav>

      {tab === "dashboard" && <div className="space-y-6"><div className="grid gap-6 xl:grid-cols-2"><Metrics title="This month" subtitle="Current calendar month. VAT and allocations reflect cash actually received." data={monthSummary} pots={pots} /><Metrics title="Year to date" subtitle="Invoice performance plus cash-based VAT and profit allocations." data={ytdSummary} pots={pots} /></div>
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="flex items-center gap-2 text-xl font-bold"><CalendarRange className="text-red-400" size={20} /> Reports</h2><p className="text-sm text-gray-500">Filter performance using the invoice date.</p></div><div className="flex flex-wrap gap-2"><label className="text-xs text-gray-500">From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${inputClass} mt-1`} /></label><label className="text-xs text-gray-500">To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputClass} mt-1`} /></label></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl bg-black/50 p-4"><div className="text-xs text-gray-500">Average profit per invoice</div><div className="mt-1 text-2xl font-bold">{formatEuro(report.average)}</div></div><div className="rounded-xl bg-black/50 p-4"><div className="text-xs text-gray-500">Average parts cost % of net revenue</div><div className="mt-1 text-2xl font-bold">{report.partsPercent.toFixed(2)}%</div></div><div className="rounded-xl bg-black/50 p-4"><div className="text-xs text-gray-500">VAT from payments</div><div className="mt-1 text-2xl font-bold">{formatEuro(filteredSummary.vat)}</div></div><div className="rounded-xl bg-black/50 p-4"><div className="text-xs text-gray-500">Cash profit available</div><div className="mt-1 text-2xl font-bold">{formatEuro(filteredSummary.cashProfit)}</div></div></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{pots.filter((pot) => pot.enabled).map((pot) => <div key={pot.id} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/40 px-3 py-2 text-sm"><span className="text-gray-400">{pot.name}</span><strong>{formatEuro(filteredSummary.allocations.get(pot.id) || 0)}</strong></div>)}</div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2"><JobRanking title="Most profitable jobs" icon={<TrendingUp size={18} className="text-emerald-400" />} rows={report.rows.slice(0, 5)} /><JobRanking title="Least profitable jobs" icon={<TrendingDown size={18} className="text-red-400" />} rows={[...report.rows].reverse().slice(0, 5)} /></div>
          <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="text-left text-xs uppercase tracking-wider text-gray-500"><tr><th className="py-3">Month</th><th>Net revenue</th><th>Gross profit</th><th>Parts</th><th>VAT invoiced</th></tr></thead><tbody>{report.monthly.map(([month, row]) => <tr key={month} className="border-t border-white/[0.07]"><td className="py-3 font-semibold">{month}</td><td>{formatEuro(row.revenue)}</td><td>{formatEuro(row.profit)}</td><td>{formatEuro(row.parts)}</td><td>{formatEuro(row.vat)}</td></tr>)}</tbody></table></div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><h2 className="mb-3 text-lg font-bold">Invoices and jobs</h2><div className="divide-y divide-white/[0.07]">{records.map((record) => { const f = calculateFinancials(record); return <Link key={record.id} href={`/admin/work-records/${record.id}`} className="flex items-center gap-3 py-3 hover:bg-white/[0.02]"><div className="min-w-0 flex-1"><div className="truncate font-semibold">{record.invoiceNumber || record.registration || record.vehicle || "Work record"}</div><div className="truncate text-xs text-gray-500">{record.date} · {record.customerName || "No customer"}</div></div><div className="text-right"><div className="font-semibold">{formatEuro(f.grossProfitCents)}</div><div className="text-xs text-gray-500">{f.marginPercent.toFixed(2)}% margin</div></div><ChevronRight size={17} className="text-gray-600" /></Link>; })}</div></section>
      </div>}

      {tab === "settings" && settings && <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-bold">Profit allocation pots</h2><p className="mt-1 max-w-2xl text-sm text-gray-400">Percentages apply only to proportional cash profit after VAT and job costs. They are never applied to unpaid invoice value.</p></div><button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold hover:bg-red-500 disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />} Save settings</button></div>
        <div className="mt-6 space-y-3">{settings.pots.map((pot, index) => <div key={pot.id} className="grid items-center gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-3 sm:grid-cols-[auto_1fr_130px_auto]"><input type="checkbox" checked={pot.enabled} onChange={(e) => updatePot(index, { enabled: e.target.checked })} className="h-5 w-5 accent-red-500" aria-label={`Enable ${pot.name}`} /><input value={pot.name} onChange={(e) => updatePot(index, { name: e.target.value })} className={inputClass} aria-label="Pot name" /><label className="relative"><input type="number" min="0" step="0.01" value={pot.percentage} onChange={(e) => updatePot(index, { percentage: Number(e.target.value) })} className={`${inputClass} pr-8`} aria-label={`${pot.name} percentage`} /><span className="absolute right-3 top-2.5 text-gray-500">%</span></label><button onClick={() => setSettings({ ...settings, pots: settings.pots.filter((_, i) => i !== index) })} className="p-2 text-gray-500 hover:text-red-400" aria-label={`Delete ${pot.name}`}><Trash2 size={18} /></button></div>)}</div>
        <button onClick={() => setSettings({ ...settings, pots: [...settings.pots, { id: `${Date.now()}-${Math.random()}`, name: "New pot", percentage: 0, enabled: true, order: settings.pots.length }] })} className="mt-4 flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"><Plus size={16} /> Add pot</button>
        {(() => { const total = settings.pots.filter((p) => p.enabled).reduce((s, p) => s + p.percentage, 0); return <div className={`mt-5 rounded-xl border p-4 ${total > 100 ? "border-red-500/30 bg-red-500/10" : "border-white/10 bg-white/[0.03]"}`}><div className="flex justify-between"><span className="text-gray-400">Enabled allocation total</span><strong>{total.toFixed(2)}%</strong></div><p className="mt-1 text-xs text-gray-500">The system does not normalize your percentages. {total > 100 ? "More than 100% over-allocates the available profit." : `${(100 - total).toFixed(2)}% remains unallocated.`}</p></div>; })()}
      </section>}

      {tab === "library" && <div className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={saveLibrary} className="h-fit rounded-2xl border border-white/10 bg-zinc-950 p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{libraryForm.id ? "Edit library item" : "Add library item"}</h2>{libraryForm.id && <button type="button" onClick={() => setLibraryForm({ id: "", name: "", category: "parts_materials", unitCost: "" })} className="text-gray-500"><X size={18} /></button>}</div><div className="mt-4 space-y-4"><label className="block text-sm text-gray-400">Name<input required value={libraryForm.name} onChange={(e) => setLibraryForm({ ...libraryForm, name: e.target.value })} className={`${inputClass} mt-1`} placeholder="TMS module" /></label><label className="block text-sm text-gray-400">Category<select value={libraryForm.category} onChange={(e) => setLibraryForm({ ...libraryForm, category: e.target.value as JobCostCategory })} className={`${inputClass} mt-1`}>{Object.entries(COST_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block text-sm text-gray-400">Current unit cost (€)<input required type="number" min="0" step="0.01" value={libraryForm.unitCost} onChange={(e) => setLibraryForm({ ...libraryForm, unitCost: e.target.value })} className={`${inputClass} mt-1`} /></label><button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold hover:bg-red-500 disabled:opacity-50"><Save size={17} /> {libraryForm.id ? "Update item" : "Save item"}</button></div></form><section className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><h2 className="text-lg font-bold">Saved costs</h2><p className="mb-4 text-sm text-gray-500">Selecting one on a job fills its current price. Every job can override that price.</p>{library.length === 0 ? <div className="rounded-xl border border-dashed border-white/10 py-12 text-center text-gray-600">No saved costs yet.</div> : <div className="divide-y divide-white/[0.07]">{library.map((item) => <div key={item.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><div className="font-semibold">{item.name}</div><div className="text-xs text-gray-500">{COST_CATEGORY_LABELS[item.category]}</div></div><div className="font-bold">€{item.unitCost.toFixed(2)}</div><button onClick={() => setLibraryForm({ id: item.id, name: item.name, category: item.category, unitCost: String(item.unitCost) })} className="p-2 text-gray-500 hover:text-white" aria-label={`Edit ${item.name}`}><Pencil size={17} /></button><button onClick={() => deleteLibrary(item)} className="p-2 text-gray-500 hover:text-red-400" aria-label={`Delete ${item.name}`}><Trash2 size={17} /></button></div>)}</div>}</section></div>}
    </div></main>
  </div>;
}

function JobRanking({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: { record: WorkRecord; f: ReturnType<typeof calculateFinancials> }[] }) {
  return <div><h3 className="mb-2 flex items-center gap-2 font-semibold">{icon}{title}</h3><div className="divide-y divide-white/[0.06] rounded-xl bg-black/40 px-3">{rows.length ? rows.map(({ record, f }) => <Link key={record.id} href={`/admin/work-records/${record.id}`} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><div className="truncate text-sm font-medium">{record.invoiceNumber || record.registration || record.vehicle || "Work record"}</div><div className="truncate text-xs text-gray-600">{record.customerName} · {record.date}</div></div><div className="shrink-0 text-sm font-bold">{formatEuro(f.grossProfitCents)}</div></Link>) : <div className="py-8 text-center text-sm text-gray-600">No invoices in this range.</div>}</div></div>;
}
