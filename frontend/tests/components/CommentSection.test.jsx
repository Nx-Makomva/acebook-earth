import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentSection from "../../components/CommentSection";
import { getComments, addComment } from "../../services/comments";

// Mock services
jest.mock("../../services/comments", () => ({
  getComments: jest.fn(),
  addComment: jest.fn(),
}));

describe("CommentSection", () => {
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

  it("renders when the comment section has no comments", async () => {
    getComments.mockResolvedValueOnce([]);

    render(<CommentSection postId="1" />);
    expect(screen.getByText("Comments:")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No comments yet.")).toBeInTheDocument();
    });
  });

  it("renders when the comments comes from the API", async () => {
    getComments.mockResolvedValueOnce([
      { userName: "Max", comment: "Beautiful Kitten!" },
    ]);

    render(<CommentSection postId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Max:")).toBeInTheDocument();
      expect(screen.getByText("Beautiful Kitten!")).toBeInTheDocument();
    });
  });

  it("this allows the user to post a new comment", async () => {
    getComments.mockResolvedValueOnce([]);
    addComment.mockResolvedValueOnce({
      userName: "Jessie",
      comment: "I love my Puppy!",
    });

    render(<CommentSection postId="1" />);

    const input = screen.getByPlaceholderText("Write a comment...");
    const button = screen.getByText("Post");

    fireEvent.change(input, { target: { value: "I love my Puppy!" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(addComment).toHaveBeenCalledWith("1", "I love my Puppy!", fakeToken, fakeUserId);
      expect(screen.getByText("Jessie:")).toBeInTheDocument();
      expect(screen.getByText("I love my Puppy!")).toBeInTheDocument();
    });
  });

  it("does not accept to post an empty comment", async () => {
    getComments.mockResolvedValueOnce([]);
    render(<CommentSection postId="1" />);

    const button = screen.getByText("Post");
    fireEvent.click(button);

    await waitFor(() => {
      expect(addComment).not.toHaveBeenCalled();
    });
  });

  it("shows an error message when loading comments fails", async () => {
    getComments.mockRejectedValueOnce(new Error("API error"));

    render(<CommentSection postId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load comments.")).toBeInTheDocument();
    });
  });

  it("shows an error message when posting comment fails", async () => {
    getComments.mockResolvedValueOnce([]);
    addComment.mockRejectedValueOnce(new Error("API error"));

    render(<CommentSection postId="1" />);

    const input = screen.getByPlaceholderText("Write a comment...");
    const button = screen.getByText("Post");

    fireEvent.change(input, { target: { value: "Test fail" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to post comment.")).toBeInTheDocument();
    });
  });
});
