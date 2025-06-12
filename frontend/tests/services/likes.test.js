import { handleLikeRequest } from "../../services/likes";

describe("handleLikeRequest", () => {
  const fakeToken = "test-token";
  const fakePostId = "post123";
  const fakeUserId = "user456";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sends a POST request to like a post and returns the response", async () => {
    const mockResponseData = { liked: true, likesCount: 5 };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
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

    expect(result).toEqual(mockResponseData);
  });

  it("throws an error when the request fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(handleLikeRequest(fakePostId, fakeUserId, fakeToken)).rejects.toThrow("Failed to update like");
  });
});
