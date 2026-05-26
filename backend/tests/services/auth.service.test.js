jest.mock("../../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock("../../config/auth", () => ({
  issuer: {
    issueTokenPair: jest.fn(),
  },
}));

const User = require("../../models/User");
const { hashPassword, verifyPassword } = require("../../utils/hash");
const { issuer } = require("../../config/auth");
const authService = require("../../modules/auth/auth.service");
const DISTRICTS = require("../../config/districts");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires all fields for registration", async () => {
    await expect(authService.register({ name: "Pat" })).rejects.toMatchObject({
      message: "All fields are required",
      statusCode: 400,
    });
  });

  it("validates district on registration", async () => {
    await expect(
      authService.register({
        name: "Pat",
        email: "pat@example.com",
        password: "secret",
        city: "Invalid",
      })
    ).rejects.toMatchObject({
      message: "Invalid district",
      statusCode: 400,
    });
  });

  it("prevents duplicate registration", async () => {
    User.findOne.mockResolvedValue({ id: "user-1" });

    await expect(
      authService.register({
        name: "Pat",
        email: "pat@example.com",
        password: "secret",
        city: DISTRICTS[0],
      })
    ).rejects.toMatchObject({
      message: "Email already registered",
      statusCode: 409,
    });
  });

  it("registers a new user", async () => {
    const payload = {
      name: "Pat",
      email: "pat@example.com",
      password: "secret",
      city: DISTRICTS[0],
    };
    hashPassword.mockResolvedValue("hashed");
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "user-1",
      name: payload.name,
      email: payload.email,
      city: payload.city,
    });

    const result = await authService.register(payload);

    expect(hashPassword).toHaveBeenCalledWith("secret");
    expect(User.create).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      password: "hashed",
      city: payload.city,
    });
    expect(result).toEqual({
      id: "user-1",
      name: payload.name,
      email: payload.email,
      city: payload.city,
    });
  });

  it("requires email and password on login", async () => {
    await expect(authService.login({ email: "pat@example.com" })).rejects.toMatchObject({
      message: "Email and password are required",
      statusCode: 400,
    });
  });

  it("rejects invalid credentials", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      authService.login({ email: "pat@example.com", password: "secret" })
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
    });
  });

  it("rejects inactive users", async () => {
    User.findOne.mockResolvedValue({ isActive: false });

    await expect(
      authService.login({ email: "pat@example.com", password: "secret" })
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
    });
  });

  it("rejects wrong password", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      isActive: true,
      password: "hashed",
    });
    verifyPassword.mockResolvedValue(false);

    await expect(
      authService.login({ email: "pat@example.com", password: "secret" })
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
    });
  });

  it("returns tokens on successful login", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      isActive: true,
      password: "hashed",
      email: "pat@example.com",
      name: "Pat",
      city: DISTRICTS[0],
      role: "user",
    });
    verifyPassword.mockResolvedValue(true);
    issuer.issueTokenPair.mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
    });

    const result = await authService.login({
      email: "pat@example.com",
      password: "secret",
    });

    expect(issuer.issueTokenPair).toHaveBeenCalled();
    expect(result).toEqual({
      user: {
        id: "user-1",
        name: "Pat",
        email: "pat@example.com",
        city: DISTRICTS[0],
        role: "user",
      },
      accessToken: "access",
      refreshToken: "refresh",
    });
  });
});
