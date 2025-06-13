
jest.mock("../../src/services/comments", () => ({
  getComments: jest.fn(),
  addComment: jest.fn(),
  deleteComment: jest.fn(),
}));

import { getComments, addComment, deleteComment } from "../../src/services/comments";

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
      getComments.mockResolvedValue(mockComments); 

      const result = await getComments(fakePostId, fakeToken);
      expect(result).toEqual(mockComments);
      expect(getComments).toHaveBeenCalledWith(fakePostId, fakeToken);
    });

    it("throws an error when request fails", async () => {
      getComments.mockRejectedValue(new Error("Failed to fetch comments"));

      await expect(getComments(fakePostId, fakeToken)).rejects.toThrow("Failed to fetch comments");
    });
  });

  describe("addComment", () => {
    it("posts a comment successfully", async () => {
      const mockResponse = { comment: "Added comment" };
      addComment.mockResolvedValue(mockResponse);

      const result = await addComment(fakePostId, "Hello!", fakeToken, fakeUserId);
      expect(result).toEqual(mockResponse);
      expect(addComment).toHaveBeenCalledWith(fakePostId, "Hello!", fakeToken, fakeUserId);
    });

    it("throws an error if posting fails", async () => {
      addComment.mockRejectedValue(new Error("Failed to add comment"));

      await expect(addComment(fakePostId, "Oops", fakeToken, fakeUserId)).rejects.toThrow("Failed to add comment");
    });
  });

  describe("deleteComment", () => {
    it("deletes a comment successfully", async () => {
      const mockResponse = { success: true };
      deleteComment.mockResolvedValue(mockResponse);

      const result = await deleteComment(fakePostId, fakeCommentId, fakeToken);
      expect(result).toEqual(mockResponse);
      expect(deleteComment).toHaveBeenCalledWith(fakePostId, fakeCommentId, fakeToken);
    });

    it("throws an error if deletion fails", async () => {
      deleteComment.mockRejectedValue(new Error("Failed to delete comment"));

      await expect(deleteComment(fakePostId, fakeCommentId, fakeToken)).rejects.toThrow("Failed to delete comment");
    });
  });
});
