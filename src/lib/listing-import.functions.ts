import { createServerFn } from "@tanstack/react-start";
import { checkListingUrl, parseListingHtml } from "./listing-page";
import type { ParsedListing } from "./listing-parse";

export type ListingImportResult = { ok: true; listing: ParsedListing } | { ok: false; reason: string };

export const importListingFromUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { url: string }) => {
    if (typeof input?.url !== "string" || input.url.length > 2000) throw new Error("Invalid URL");
    return { url: input.url };
  })
  .handler(async ({ data }): Promise<ListingImportResult> => {
    let url = checkListingUrl(data.url);
    if (!url) return { ok: false, reason: "That doesn't look like a public listing link." };
    try {
      let res: Response | null = null;
      for (let hop = 0; hop < 4; hop++) {
        res = await fetch(url.toString(), {
          redirect: "manual",
          signal: AbortSignal.timeout(8000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; TrustferlyListingReader/1.0)", Accept: "text/html" },
        });
        const loc = res.headers.get("location");
        if (res.status >= 300 && res.status < 400 && loc) {
          const next = checkListingUrl(new URL(loc, url).toString());
          if (!next) return { ok: false, reason: "The listing redirected somewhere we can't read." };
          url = next;
          continue;
        }
        break;
      }
      if (!res || !res.ok) {
        console.error(`Listing fetch failed [${res?.status}] ${url.hostname}`);
        return { ok: false, reason: `The listing site didn't let us read the page (status ${res?.status ?? "unknown"}).` };
      }
      if (!(res.headers.get("content-type") ?? "").includes("html")) return { ok: false, reason: "That link isn't a web page." };
      const html = (await res.text()).slice(0, 2_000_000);
      return { ok: true, listing: parseListingHtml(html) };
    } catch (e) {
      console.error("Listing fetch error", e);
      return { ok: false, reason: "We couldn't reach that listing site." };
    }
  });
