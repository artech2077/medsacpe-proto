import { describe, expect, it } from "vitest";
import { hasOwnerAccess, isAllowedProductionPath, parseShareOnlyPaths } from "./proxy";

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

describe("share deployment access", () => {
  const sharePaths = ["/share/mounjaro-update"];

  it("serves only the shared page and its infrastructure routes", () => {
    expect(isAllowedProductionPath("/share/mounjaro-update", sharePaths)).toBe(true);
    expect(isAllowedProductionPath("/share/mounjaro-update/", sharePaths)).toBe(true);
    expect(isAllowedProductionPath("/ingest/e", sharePaths)).toBe(true);
    expect(isAllowedProductionPath("/health", sharePaths)).toBe(true);
  });

  it("blocks every other page", () => {
    expect(isAllowedProductionPath("/", sharePaths)).toBe(false);
    expect(isAllowedProductionPath("/gallery", sharePaths)).toBe(false);
    expect(isAllowedProductionPath("/ai-drug-mono-v4", sharePaths)).toBe(false);
    expect(isAllowedProductionPath("/share/other", sharePaths)).toBe(false);
  });

  it("parses the comma-separated setting", () => {
    expect(parseShareOnlyPaths(" /share/a/ , /share/b,bad")).toEqual(["/share/a", "/share/b"]);
    expect(parseShareOnlyPaths(undefined)).toEqual([]);
  });
});

describe("owner access on a share deployment", () => {
  it("unlocks only with the configured key", () => {
    expect(hasOwnerAccess("secret-key", "secret-key")).toBe(true);
    expect(hasOwnerAccess("wrong", "secret-key")).toBe(false);
    expect(hasOwnerAccess(undefined, "secret-key")).toBe(false);
  });

  it("never unlocks when no key is configured", () => {
    expect(hasOwnerAccess(undefined, undefined)).toBe(false);
    expect(hasOwnerAccess("", "")).toBe(false);
  });
});
