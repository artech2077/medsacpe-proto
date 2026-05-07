import { describe, expect, it } from "vitest";
import { getPrototypeFamily, prototypeRegistry } from "./prototypes";

describe("prototypeRegistry", () => {
  it("classifies paid ad prototypes as paid-ads for analytics", () => {
    const paidAdPrototypes = prototypeRegistry.filter((prototype) =>
      prototype.slug.startsWith("paid-ads-exp"),
    );

    expect(paidAdPrototypes.map((prototype) => prototype.slug)).toEqual([
      "paid-ads-exp",
      "paid-ads-exp-2",
    ]);
    expect(paidAdPrototypes.map(getPrototypeFamily)).toEqual(["paid-ads", "paid-ads"]);
  });
});
