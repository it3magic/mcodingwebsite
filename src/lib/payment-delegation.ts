export type JobCostCategory =
  | "parts_materials"
  | "subcontractor"
  | "fuel_travel"
  | "other";

export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface JobCost {
  id: string;
  category: JobCostCategory;
  description: string;
  quantity: number;
  unitCost: number;
  libraryItemId?: string;
}

export interface FinancialRecord {
  cost?: string;
  invoiceTotal?: number;
  vatAmount?: number;
  paymentStatus?: PaymentStatus;
  amountReceived?: number;
  jobCosts?: JobCost[];
}

export interface DelegationPot {
  id: string;
  name: string;
  percentage: number;
  enabled: boolean;
  order: number;
}

export interface DelegationSettings {
  pots: DelegationPot[];
  updatedAt: string;
}

export interface CostLibraryItem {
  id: string;
  name: string;
  category: JobCostCategory;
  unitCost: number;
  updatedAt: string;
}

export const COST_CATEGORY_LABELS: Record<JobCostCategory, string> = {
  parts_materials: "Part / material",
  subcontractor: "Subcontractor",
  fuel_travel: "Fuel / travel",
  other: "Other job cost",
};

export const DEFAULT_POTS: DelegationPot[] = [
  { id: "business-operating", name: "Business operating costs", percentage: 0, enabled: true, order: 0 },
  { id: "tax-provision", name: "Tax provision", percentage: 0, enabled: true, order: 1 },
  { id: "home-household", name: "Home / household", percentage: 0, enabled: true, order: 2 },
  { id: "emergency-savings", name: "Emergency savings", percentage: 0, enabled: true, order: 3 },
  { id: "annual-bills", name: "Annual bills", percentage: 0, enabled: true, order: 4 },
  { id: "long-term-savings", name: "Long-term savings", percentage: 0, enabled: true, order: 5 },
  { id: "available-profit", name: "Available / spendable profit", percentage: 0, enabled: true, order: 6 },
];

export function eurosToCents(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value * 100) : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/,/g, "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

export function centsToEuros(cents: number): number {
  return Math.round(cents) / 100;
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(centsToEuros(cents));
}

export function jobCostTotalCents(cost: Pick<JobCost, "quantity" | "unitCost">): number {
  const quantity = Number.isFinite(cost.quantity) ? Math.max(0, cost.quantity) : 0;
  return Math.round(eurosToCents(cost.unitCost) * quantity);
}

export interface FinancialBreakdown {
  grossCents: number;
  vatCents: number;
  netRevenueCents: number;
  partsCents: number;
  otherCostsCents: number;
  totalCostsCents: number;
  grossProfitCents: number;
  marginPercent: number;
  amountReceivedCents: number;
  paidRatio: number;
  cashVatCents: number;
  cashPartsCents: number;
  cashOtherCostsCents: number;
  cashCostsCents: number;
  cashProfitCents: number;
}

export function calculateFinancials(record: FinancialRecord): FinancialBreakdown {
  const explicitTotal = eurosToCents(record.invoiceTotal);
  const grossCents = Math.max(0, explicitTotal || eurosToCents(record.cost));
  const vatCents = Math.min(grossCents, Math.max(0, eurosToCents(record.vatAmount)));
  const netRevenueCents = grossCents - vatCents;
  const costs = Array.isArray(record.jobCosts) ? record.jobCosts : [];
  let partsCents = 0;
  let otherCostsCents = 0;
  for (const cost of costs) {
    const total = jobCostTotalCents(cost);
    if (cost.category === "parts_materials") partsCents += total;
    else otherCostsCents += total;
  }
  const totalCostsCents = partsCents + otherCostsCents;
  const grossProfitCents = netRevenueCents - totalCostsCents;
  const marginPercent = netRevenueCents > 0 ? (grossProfitCents / netRevenueCents) * 100 : 0;

  const enteredReceived = Math.max(0, eurosToCents(record.amountReceived));
  const amountReceivedCents = Math.min(
    grossCents,
    record.paymentStatus === "paid" && enteredReceived === 0 ? grossCents : enteredReceived,
  );
  const paidRatio = grossCents > 0 ? Math.min(1, amountReceivedCents / grossCents) : 0;
  const cashVatCents = Math.round(vatCents * paidRatio);
  const cashPartsCents = Math.round(partsCents * paidRatio);
  const cashOtherCostsCents = Math.round(otherCostsCents * paidRatio);
  const cashCostsCents = cashPartsCents + cashOtherCostsCents;
  const cashProfitCents = amountReceivedCents - cashVatCents - cashCostsCents;

  return {
    grossCents,
    vatCents,
    netRevenueCents,
    partsCents,
    otherCostsCents,
    totalCostsCents,
    grossProfitCents,
    marginPercent,
    amountReceivedCents,
    paidRatio,
    cashVatCents,
    cashPartsCents,
    cashOtherCostsCents,
    cashCostsCents,
    cashProfitCents,
  };
}

export interface PotAllocation extends DelegationPot {
  amountCents: number;
}

export interface DelegationBreakdown {
  pots: PotAllocation[];
  percentageTotal: number;
  allocatedCents: number;
  availableProfitCents: number;
  cashRemainingCents: number;
}

export function calculateDelegation(
  financials: FinancialBreakdown,
  pots: DelegationPot[],
): DelegationBreakdown {
  const enabled = [...pots]
    .filter((pot) => pot.enabled)
    .sort((a, b) => a.order - b.order);
  const availableProfitCents = Math.max(0, financials.cashProfitCents);
  const allocations = enabled.map((pot) => ({
    ...pot,
    percentage: Number.isFinite(pot.percentage) ? Math.max(0, pot.percentage) : 0,
    amountCents: Math.round(
      availableProfitCents *
        ((Number.isFinite(pot.percentage) ? Math.max(0, pot.percentage) : 0) / 100),
    ),
  }));
  const percentageTotal = allocations.reduce((sum, pot) => sum + pot.percentage, 0);
  const allocatedCents = allocations.reduce((sum, pot) => sum + pot.amountCents, 0);
  return {
    pots: allocations,
    percentageTotal,
    allocatedCents,
    availableProfitCents,
    cashRemainingCents: financials.cashProfitCents - allocatedCents,
  };
}
