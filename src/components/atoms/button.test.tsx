import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/atoms/button";

describe("Button", () => {
  it("disables itself while loading and exposes the label", () => {
    render(<Button loading>Place order</Button>);
    expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
  });
});
