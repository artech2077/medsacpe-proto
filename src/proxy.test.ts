import { describe, expect, it } from "vitest";
import { isAllowedProductionPath } from "./proxy";

describe("production proxy allowlist", () => {
  it("allows shared paid ads experiment routes and nested chat routes", () => {
    expect(isAllowedProductionPath("/paid-ads-exp-3")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-3/chat")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-4")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-4/chat")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-5")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp-5/chat")).toBe(true);
  });

  it("keeps the existing shared paid ads route available", () => {
    expect(isAllowedProductionPath("/paid-ads-exp")).toBe(true);
    expect(isAllowedProductionPath("/paid-ads-exp/chat")).toBe(true);
  });

  it("does not allow routes with only a matching prefix", () => {
    expect(isAllowedProductionPath("/paid-ads-exp-30")).toBe(false);
  });
});
