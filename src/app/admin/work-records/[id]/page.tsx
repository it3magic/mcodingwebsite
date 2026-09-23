"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Library,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import {
  COST_CATEGORY_LABELS,
  calculateDelegation,
  calculateFinancials,
  formatEuro,
  jobCostTotalCents,
  type CostLibraryItem,
  type DelegationPot,
  type FinancialRecord,
  type JobCost,
  type JobCostCategory,
  type PaymentStatus,
} from "@/lib/payment-delegation";

interface WorkRecord extends FinancialRecord {
  id: string;
  date: string;
  customerName: string;
  registration: string;
  vehicle: string;
  mileage: string;
  workCarriedOut: string;
  cost: string;
  notes: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

type CostForm = { id: string; category: JobCostCategory; description: string; quantity: string; unitCost: string; libraryItemId: string; saveToLibrary: boolean };
const emptyCost = (): CostForm => ({ id: "", category: "parts_materials", description: "", quantity: "1", unitCost: "", libraryItemId: "", saveToLibrary: false });
const inputClass = "w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500";

export default function InvoiceProfitPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<WorkRecord | null>(null);
  const [pots, setPots] = useState<DelegationPot[]>([]);
  const [library, setLibrary] = useState<CostLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showCostForm, setShowCostForm] = useState(false);
  const [costForm, setCostForm] = useState<CostForm>(emptyCost());

  const load = useCallback(async () => {
    try {
      const [recordsRes, delegationRes] = await Promise.all([
        fetch("/api/admin/work-records", { cache: "no-store" }),
        fetch("/api/admin/payment-delegation", { cache: "no-store" }),
      ]);
      const recordsData = await recordsRes.json();
      const delegationData = await delegationRes.json();
      const found = (recordsData.records || []).find((item: WorkRecord) => item.id === params.id);
      if (!found) throw new Error("This work record could not be found.");
      setRecord({ ...found, jobCosts: Array.isArray(found.jobCosts) ? found.jobCosts : [] });
      setPots(delegationData.settings?.pots || []);
      setLibrary(delegationData.library || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load this invoice."); }
    finally { setLoading(false); }
  }, [params.id]);
  useEffect(() => { load(); }, [load]);

  const financials = useMemo(() => calculateFinancials(record || {}), [record]);
  const delegation = useMemo(() => calculateDelegation(financials, pots), [financials, pots]);

  const saveRecord = async (next = record) => {
    if (!next) return false;
    setSaving(true); setSaved(false); setError("");
    try {
      const res = await fetch("/api/admin/work-records", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save.");
      setRecord(data.record); setSaved(true); window.setTimeout(() => setSaved(false), 2500); return true;
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save."); return false; }
    finally { setSaving(false); }
  };

  const selectLibrary = (libraryId: string) => {
    const item = library.find((entry) => entry.id === libraryId);
    setCostForm((current) => item ? { ...current, libraryItemId: item.id, description: item.name, category: item.category, unitCost: String(item.unitCost) } : { ...current, libraryItemId: "" });
  };
  const editCost = (cost: JobCost) => { setCostForm({ id: cost.id, category: cost.category, description: cost.description, quantity: String(cost.quantity), unitCost: String(cost.unitCost), libraryItemId: cost.libraryItemId || "", saveToLibrary: false }); setShowCostForm(true); };
  const submitCost = async (e: React.FormEvent) => {
    e.preventDefault(); if (!record) return;
    const cost: JobCost = { id: costForm.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, category: costForm.category, description: costForm.description.trim(), quantity: Math.max(0, Number(costForm.quantity) || 0), unitCost: Math.max(0, Number(costForm.unitCost) || 0), ...(costForm.libraryItemId ? { libraryItemId: costForm.libraryItemId } : {}) };
    const costs = record.jobCosts || [];
    const next = { ...record, jobCosts: costForm.id ? costs.map((item) => item.id === costForm.id ? cost : item) : [...costs, cost] };
    const ok = await saveRecord(next);
    if (ok && costForm.saveToLibrary) {
      const res = await fetch("/api/admin/payment-delegation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "addLibraryItem", item: { name: cost.description, category: cost.category, unitCost: cost.unitCost } }) });
      const data = await res.json(); if (res.ok) setLibrary(data.library || []);
    }
    if (ok) { setShowCostForm(false); setCostForm(emptyCost()); }
  };
  const removeCost = async (id: string) => { if (!record || !window.confirm("Delete this actual job cost?")) return; await saveRecord({ ...record, jobCosts: (record.jobCosts || []).filter((cost) => cost.id !== id) }); };
  const setPaymentStatus = (status: PaymentStatus) => setRecord((current) => current ? { ...current, paymentStatus: status, amountReceived: status === "paid" ? (current.invoiceTotal || Number.parseFloat(current.cost.replace(/[^0-9.]/g, "")) || 0) : status === "unpaid" ? 0 : current.amountReceived || 0 } : current);

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3 bg-black text-gray-400"><Loader2 className="animate-spin" /> Loading invoice…</div>;
  if (!record) return <div className="min-h-screen bg-black px-4 pt-32 text-center text-white"><p>{error || "Invoice not found."}</p><Link href="/admin/work-records" className="mt-4 inline-block text-red-400">Back to Work Records</Link></div>;

  const summaryCards = [
    ["Customer paid", formatEuro(financials.amountReceivedCents), "text-white"],
    ["VAT", formatEuro(financials.vatCents), "text-amber-300"],
    ["Net revenue", formatEuro(financials.netRevenueCents), "text-white"],
    ["Job costs", formatEuro(financials.totalCostsCents), "text-red-300"],
    ["Gross profit", formatEuro(financials.grossProfitCents), financials.grossProfitCents >= 0 ? "text-emerald-300" : "text-red-300"],
    ["Profit margin", `${financials.marginPercent.toFixed(2)}%`, "text-white"],
  ];

  return <div className="min-h-screen bg-black pt-20 text-white">
    <header className="border-b border-white/10 bg-zinc-950"><div className="container mx-auto px-4 py-7 lg:px-8"><Link href="/admin/work-records" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft size={16} /> Work Records</Link><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Invoice profitability</div><h1 className="mt-1 text-3xl font-bold">{record.invoiceNumber || record.registration || record.vehicle || "Work record"}</h1><p className="mt-1 text-gray-400">{[record.customerName, record.vehicle, record.registration, record.date].filter(Boolean).join(" · ")}</p></div><button onClick={() => saveRecord()} disabled={saving} className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold hover:bg-red-500 disabled:opacity-50">{saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}{saved ? "Saved" : "Save invoice finances"}</button></div></div></header>
    <main className="container mx-auto px-4 py-8 lg:px-8"><div className="mx-auto max-w-6xl space-y-6">
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><Banknote className="text-red-400" /><div><h2 className="text-xl font-bold">Invoice and payment</h2><p className="text-sm text-gray-500">Enter exact invoice figures. VAT is always kept outside profit.</p></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Gross invoice total (€)"><input type="number" min="0" step="0.01" value={record.invoiceTotal ?? ""} onChange={(e) => setRecord({ ...record, invoiceTotal: Number(e.target.value) })} className={inputClass} placeholder="0.00" /></Field><Field label="VAT amount (€)"><input type="number" min="0" step="0.01" value={record.vatAmount ?? ""} onChange={(e) => setRecord({ ...record, vatAmount: Number(e.target.value) })} className={inputClass} placeholder="0.00" /></Field><Field label="Payment status"><select value={record.paymentStatus || "unpaid"} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} className={inputClass}><option value="unpaid">Unpaid</option><option value="partial">Partially paid</option><option value="paid">Paid</option></select></Field><Field label="Cash actually received (€)"><input type="number" min="0" step="0.01" value={record.amountReceived ?? ""} disabled={record.paymentStatus === "unpaid"} onChange={(e) => setRecord({ ...record, amountReceived: Number(e.target.value) })} className={`${inputClass} disabled:opacity-50`} placeholder="0.00" /></Field></div><p className="mt-4 text-xs text-gray-500">Paid ratio: {(financials.paidRatio * 100).toFixed(2)}%. Delegation uses this ratio, not the full invoice, until all cash is received.</p></section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{summaryCards.map(([label, value, color]) => <div key={label} className="rounded-xl border border-white/10 bg-zinc-950 p-4"><div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</div><div className={`mt-2 text-xl font-bold ${color}`}>{value}</div></div>)}</section>

      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Job Costs</h2><p className="text-sm text-gray-500">Your real supplier and job costs, never customer selling prices.</p></div><button onClick={() => { setCostForm(emptyCost()); setShowCostForm(true); }} className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 font-semibold hover:bg-white/15"><Plus size={17} /> Add cost</button></div>
        {(record.jobCosts || []).length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-gray-600">No actual job costs entered yet.</div> : <div className="mt-5 divide-y divide-white/[0.07]">{(record.jobCosts || []).map((cost) => <div key={cost.id} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><div className="font-semibold">{cost.description || "Unnamed cost"}</div><div className="text-xs text-gray-500">{COST_CATEGORY_LABELS[cost.category]} · {cost.quantity} × €{cost.unitCost.toFixed(2)}</div></div><div className="font-bold">{formatEuro(jobCostTotalCents(cost))}</div><button onClick={() => editCost(cost)} className="p-2 text-gray-500 hover:text-white" aria-label="Edit cost"><Pencil size={17} /></button><button onClick={() => removeCost(cost.id)} className="p-2 text-gray-500 hover:text-red-400" aria-label="Delete cost"><Trash2 size={17} /></button></div>)}</div>}
        <div className="mt-4 flex justify-between rounded-xl bg-black/50 px-4 py-3"><span className="text-gray-400">Total actual job costs</span><strong>{formatEuro(financials.totalCostsCents)}</strong></div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 to-red-950/20 p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><WalletCards className="text-red-400" /><div><h2 className="text-xl font-bold">Payment Delegation</h2><p className="text-sm text-gray-500">Cash reserves first, followed by allocations from cash profit only.</p></div></div><div className="space-y-2"><AllocationRow label="VAT reserve" detail={`${(financials.paidRatio * 100).toFixed(2)}% of invoice VAT`} value={financials.cashVatCents} /><AllocationRow label="Parts / materials reserve" detail="Proportional actual parts costs" value={financials.cashPartsCents} /><AllocationRow label="Other job-cost reserve" detail="Subcontractor, travel and other costs" value={financials.cashOtherCostsCents} />{delegation.pots.map((pot) => <AllocationRow key={pot.id} label={pot.name} detail={`${pot.percentage}% of cash profit`} value={pot.amountCents} />)}</div><div className={`mt-4 flex items-center justify-between rounded-xl border p-4 ${delegation.cashRemainingCents < 0 ? "border-red-500/40 bg-red-500/10" : "border-emerald-500/20 bg-emerald-500/[0.07]"}`}><div><div className="font-semibold">Amount still available</div><div className="text-xs text-gray-500">After VAT, costs and enabled profit pots</div></div><div className="text-xl font-bold">{formatEuro(delegation.cashRemainingCents)}</div></div>{delegation.percentageTotal > 100 && <p className="mt-3 text-sm text-red-300">Your enabled pots total {delegation.percentageTotal.toFixed(2)}%, so profit is currently over-allocated. Update this in Payment Delegation settings.</p>}
        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-gray-300"><p>You received <strong className="text-white">{formatEuro(financials.amountReceivedCents)}</strong>.</p><p><strong className="text-amber-300">{formatEuro(financials.cashVatCents)}</strong> of the cash received is reserved for VAT.</p><p><strong className="text-white">{formatEuro(financials.cashCostsCents)}</strong> is the proportional amount required to cover costs for this job.</p><p>Your full job profit is <strong className="text-emerald-300">{formatEuro(financials.grossProfitCents)}</strong>; profit represented by cash received so far is <strong className="text-emerald-300">{formatEuro(financials.cashProfitCents)}</strong>.</p></div>
        <Link href="/admin/payment-delegation" className="mt-4 inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300"><CircleDollarSign size={16} /> Open dashboard and allocation settings</Link>
      </section>
    </div></main>

    {showCostForm && <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 p-4 pt-24 backdrop-blur-sm" onClick={() => setShowCostForm(false)}><form onSubmit={submitCost} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h2 className="text-lg font-bold">{costForm.id ? "Edit actual cost" : "Add actual cost"}</h2><button type="button" onClick={() => setShowCostForm(false)} className="text-gray-500 hover:text-white"><X size={19} /></button></div><div className="space-y-4 p-5">{library.length > 0 && <Field label="Fill from Parts / Cost Library"><div className="relative"><Library className="absolute left-3 top-3 text-gray-600" size={17} /><select value={costForm.libraryItemId} onChange={(e) => selectLibrary(e.target.value)} className={`${inputClass} pl-10`}><option value="">Enter manually</option>{library.map((item) => <option key={item.id} value={item.id}>{item.name} — €{item.unitCost.toFixed(2)}</option>)}</select></div></Field>}<Field label="Cost category"><select value={costForm.category} onChange={(e) => setCostForm({ ...costForm, category: e.target.value as JobCostCategory })} className={inputClass}>{Object.entries(COST_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Description"><input required value={costForm.description} onChange={(e) => setCostForm({ ...costForm, description: e.target.value })} className={inputClass} placeholder="TMS module" /></Field><div className="grid grid-cols-2 gap-4"><Field label="Quantity"><input required type="number" min="0" step="0.01" value={costForm.quantity} onChange={(e) => setCostForm({ ...costForm, quantity: e.target.value })} className={inputClass} /></Field><Field label="Unit cost (€)"><input required type="number" min="0" step="0.01" value={costForm.unitCost} onChange={(e) => setCostForm({ ...costForm, unitCost: e.target.value })} className={inputClass} /></Field></div><div className="flex justify-between rounded-lg bg-black/50 px-4 py-3"><span className="text-gray-400">Line total</span><strong>€{((Number(costForm.quantity) || 0) * (Number(costForm.unitCost) || 0)).toFixed(2)}</strong></div>{!costForm.id && <label className="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={costForm.saveToLibrary} onChange={(e) => setCostForm({ ...costForm, saveToLibrary: e.target.checked })} className="h-4 w-4 accent-red-500" /> Save this current unit cost to the library</label>}<button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold hover:bg-red-500 disabled:opacity-50"><Save size={17} /> Save job cost</button></div></form></div>}
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm text-gray-400">{label}<div className="mt-1">{children}</div></label>; }
function AllocationRow({ label, detail, value }: { label: string; detail: string; value: number }) { return <div className="flex items-center justify-between gap-4 rounded-lg bg-black/40 px-4 py-3"><div><div className="text-sm font-medium text-gray-200">{label}</div><div className="text-xs text-gray-600">{detail}</div></div><div className="font-bold">{formatEuro(value)}</div></div>; }
