jest.mock("../../src/services/users", () => ({
  searchUsers: jest.fn(),
  getById: jest.fn(),
  updateById: jest.fn(),
}));

import { searchUsers, getById, updateById } from "../../src/services/users";

describe("users service", () => {
  const fakeToken = "test-token";
  const fakeUserId = "user123";

  beforeEach(() => {
    localStorage.setItem("token", fakeToken);
    jest.resetAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("searchUsers", () => {
    it("returns data when the request is successful", async () => {
      const mockResponse = [{ name: "Alice" }];
      searchUsers.mockResolvedValue(mockResponse);

      const result = await searchUsers("alice");
      expect(searchUsers).toHaveBeenCalledWith("alice");
      expect(result).toEqual(mockResponse);
    });

    it("throws an error when the request fails", async () => {
      searchUsers.mockRejectedValue(new Error("Unable to fetch users"));

      await expect(searchUsers("fail")).rejects.toThrow("Unable to fetch users");
    });
  });

  describe("getById", () => {
    it("returns user data when the response is 200", async () => {
      const mockData = { user: { name: "Bob" } };
      getById.mockResolvedValue(mockData);

      const result = await getById(fakeUserId);
      expect(result).toEqual(mockData);
    });

    it("throws an error for non-200 response", async () => {
      getById.mockRejectedValue(new Error("Error 404: Unable to find user"));

      await expect(getById(fakeUserId)).rejects.toThrow("Error 404: Unable to find user");
    });
  });

  describe("updateById", () => {
    it("updates user and returns updated data", async () => {
      const updatePayload = { name: "Updated Name" };
      const mockResponse = { updatedUser: { name: "Updated Name" } };

      updateById.mockResolvedValue(mockResponse);

      const result = await updateById(fakeUserId, updatePayload, fakeToken);
      expect(result).toEqual(mockResponse);
    });

    it("throws an error with message from response", async () => {
      updateById.mockRejectedValue(new Error("Update failed"));

      await expect(updateById(fakeUserId, {}, fakeToken)).rejects.toThrow("Update failed");
    });

    it("throws a default error if no message is returned", async () => {
      updateById.mockRejectedValue(new Error("Update Failed"));

      await expect(updateById(fakeUserId, {}, fakeToken)).rejects.toThrow("Update Failed");
    });
  });
});
