import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthLayout from "@/app/(auth)/layout";
import * as guestGuardModule from "@/hooks/use-guest-guard";

vi.mock("@/components/organisms/footer", () => ({
  Footer: () => <footer data-testid="footer" />,
}));

vi.mock("@/components/atoms/logo", () => ({
  Logo: () => <div data-testid="logo" />,
}));

describe("AuthLayout", () => {
  it("renders FullPageSpinner and hides auth page content when guest guard is not ready (valid token / redirecting)", () => {
    vi.spyOn(guestGuardModule, "useGuestGuard").mockReturnValue({ isReady: false });

    render(
      <AuthLayout>
        <div data-testid="login-form">Login Content</div>
      </AuthLayout>,
    );

    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders children and layout when guest guard is ready (no valid token)", () => {
    vi.spyOn(guestGuardModule, "useGuestGuard").mockReturnValue({ isReady: true });

    render(
      <AuthLayout>
        <div data-testid="login-form">Login Content</div>
      </AuthLayout>,
    );

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
