import { describe, it, expect } from "vitest";
import { checkCoverage } from "./coverage";

describe("checkCoverage", () => {
  it("98101 Seattle is active", () => expect(checkCoverage("98101")).toBe("active"));
  it("90001 Los Angeles is active", () => expect(checkCoverage("90001")).toBe("active"));
  it("60601 Chicago is active", () => expect(checkCoverage("60601")).toBe("active"));
  it("33101 Miami is active", () => expect(checkCoverage("33101")).toBe("active"));
  it("rejects non 5 digit input", () => expect(checkCoverage("981")).toBe("invalid"));
  it("rejects letters", () => expect(checkCoverage("abcde")).toBe("invalid"));
});
