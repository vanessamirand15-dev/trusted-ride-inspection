export const COVERAGE_HUBS = [
  { name: "Greater Seattle Area", zips: "980xx · 981xx", x: 48, y: 38 },
  { name: "Bellevue", zips: "98004 to 98009", x: 62, y: 42 },
  { name: "Tacoma", zips: "983xx · 984xx", x: 40, y: 72 },
  { name: "Snohomish County", zips: "982xx", x: 55, y: 14 },
] as const;

export const COVERAGE_RADIUS_MILES = 35;

/** Puget Sound ZIPs (980xx to 984xx) are covered in this demo. */
export function checkCoverage(zip: string): "active" | "expanding" | "invalid" {
  const z = zip.trim();
  if (!/^\d{5}$/.test(z)) return "invalid";
  const prefix = Number(z.slice(0, 3));
  return prefix >= 980 && prefix <= 984 ? "active" : "expanding";
}
