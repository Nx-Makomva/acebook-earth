import { searchUsers, getById, updateById } from "../../services/users";


describe("users service", () => {
  const fakeToken = "test-token";
  const fakeUserId = "user123";

  beforeEach(() => {
    localStorage.setItem("token", fakeToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("searchUsers", () => {
    it("returns data when the request is successful", async () => {
      const mockResponse = [{ name: "Alice" }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchUsers("alice");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/search?q=alice"),
        expect.objectContaining({
          method: "GET",
          headers: {
            Authorization: `Bearer ${fakeToken}`,
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws an error when the request fails", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(searchUsers("fail")).rejects.toThrow("Unable to fetch users");
    });
  });

  describe("getById", () => {
    it("returns user data when the response is 200", async () => {
      const mockData = { user: { name: "Bob" } };

      fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockData,
      });

      const result = await getById(fakeUserId);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/users/${fakeUserId}`));
      expect(result).toEqual(mockData);
    });

    it("throws an error for non-200 response", async () => {
      fetch.mockResolvedValueOnce({ status: 404 });

      await expect(getById(fakeUserId)).rejects.toThrow("Error 404: Unable to find user");
    });
  });

  describe("updateById", () => {
    it("updates user and returns updated data", async () => {
      const updatePayload = { name: "Updated Name" };
      const mockResponse = { updatedUser: { name: "Updated Name" } };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateById(fakeUserId, updatePayload, fakeToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/users/${fakeUserId}`),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fakeToken}`,
          },
          body: JSON.stringify(updatePayload),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("throws an error with message from response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Update failed" }),
      });

      await expect(updateById(fakeUserId, {}, fakeToken)).rejects.toThrow("Update failed");
    });

    it("throws a default error if no message is returned", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(updateById(fakeUserId, {}, fakeToken)).rejects.toThrow("Update Failed");
    });
  });
});
