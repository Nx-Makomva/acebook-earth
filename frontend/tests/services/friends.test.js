
import { addFriend } from "../../src/services/friends";

jest.mock("../../src/services/friends", () => ({
  addFriend: jest.fn(),
}));

describe("addFriend", () => {
  const fakeToken = "test-token";
  const fakeFriendId = "friend123";

  beforeEach(() => {
    localStorage.setItem("token", fakeToken);
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should call addFriend and return mock data", async () => {
    const mockUserData = { user: { _id: "me", friends: ["friend123"] } };
    addFriend.mockResolvedValueOnce(mockUserData);

    const result = await addFriend(fakeFriendId);

    expect(addFriend).toHaveBeenCalledWith(fakeFriendId);
    expect(result).toEqual(mockUserData);
  });

  it("should throw if addFriend fails", async () => {
    addFriend.mockRejectedValueOnce(new Error("Failed to add friend"));

    await expect(addFriend(fakeFriendId)).rejects.toThrow("Failed to add friend");
  });
});
