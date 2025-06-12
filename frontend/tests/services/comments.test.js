import { getComments, addComment, deleteComment } from "../../services/comments";


describe("comments service", () => {
  const fakeToken = "test-token";
  const fakePostId = "post123";
  const fakeUserId = "user456";
  const fakeCommentId = "comment789";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getComments", () => {
    it("returns comments when request succeeds", async () => {
      const mockComments = [{ comment: "Nice post!" }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: mockComments }),
      });

      const result = await getComments(fakePostId, fakeToken);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/posts/${fakePostId}/comments`),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${fakeToken}` },
        })
      );
      expect(result).toEqual(mockComments);
    });

    it("throws an error when request fails", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(getComments(fakePostId, fakeToken)).rejects.toThrow("Failed to fetch comments");
    });
  });

  describe("addComment", () => {
    it("posts a comment successfully", async () => {
      const mockResponse = { comment: "Added comment" };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addComment(fakePostId, "Hello!", fakeToken, fakeUserId);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/posts/${fakePostId}/comments`),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fakeToken}`,
          },
          body: JSON.stringify({ comment: "Hello!", userId: fakeUserId }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws an error if posting fails", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(addComment(fakePostId, "Oops", fakeToken, fakeUserId)).rejects.toThrow("Failed to add comment");
    });
  });

  describe("deleteComment", () => {
    it("deletes a comment successfully", async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await deleteComment(fakePostId, fakeCommentId, fakeToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${fakePostId}/comments/${fakeCommentId}`),
        expect.objectContaining({
          method: "DELETE",
          headers: { Authorization: `Bearer ${fakeToken}` },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws an error if deletion fails", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(deleteComment(fakePostId, fakeCommentId, fakeToken)).rejects.toThrow("Failed to delete comment");
    });
  });
});
