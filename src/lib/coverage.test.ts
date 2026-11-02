import { describe, expect, it } from "vitest";
import { checkCoverage } from "./coverage";

describe("checkCoverage", () => {
  it("98101 Seattle is active", () => expect(checkCoverage("98101")).toBe("active"));
  it("98402 Tacoma is active", () => expect(checkCoverage("98402")).toBe("active"));
  it("90001 is expanding soon", () => expect(checkCoverage("90001")).toBe("expanding"));
  it("rejects non 5 digit input", () => expect(checkCoverage("981")).toBe("invalid"));
});
