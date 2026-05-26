jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

const argon2 = require("argon2");
const { hashPassword, verifyPassword } = require("../../utils/hash");

describe("hash utils", () => {
  it("hashes passwords", async () => {
    argon2.hash.mockResolvedValue("hashed");

    const result = await hashPassword("secret");

    expect(argon2.hash).toHaveBeenCalledWith("secret");
    expect(result).toBe("hashed");
  });

  it("verifies passwords", async () => {
    argon2.verify.mockResolvedValue(true);

    const result = await verifyPassword("hashed", "secret");

    expect(argon2.verify).toHaveBeenCalledWith("hashed", "secret");
    expect(result).toBe(true);
  });
});
