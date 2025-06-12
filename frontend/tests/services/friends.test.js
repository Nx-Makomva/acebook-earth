import { addFriend } from "../../services/friends";


describe("addFriend", () => {
  const fakeToken = "test-token";
  const fakeFriendId = "friend123";

  beforeEach(() => {
    localStorage.setItem("token", fakeToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("successfully adds a friend and returns data", async () => {
    const mockUserData = { user: { _id: "me", friends: ["friend123"] } };

    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUserData,
    });

    const result = await addFriend(fakeFriendId);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/users/friends/${fakeFriendId}`),
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: `Bearer ${fakeToken}`,
        },
      })
    );

    expect(result).toEqual(mockUserData);
  });

  it("throws an error if response is not 200", async () => {
    fetch.mockResolvedValueOnce({ status: 400 });

    await expect(addFriend(fakeFriendId)).rejects.toThrow("Failed to add friend");
  });
});
