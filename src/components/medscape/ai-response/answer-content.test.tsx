import { describe, expect, it } from "vitest";
import {
  renderInlineText,
  WEIGHT_DOSING_CALCULATOR_URL,
  WeightDosingCalculatorIcon,
} from "./answer-content";

describe("renderInlineText", () => {
  it("places a calculator icon after Content API weight-dosing content", () => {
    const nodes = renderInlineText(
      "{calc_weight_dosing}10 mg/kg IV q2Weeks",
    );

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBe("10 mg/kg IV q2Weeks");
    expect((nodes[1] as { type: unknown }).type).toBe(
      WeightDosingCalculatorIcon,
    );
    const icon = WeightDosingCalculatorIcon();
    expect(icon.props["aria-label"]).toBe(
      "Open weight-based dose calculator in a new tab",
    );
    expect(icon.props.href).toBe(WEIGHT_DOSING_CALCULATOR_URL);
    expect(icon.props.target).toBe("_blank");
    expect(icon.props.rel).toBe("noopener noreferrer");
    expect(icon.props.className).toContain("ml-2");
  });
});
