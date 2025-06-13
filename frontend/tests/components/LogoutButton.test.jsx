import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "../../src/components/LogoutButton";

describe("LogoutButton", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    sessionStorage.setItem("something", "value");
    jest.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the logout button", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("clears storage and dispatches authChange event on click", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: /logout/i });

    fireEvent.click(button);

    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("something")).toBeNull();
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "authChange" })
    );
  });
});
