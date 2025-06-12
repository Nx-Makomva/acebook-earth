import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ProfilePage } from "../../pages/Profile/ProfilePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock services and components
jest.mock("../../services/users", () => ({
  getById: jest.fn(),
  updateById: jest.fn(),
}));


import { getById, updateById } from "../../services/users";

const mockUser = {
  _id: "123",
  name: "Max",
  dob: "1998-07-04",
  bio: "Breathing and complaining—multitasking legend.",
  location: "Nowhere, USA",
  status: "Thinking about deleting the internet.",
};

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", generateMockToken("123"));
  });

  afterEach(() => {
    localStorage.clear();
  });

  const generateMockToken = (userId) => {
    const payload = btoa(JSON.stringify({ sub: userId }));
    return `xxx.${payload}.yyy`;
  };

  const renderWithRouter = (id) => {
    return render(
      <MemoryRouter initialEntries={[`/profile/${id}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfilePage addFriend={jest.fn()} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders loading state initially", async () => {
    getById.mockResolvedValueOnce({ user: mockUser });

    renderWithRouter("123");

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Profile")).toBeInTheDocument();
    });
  });

  it("renders 404 state when user not found", async () => {
    getById.mockRejectedValueOnce(new Error("Not Found"));

    renderWithRouter("999");

    await waitFor(() => {
      expect(screen.getByText(/404 error/i)).toBeInTheDocument();
    });
  });

  it("renders own profile and allows editing name", async () => {
    getById.mockResolvedValueOnce({ user: mockUser });

    renderWithRouter("123");

    await waitFor(() => {
      expect(screen.getByText("My Profile")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("edit name"));

    const input = screen.getByLabelText("editable-field");
    fireEvent.change(input, { target: { value: "New Name" } });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(updateById).toHaveBeenCalledWith("123", { name: "New Name" }, expect.any(String));
    });
  });

  it("renders someone else's profile when id doesn't match", async () => {
    getById.mockResolvedValueOnce({ user: mockUser });

    renderWithRouter("456");

    await waitFor(() => {
      expect(screen.getByText("Alice's Profile")).toBeInTheDocument();
      expect(screen.getByText("Coding...")).toBeInTheDocument();
      expect(screen.queryByLabelText("edit name")).not.toBeInTheDocument();
    });
  });
});
