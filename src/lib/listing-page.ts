import { parseListingText, type ParsedListing } from "./listing-parse";

// Browser-safe helpers for reading vehicle details from a listing page's HTML.
// Uses the structured data (JSON-LD) and meta tags sites publish for search engines.

const BLOCKED_HOST = /^(localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[.*\]|::1?)$/i;

export function checkListingUrl(raw: string): URL | null {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return null; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;
  if (BLOCKED_HOST.test(url.hostname) || !url.hostname.includes(".")) return null;
  return url;
}

function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

function meta(html: string, key: string): string | undefined {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
  return content ? decode(content) : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
function str(v: unknown): string | undefined {
  if (typeof v === "string" || typeof v === "number") return String(v).trim() || undefined;
  if (v && typeof v === "object" && "name" in v) return str((v as Json).name);
  return undefined;
}

function collect(node: unknown, out: Json[]) {
  if (Array.isArray(node)) { node.forEach(n => collect(n, out)); return; }
  if (!node || typeof node !== "object") return;
  const o = node as Json;
  if (o["@graph"]) collect(o["@graph"], out);
  const t = o["@type"];
  const types = (Array.isArray(t) ? t : [t]).map(x => String(x).toLowerCase());
  if (types.some(x => ["vehicle", "car", "motorizedbicycle", "product", "individualproduct"].includes(x))) out.push(o);
}

export function parseListingHtml(html: string): ParsedListing {
  const result: ParsedListing = {};
  const items: Json[] = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { collect(JSON.parse(m[1] ?? ""), items); } catch { /* ignore broken blocks */ }
  }
  const v = items.find(i => i.vehicleIdentificationNumber || i.modelDate || i.vehicleModelDate || i.brand) ?? items[0];
  if (v) {
    const year = str(v.vehicleModelDate ?? v.modelDate ?? v.productionDate)?.slice(0, 4);
    const make = str(v.brand ?? v.manufacturer);
    const model = str(v.model);
    const built = [year, make, model].filter(Boolean).join(" ");
    const name = str(v.name);
    if (year && (make || model)) result.vehicle = built;
    else if (name) result.vehicle = name;
    const vin = str(v.vehicleIdentificationNumber)?.toUpperCase();
    if (vin && /^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) result.vin = vin;
    const odo = v.mileageFromOdometer as Json | undefined;
    const miles = str(odo && typeof odo === "object" ? odo.value : odo);
    if (miles && /^\d[\d,.]*$/.test(miles)) result.mileage = `${Number(miles.replace(/,/g, "")).toLocaleString("en-US")} miles`;
    const offers = (Array.isArray(v.offers) ? v.offers[0] : v.offers) as Json | undefined;
    const price = str(offers?.price);
    if (price && /^\d[\d,.]*$/.test(price)) result.price = `$${Number(price.replace(/,/g, "")).toLocaleString("en-US")}`;
    const addr = ((offers?.seller as Json | undefined)?.address ?? (v as Json).address) as Json | undefined;
    if (addr && typeof addr === "object") {
      const loc = [str(addr.addressLocality), str(addr.addressRegion), str(addr.postalCode)].filter(Boolean).join(", ");
      if (loc) result.location = loc;
    }
  }
  // Fall back to the page title and description text.
  const title = meta(html, "og:title") ?? decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const desc = meta(html, "og:description") ?? meta(html, "description") ?? "";
  const fromText = parseListingText(`${title}\n${desc}`);
  return { ...fromText, ...Object.fromEntries(Object.entries(result).filter(([, x]) => x)) };
}
