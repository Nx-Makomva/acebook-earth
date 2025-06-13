import { render, screen, waitFor, within } from "@testing-library/react";
import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getFeed } from "../../src/services/posts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../src/services/posts", () => ({
  getFeed: jest.fn(),
}));

jest.mock("../../src/services/likes", () => ({
  handleLikeRequest: jest.fn(() =>
    Promise.resolve({ liked: true, likesCount: 0 })
  ),
}));

jest.mock("../../src/services/comments", () => ({
  getComments: jest.fn(() => Promise.resolve([])),
  addComment: jest.fn(() => Promise.resolve({})),
}));

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken");
    window.localStorage.setItem("userId", "user123");

    const mockPosts = [
      { _id: "12345", message: "Test Post 1", likes: ["user123"] },
    ];
    getFeed.mockResolvedValue(mockPosts);

    render(<FeedPage />);

    const feed = await screen.findByRole("feed");
    const postText = await within(feed).findByText("Test Post 1");
    expect(postText).toBeInTheDocument();
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
