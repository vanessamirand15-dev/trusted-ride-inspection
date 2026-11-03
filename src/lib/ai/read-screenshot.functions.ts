import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { ParsedListing } from "../listing-parse";

export type ScreenshotResult = { ok: true; listing: ParsedListing } | { ok: false; reason: string };

export const readListingScreenshotFn = createServerFn({ method: "POST" })
  .inputValidator((input: { image: string }) => {
    if (typeof input?.image !== "string" || !/^data:image\/(png|jpe?g|webp);base64,/.test(input.image)) throw new Error("Please upload a PNG, JPG or WebP image.");
    if (input.image.length > 7_000_000) throw new Error("That image is too large (max 5 MB).");
    return { image: input.image };
  })
  .handler(async ({ data }): Promise<ScreenshotResult> => {
    try {
      const { readListingScreenshot } = await import("./read-screenshot.server.ts");
      return { ok: true, listing: await readListingScreenshot(getRequest(), data.image) };
    } catch (e) {
      console.error("screenshot read failed", e);
      return { ok: false, reason: "We couldn't read that screenshot." };
    }
  });
