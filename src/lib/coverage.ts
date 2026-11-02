export type CoverageStatus = "active" | "invalid";

/** National regions shown on the illustrative US coverage map. */
export const COVERAGE_REGIONS = [
  { name: "Northeast", detail: "New York, Boston, Philadelphia and more", zips: "010xx · 100xx · 190xx", x: 88, y: 14 },
  { name: "Southeast", detail: "Atlanta, Miami, Charlotte and more", zips: "280xx · 300xx · 330xx", x: 74, y: 62 },
  { name: "Midwest", detail: "Chicago, Detroit, Minneapolis and more", zips: "430xx · 530xx · 600xx", x: 52, y: 26 },
  { name: "South Central", detail: "Dallas, Houston, New Orleans and more", zips: "700xx · 730xx · 750xx", x: 46, y: 62 },
  { name: "Mountain West", detail: "Denver, Phoenix, Salt Lake City and more", zips: "800xx · 850xx · 890xx", x: 26, y: 40 },
  { name: "West Coast", detail: "Seattle, Portland, San Francisco, Los Angeles", zips: "900xx · 970xx · 981xx", x: 10, y: 26 },
] as const;

/** Every valid 5 digit US ZIP code is covered. */
export function checkCoverage(zip: string): CoverageStatus {
  const z = zip.trim();
  return /^\d{5}$/.test(z) ? "active" : "invalid";
}
