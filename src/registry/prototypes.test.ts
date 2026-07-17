import { describe, expect, it } from "vitest";
import { getPrototypeFamily, prototypeRegistry } from "./prototypes";

describe("prototypeRegistry", () => {
  it("classifies every drug search concept prototype as drug-concept for analytics", () => {
    expect(prototypeRegistry.length).toBeGreaterThan(0);
    expect(prototypeRegistry.map(getPrototypeFamily)).toEqual(
      prototypeRegistry.map(() => "drug-concept"),
    );
  });
});
