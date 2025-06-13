import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
jest.mock("react-router-dom", () => {
  const navigateMock = jest.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
jest.mock("../../src/services/authentication", () => {
  const signupMock = jest.fn();
  return { signup: signupMock };
});

// Reusable function for filling out signup form
async function completeSignupForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText(/email/i);
  const passwordInputEl = screen.getByLabelText(/password/i);
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith("", "test@email.com", "1234");
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);

    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
  signup.mockRejectedValue(new Error("Error signing up"));

  render(<SignupPage />);
  const navigateMock = useNavigate();

  await completeSignupForm();

  expect(navigateMock).toHaveBeenCalledWith("/signup");

  consoleSpy.mockRestore();
});

});
