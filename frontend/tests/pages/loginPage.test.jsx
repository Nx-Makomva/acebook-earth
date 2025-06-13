import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { login } from "../../src/services/authentication";
import { LoginPage } from "../../src/pages/Login/LoginPage";
import { mockNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => {
  const mockNavigate = jest.fn();
  return {
    useNavigate: () => mockNavigate,
    __esModule: true,
    mockNavigate,
  };
});

jest.mock("../../src/services/authentication", () => ({
  login: jest.fn(),
}));

async function completeLoginForm() {
  const user = userEvent.setup();
  const emailInputEl = screen.getByLabelText(/email/i);
  const passwordInputEl = screen.getByLabelText(/password/i);
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("allows a user to login", async () => {
    login.mockResolvedValue({ token: "abc", userId: "123" });

    render(<LoginPage />);
    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
  });

  test("navigates to /posts on successful login", async () => {
    login.mockResolvedValue({
      token: "secrettoken123",
      userId: "user123",
    });

    render(<LoginPage />);
    await completeLoginForm();

    expect(mockNavigate).toHaveBeenCalledWith("/posts/feed/user123");
  });

  test("navigates to /login on unsuccessful login", async () => {
  login.mockRejectedValue(new Error("Error logging in"));
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(<LoginPage />);
  await completeLoginForm();

  expect(mockNavigate).toHaveBeenCalledWith("/login");

  consoleSpy.mockRestore();
});

});
