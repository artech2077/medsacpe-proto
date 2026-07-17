import { describe, expect, it } from "vitest";
import { isAllowedProductionPath } from "./proxy";

describe("production proxy access", () => {
  it("allows the drug search concept prototype routes", () => {
    expect(isAllowedProductionPath("/drug-concept-a")).toBe(true);
    expect(isAllowedProductionPath("/drug-concept-i")).toBe(true);
    expect(isAllowedProductionPath("/drug-concept-j")).toBe(true);
  });

  it("allows the home and gallery routes in production", () => {
    expect(isAllowedProductionPath("/")).toBe(true);
    expect(isAllowedProductionPath("/gallery")).toBe(true);
  });
});
