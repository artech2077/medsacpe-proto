import { describe, expect, it } from "vitest";
import {
  renderInlineText,
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
    const panel = WeightDosingCalculatorIcon();
    expect(panel.props.title).toBe("Weight-based dose calculator");
    expect(panel.props.panelTitle).toBe("Weight-based liquid medication dosing");
    expect(panel.props.className).toContain("ml-2");
    expect(panel.props.compactTrigger).toBeTruthy();
  });
});
