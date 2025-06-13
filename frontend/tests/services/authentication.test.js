
jest.mock("../../src/services/authentication", () => ({
  login: jest.fn(),
  signup: jest.fn(),
}));


let login, signup;

describe("authentication service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    
    ({ login, signup } = require("../../src/services/authentication"));
  });

  describe("login", () => {
    test("calls login with correct arguments", async () => {
      login.mockResolvedValue("testToken");

      const email = "test@testEmail.com";
      const password = "12345678";

      const token = await login(email, password);

      expect(login).toHaveBeenCalledWith(email, password);
      expect(token).toBe("testToken");
    });

    test("throws an error if login fails", async () => {
      login.mockRejectedValue(new Error("Login failed"));

      try {
        await login("wrong@email.com", "wrongpass");
      } catch (err) {
        expect(err.message).toBe("Login failed");
      }
    });
  });

  describe("signup", () => {
    test("calls signup with correct arguments", async () => {
      signup.mockResolvedValue(undefined);

      const email = "test@testEmail.com";
      const password = "12345678";

      await signup(email, password);

      expect(signup).toHaveBeenCalledWith(email, password);
    });

    test("throws an error if signup fails", async () => {
      signup.mockRejectedValue(new Error("Signup failed"));

      try {
        await signup("test@testEmail.com", "12345678");
      } catch (err) {
        expect(err.message).toBe("Signup failed");
      }
    });
  });
});
