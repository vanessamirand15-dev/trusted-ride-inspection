import { describe, expect, it } from "vitest";
import { checkListingUrl, parseListingHtml } from "./listing-page";

describe("checkListingUrl", () => {
  it("accepts public https links", () => {
    expect(checkListingUrl("https://seattle.craigslist.org/cto/123.html")?.hostname).toBe("seattle.craigslist.org");
  });
  it("rejects private and non-web addresses", () => {
    expect(checkListingUrl("http://localhost:8080")).toBeNull();
    expect(checkListingUrl("http://192.168.1.5/car")).toBeNull();
    expect(checkListingUrl("http://169.254.169.254/latest")).toBeNull();
    expect(checkListingUrl("file:///etc/passwd")).toBeNull();
  });
});

describe("parseListingHtml", () => {
  it("reads vehicle structured data", () => {
    const html = `<script type="application/ld+json">{"@type":"Car","name":"Used Civic","brand":{"name":"Honda"},"model":"Civic EX","vehicleModelDate":"2019","vehicleIdentificationNumber":"2hgfc2f73kh512345","mileageFromOdometer":{"value":"48210"},"offers":{"price":"18900","seller":{"address":{"addressLocality":"Tacoma","addressRegion":"WA","postalCode":"98402"}}}}</script>`;
    expect(parseListingHtml(html)).toEqual({
      vehicle: "2019 Honda Civic EX",
      vin: "2HGFC2F73KH512345",
      mileage: "48,210 miles",
      price: "$18,900",
      location: "Tacoma, WA, 98402",
    });
  });
  it("falls back to the page title", () => {
    const html = `<head><meta property="og:title" content="2017 Toyota Camry SE - $14,500"></head>`;
    expect(parseListingHtml(html).vehicle).toBe("2017 Toyota Camry SE");
  });
});
