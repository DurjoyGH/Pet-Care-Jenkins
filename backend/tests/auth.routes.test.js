const request = require("supertest");
const app = require("../app");
const authService = require("../modules/auth/auth.service");

jest.mock("../modules/auth/auth.service", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe("Auth routes", () => {
  it("registers a user", async () => {
    const payload = { name: "Pat", email: "pat@example.com" };
    const created = { id: "user-1", ...payload };
    authService.register.mockResolvedValue(created);

    const res = await request(app).post("/api/v1/auth/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true, data: created });
    expect(authService.register).toHaveBeenCalledWith(payload);
  });

  it("logs in a user", async () => {
    const payload = { email: "pat@example.com", password: "secret" };
    const result = { accessToken: "token" };
    authService.login.mockResolvedValue(result);

    const res = await request(app).post("/api/v1/auth/login").send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: result });
    expect(authService.login).toHaveBeenCalledWith(payload);
  });

  it("refreshes a token", async () => {
    const res = await request(app).post("/api/v1/auth/refresh").send({
      refreshToken: "refresh",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { accessToken: "mock-access", refreshToken: "mock-refresh" },
    });
  });
});
