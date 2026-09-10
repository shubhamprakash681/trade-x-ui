import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DynamicSparkline } from "./dynamic-sparkline";

describe("DynamicSparkline", () => {
  it("renders SVG sparkline with green gradient when stock is positive", () => {
    render(<DynamicSparkline symbol="ASIANPAINT" currentPrice={1199.28} changeAmount={5.21} isPositive={true} />);

    const svg = screen.getByTestId("dynamic-sparkline-svg");
    expect(svg).toBeInTheDocument();

    // Contains green stroke
    const path = svg.querySelector("path[stroke='#10B981']");
    expect(path).toBeInTheDocument();

    // Area fill gradient exists
    const gradient = svg.querySelector("linearGradient[id*='ASIANPAINT']");
    expect(gradient).toBeInTheDocument();
  });

  it("renders SVG sparkline with red gradient when stock is negative", () => {
    render(<DynamicSparkline symbol="INFY" currentPrice={1520.0} changeAmount={-25.5} isPositive={false} />);

    const svg = screen.getByTestId("dynamic-sparkline-svg");
    expect(svg).toBeInTheDocument();

    const path = svg.querySelector("path[stroke='#EF4444']");
    expect(path).toBeInTheDocument();
  });

  it("triggers hover scrubbing and displays tooltip with price", () => {
    const handleHover = vi.fn();

    render(
      <DynamicSparkline
        symbol="ASIANPAINT"
        currentPrice={1199.28}
        changeAmount={5.21}
        isPositive={true}
        onHoverPrice={handleHover}
      />,
    );

    const svg = screen.getByTestId("dynamic-sparkline-svg");

    // Mock getBoundingClientRect
    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 300,
      height: 80,
      right: 300,
      bottom: 80,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerMove(svg, { clientX: 150 });

    expect(handleHover).toHaveBeenCalled();
    const tooltip = screen.getByTestId("sparkline-tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(/₹/);

    fireEvent.pointerLeave(svg);
    expect(handleHover).toHaveBeenCalledWith(null);
    expect(screen.queryByTestId("sparkline-tooltip")).not.toBeInTheDocument();
  });
});
