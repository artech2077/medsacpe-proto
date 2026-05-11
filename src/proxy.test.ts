import { describe, expect, it } from "vitest";
import { isAllowedProductionPath } from "./proxy";

describe("production proxy allowlist", () => {
  it("allows the paid ads experience 3 route and nested chat route", () => {
    expect(isAllowedProductionPath("/paid-ads-exp-3")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-3/chat")).toBe(true);
  });

  it("keeps the existing shared paid ads route available", () => {
    expect(isAllowedProductionPath("/paid-ads-exp")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp/chat")).toBe(true);
  });

  it("does not allow routes with only a matching prefix", () => {
    expect(isAllowedProductionPath("/paid-ads-exp-30")).toBe(false);
  });
});
