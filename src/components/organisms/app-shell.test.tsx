import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/organisms/app-shell";

vi.mock("@/components/organisms/sidebar", () => ({
  Sidebar: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

vi.mock("@/components/organisms/navbar", () => ({
  Navbar: () => <header data-testid="navbar">Navbar</header>,
}));

vi.mock("@/components/organisms/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe("AppShell", () => {
  it("renders sidebar, navbar, main children, and footer for authenticated layouts", () => {
    render(
      <AppShell>
        <div data-testid="dashboard-content">Dashboard Content</div>
      </AppShell>,
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
