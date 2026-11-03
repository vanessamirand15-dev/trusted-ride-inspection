export interface ParsedListing {
  vehicle?: string;
  vin?: string;
  mileage?: string;
  price?: string;
  location?: string;
}

const VIN_RE = /\b[A-HJ-NPR-Z0-9]{17}\b/;
const YEAR_RE = /\b(19[89]\d|20[0-4]\d)\b/;
const PRICE_RE = /\$\s?([\d,]{3,9}(?:\.\d{2})?)/;
const MILEAGE_RE = /\b([\d,]{3,8})\s*(?:miles|mi\.?|kms?|kilometers)\b/i;

// Reads common listing ad text (Craigslist, Facebook Marketplace, dealer pages)
// locally in the browser so buyers can review and edit every filled field.
export function parseListingText(text: string): ParsedListing {
  const clean = text.replace(/\u00a0/g, ' ');
  const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const result: ParsedListing = {};

  const vinMatch = clean.toUpperCase().match(VIN_RE);
  if (vinMatch?.[0]) result.vin = vinMatch[0];

  const mileageMatch = clean.match(MILEAGE_RE);
  if (mileageMatch?.[1]) {
    result.mileage = `${Number(mileageMatch[1].replace(/,/g, '')).toLocaleString('en-US')} miles`;
  }

  const priceMatch = clean.match(PRICE_RE);
  if (priceMatch?.[1]) result.price = `$${priceMatch[1]}`;

  for (const line of lines) {
    const m = line.match(/(?:located in|location:?)\s*(.+)$/i);
    if (m) {
      result.location = m[1].trim();
      break;
    }
  }

  if (!result.location) {
    for (const line of lines) {
      for (const m of line.matchAll(/\b\d{5}\b/g)) {
        const zip = m[0];
        if (YEAR_RE.test(zip) || line[m.index - 1] === '$') continue;
        result.location = line;
        break;
      }
      if (result.location) break;
    }
  }

  for (const line of lines) {
    const stripped = line
      .replace(VIN_RE, '')
      .replace(/\bvin\b[:\s]*/ig, '')
      .replace(PRICE_RE, '')
      .replace(MILEAGE_RE, '')
      .replace(/[|•].*$/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/[-,]+\s*$/, '')
      .trim();
    const year = stripped.match(YEAR_RE);
    const letters = stripped.replace(/[^A-Za-z]/g, '');
    if (year && letters.length >= 3) {
      result.vehicle = stripped;
      break;
    }
  }

  return result;
}
