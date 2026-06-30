/*
 * Zoho Books integration.
 *
 * Auth uses the OAuth2 refresh-token grant. The refresh token is generated once
 * (Self Client in the Zoho API Console) and stored in env. We exchange it for a
 * short-lived access token on demand and cache it in memory.
 *
 * Region note: the *accounts* domain is region-specific and must match where the
 * refresh token was created (.com, .eu, .in, .com.au, .jp). The *api* domain for
 * data calls is returned in the token response (`api_domain`), so we use that.
 */

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  orgId: string;
  accountsDomain: string;
  apiDomainOverride?: string;
}

export interface ZohoInvoiceSummary {
  id: string;
  number: string;
  date: string;
  customerName: string;
  total: number;
  currencySymbol: string;
  status: string;
}

export interface ZohoInvoiceDraft {
  date: string;
  customerName: string;
  registration: string;
  vehicle: string;
  mileage: string;
  workCarriedOut: string;
  cost: string;
  notes: string;
}

function getConfig(): ZohoConfig | null {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const orgId = process.env.ZOHO_ORGANIZATION_ID;
  if (!clientId || !clientSecret || !refreshToken || !orgId) return null;
  return {
    clientId,
    clientSecret,
    refreshToken,
    orgId,
    accountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN || "https://accounts.zoho.com",
    apiDomainOverride: process.env.ZOHO_API_DOMAIN,
  };
}

export function isZohoConfigured(): boolean {
  return getConfig() !== null;
}

let tokenCache: { token: string; apiDomain: string; expiresAt: number } | null = null;

