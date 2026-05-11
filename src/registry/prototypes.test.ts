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
      "paid-ads-exp-3",
      "paid-ads-exp-4",
      "paid-ads-exp-5",
      "paid-ads-exp-6",
    ]);
    expect(paidAdPrototypes.map(getPrototypeFamily)).toEqual([
      "paid-ads",
      "paid-ads",
      "paid-ads",
      "paid-ads",
      "paid-ads",
      "paid-ads",
    ]);
  });
});
