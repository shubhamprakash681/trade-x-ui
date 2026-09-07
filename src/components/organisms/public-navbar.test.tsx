import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { PublicNavbar } from "@/components/organisms/public-navbar";
import { useAuthStore } from "@/store/auth.store";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("PublicNavbar", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("renders navigation links and auth buttons when unauthenticated", () => {
    render(<PublicNavbar />);

    expect(screen.getByRole("link", { name: "Features" })).toHaveAttribute("href", "/#features");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get Started/i })).toBeInTheDocument();
  });

  it("renders dashboard button when authenticated", () => {
    useAuthStore.setState({
      user: {
        id: 1,
        email: "shubham@example.com",
        fullName: "Shubham Prakash",
        avatarUrl: null,
        roles: ["ROLE_USER"],
        createdAt: "2026-01-01T00:00:00Z",
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<PublicNavbar />);

    expect(screen.getByRole("button", { name: /^Dashboard$/ })).toBeInTheDocument();
  });
});