async function getToken(cfg: ZohoConfig): Promise<{ token: string; apiDomain: string }> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return { token: tokenCache.token, apiDomain: tokenCache.apiDomain };
  }
  const params = new URLSearchParams({
    refresh_token: cfg.refreshToken,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    grant_type: "refresh_token",
  });
  const res = await fetch(`${cfg.accountsDomain}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(
      data?.error
        ? `Zoho authentication failed (${data.error}). Check your refresh token and accounts domain.`
        : "Zoho authentication failed.",
    );
  }
  const apiDomain: string = cfg.apiDomainOverride || data.api_domain || "https://www.zohoapis.com";
  tokenCache = {
    token: data.access_token,
    apiDomain,
    expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000,
  };
  return { token: data.access_token, apiDomain };
}

async function zohoGet(
  path: string,
  searchParams: Record<string, string | number | undefined> = {},
): Promise<Record<string, unknown>> {
  const cfg = getConfig();
  if (!cfg) throw new Error("Zoho Books is not configured.");
  const { token, apiDomain } = await getToken(cfg);

  const url = new URL(`${apiDomain}/books/v3/${path}`);
  url.searchParams.set("organization_id", cfg.orgId);
  for (const [k, v] of Object.entries(searchParams)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  const data = (await res.json()) as Record<string, unknown>;
  const code = data.code as number | undefined;
  if (!res.ok || (code !== undefined && code !== 0)) {
    throw new Error((data.message as string) || `Zoho API error (${res.status}).`);
  }
  return data;
}

export async function listInvoices(search?: string): Promise<ZohoInvoiceSummary[]> {
  const data = await zohoGet("invoices", {
    sort_column: "date",
    sort_order: "D",
    per_page: 25,
    search_text: search,
  });
  const invoices = (data.invoices as Record<string, unknown>[]) || [];
  return invoices.map((i) => ({
    id: String(i.invoice_id ?? ""),
    number: String(i.invoice_number ?? ""),
    date: String(i.date ?? ""),
    customerName: String(i.customer_name ?? ""),
    total: Number(i.total ?? 0),
    currencySymbol: String(i.currency_symbol ?? "€"),
    status: String(i.status ?? ""),
  }));
}

type CustomField = Record<string, unknown>;

/** Find a custom-field value by trying several label fragments (case-insensitive). */
function pickCustomField(cfs: CustomField[], fragments: string[]): string {
  for (const cf of cfs) {
    const label = String(cf.label ?? "").toLowerCase();
    if (label && fragments.some((f) => label.includes(f))) {
      const value = cf.value;
      if (value !== undefined && value !== null && value !== "") return String(value);
    }
  }
  return "";
}

// Irish registration plate, e.g. 06-D-12345, 132-KK-1234, "211 D 12345", 06D12345
const REG_RE = /\b(\d{2,3})[\s-]?([A-Za-z]{1,2})[\s-]?(\d{1,6})\b/;

/** Pull a normalised Irish reg plate out of free text, or "" if none. */
function extractReg(text: string): string {
  const m = (text || "").match(REG_RE);
  return m ? `${m[1]}-${m[2].toUpperCase()}-${m[3]}` : "";
}

/** Best-effort fetch of a contact's custom fields (needs ZohoBooks.contacts.READ). */
async function fetchContactCustomFields(customerId: string): Promise<CustomField[]> {
  try {
    const data = await zohoGet(`contacts/${encodeURIComponent(customerId)}`);
    const contact = (data.contact as Record<string, unknown>) || {};
    return (contact.custom_fields as CustomField[]) || [];
  } catch {
    return [];
  }
}

const REG_LABELS = ["registration", "reg no", "reg.", "number plate", "plate", "reg"];
const VEHICLE_LABELS = ["vehicle", "car model", "make/model", "model", "make", "car"];
const MILEAGE_LABELS = ["mileage", "odometer", "kms"];

export async function getInvoiceDraft(
  id: string,
): Promise<{ invoice: Record<string, unknown>; draft: ZohoInvoiceDraft }> {
  const data = await zohoGet(`invoices/${encodeURIComponent(id)}`);
  const inv = (data.invoice as Record<string, unknown>) || {};
  const symbol = String(inv.currency_symbol ?? "€");

  const invoiceCfs = (inv.custom_fields as CustomField[]) || [];
  const customerId = String(inv.customer_id ?? "");
  const contactCfs = customerId ? await fetchContactCustomFields(customerId) : [];

  const reference = String(inv.reference_number ?? "").trim();
  const customerName = String(inv.customer_name ?? "");
  const notesText = String(inv.notes ?? "");

  // Registration: custom fields → invoice reference number → customer name / notes
  const registration =
    pickCustomField(invoiceCfs, REG_LABELS) ||
    pickCustomField(contactCfs, REG_LABELS) ||
    extractReg(reference) ||
    extractReg(customerName) ||
    extractReg(notesText);

  // Vehicle: custom fields → whatever is left of the reference once a reg is removed
  let vehicle =
    pickCustomField(invoiceCfs, VEHICLE_LABELS) || pickCustomField(contactCfs, VEHICLE_LABELS);
  if (!vehicle && reference) {
    const leftover = reference
      .replace(REG_RE, "")
      .replace(/[|,\/–-]+/g, " ")
      .trim();
    if (/[A-Za-z]{2,}/.test(leftover) && leftover.toUpperCase() !== registration) {
      vehicle = leftover;
    }
  }
  if (vehicle && vehicle.toUpperCase() === registration) vehicle = "";

  const mileage =
    pickCustomField(invoiceCfs, MILEAGE_LABELS) || pickCustomField(contactCfs, MILEAGE_LABELS);

  const lineItems = (inv.line_items as CustomField[]) || [];
  const workCarriedOut = lineItems
    .map((li) => {
      const name = String(li.name ?? li.description ?? "Item").trim();
      const qty = Number(li.quantity ?? 0);
      const qtyPart = qty > 1 ? ` x${qty}` : "";
      const description = String(li.description ?? "").trim();
      const descPart = description && description !== name ? ` — ${description}` : "";
      return `${name}${qtyPart}${descPart}`;
    })
    .filter(Boolean)
    .join("\n");

  const total = inv.total;
  const number = String(inv.invoice_number ?? id);
  const status = String(inv.status ?? "");

  const draft: ZohoInvoiceDraft = {
    date: String(inv.date ?? ""),
    customerName,
    registration,
    vehicle,
    mileage,
    workCarriedOut,
    cost: total !== undefined && total !== null ? `${symbol}${total}` : "",
    notes:
      `Imported from Zoho invoice ${number}` +
      (status ? ` (${status})` : "") +
      (reference ? ` · Ref: ${reference}` : ""),
  };

  return { invoice: inv, draft };
}
