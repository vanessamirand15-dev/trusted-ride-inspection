import { describe, it, expect } from "vitest";
import { parseListingText } from "./listing-parse";

describe("parseListingText", () => {
  it("reads a full classified ad", () => {
    const text = `2021 Honda CR-V EX-L
Mileage: 45,000 miles
$28,500
Located in Los Angeles, CA 90001
VIN: 1HGCV1F34LA000000`;
    expect(parseListingText(text)).toEqual({
      vehicle: "2021 Honda CR-V EX-L",
      vin: "1HGCV1F34LA000000",
      mileage: "45,000 miles",
      price: "$28,500",
      location: "Los Angeles, CA 90001",
    });
  });

  it("reads a sparse ad with city and ZIP only", () => {
    const parsed = parseListingText("Toyota Camry 2018\nSeattle WA 98109");
    expect(parsed.vehicle).toBe("Toyota Camry 2018");
    expect(parsed.location).toBe("Seattle WA 98109");
    expect(parsed.vin).toBeUndefined();
    expect(parsed.mileage).toBeUndefined();
  });

  it("never mistakes a VIN or phone number for a ZIP", () => {
    const parsed = parseListingText(
      "2015 Ford F-150 XLT\nVIN 1FTFW1ET4FKE12345\nAsk $18,900\nCall (555) 010-2030",
    );
    expect(parsed.vin).toBe("1FTFW1ET4FKE12345");
    expect(parsed.location).toBeUndefined();
    expect(parsed.vehicle).toBe("2015 Ford F-150 XLT");
    expect(parsed.price).toBe("$18,900");
  });

  it("returns nothing usable for plain chatter", () => {
    const parsed = parseListingText("Call me tomorrow and we can talk about it.");
    expect(parsed.vehicle).toBeUndefined();
    expect(parsed.vin).toBeUndefined();
    expect(parsed.location).toBeUndefined();
    expect(parsed.price).toBeUndefined();
    expect(parsed.mileage).toBeUndefined();
  });
});
