import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "../../components/LikeButton";
import { handleLikeRequest } from "../../services/likes";

jest.mock("../../services/likes", () => ({
  handleLikeRequest: jest.fn(),
}));

describe("LikeButton", () => {
  const fakeToken = "fake-token";
  const fakeUserId = "user-123";

  beforeEach(() => {
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("userId", fakeUserId);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the default props", () => {
    render(<LikeButton postId="123" />);
    expect(screen.getByText("🤍 Like")).toBeInTheDocument();
    expect(screen.getByText("0 likes")).toBeInTheDocument();
  });

  it("renders when in the initial like state and count", () => {
    render(<LikeButton postId="123" initialLiked={true} initialLikesCount={10} />);
    expect(screen.getByText("❤️ Liked")).toBeInTheDocument();
    expect(screen.getByText("10 likes")).toBeInTheDocument();
  });

  it("renders a like on button click", async () => {
    handleLikeRequest.mockResolvedValueOnce({ liked: true, likesCount: 5 });

    render(<LikeButton postId="123" initialLiked={false} initialLikesCount={4} />);

    const button = screen.getByRole("button", { name: /🤍 Like/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleLikeRequest).toHaveBeenCalledWith("123", fakeUserId, fakeToken);
      expect(screen.getByText("❤️ Liked")).toBeInTheDocument();
      expect(screen.getByText("5 likes")).toBeInTheDocument();
    });
  });

  it("handles API failure", async () => {
    console.error = jest.fn(); // Silence the expected error output
    handleLikeRequest.mockRejectedValueOnce(new Error("Failed"));

    render(<LikeButton postId="123" />);

    const button = screen.getByRole("button", { name: /🤍 Like/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleLikeRequest).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to toggle like:",
        expect.any(Error)
      );
    });
  });
});