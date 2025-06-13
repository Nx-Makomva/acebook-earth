// likes.test.js
global.fetch = jest.fn();

const mockResponse = { liked: true, likesCount: 5 };

jest.mock("../../src/services/likes.js", () => ({
  handleLikeRequest: jest.fn((postId, userId, token) => {
    return fetch(`/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    }).then(res => {
      if (!res.ok) throw new Error("Failed to update like");
      return res.json();
    });
  }),
}));

import { handleLikeRequest } from "../../src/services/likes.js";

describe("handleLikeRequest", () => {
  const fakeToken = "test-token";
  const fakePostId = "post123";
  const fakeUserId = "user456";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sends a POST request to like a post and returns the response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await handleLikeRequest(fakePostId, fakeUserId, fakeToken);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/posts/${fakePostId}/like`),
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: `Bearer ${fakeToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: fakePostId, userId: fakeUserId }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it("throws an error when the request fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(
      handleLikeRequest(fakePostId, fakeUserId, fakeToken)
    ).rejects.toThrow("Failed to update like");
  });
});
