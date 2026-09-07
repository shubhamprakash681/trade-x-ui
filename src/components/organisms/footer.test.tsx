import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/organisms/footer";

describe("Footer", () => {
  it("renders quick links including About, Terms, and Privacy", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "About TradeX" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Live Markets" })).toHaveAttribute("href", "/markets");
  });

  it("credits Shubham Prakash and displays simulation disclaimer", () => {
    render(<Footer />);

    const authorLink = screen.getByRole("link", { name: "Shubham Prakash" });
    expect(authorLink).toHaveAttribute("href", "https://github.com/shubhamprakash681");

    expect(
      screen.getByText(/TradeX is a paper-trading simulation platform for educational purposes only/i),
    ).toBeInTheDocument();
  });
});
