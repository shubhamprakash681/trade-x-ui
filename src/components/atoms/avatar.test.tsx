import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "@/components/atoms/avatar";

describe("Avatar", () => {
  it("renders user initials when src is not provided", () => {
    render(<Avatar name="Shubham Prakash" />);
    expect(screen.getByText("SP")).toBeInTheDocument();
  });

  it("renders img element when src is provided", () => {
    render(<Avatar src="https://res.cloudinary.com/demo/avatar.png" name="Shubham Prakash" />);
    const img = screen.getByRole("img", { name: "Shubham Prakash" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://res.cloudinary.com/demo/avatar.png");
  });

  it("falls back to initials when img fails to load", () => {
    render(<Avatar src="https://res.cloudinary.com/demo/broken.png" name="Shubham Prakash" />);
    const img = screen.getByRole("img", { name: "Shubham Prakash" });
    fireEvent.error(img);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("SP")).toBeInTheDocument();
  });
});

