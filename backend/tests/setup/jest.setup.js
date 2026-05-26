jest.mock("@smart-auth/express", () => ({
  createTokenIssuer: () => ({
    issueAccessToken: () => "mock-access",
    issueRefreshToken: () => "mock-refresh",
  }),
  verifyAccessToken: () => (req, _res, next) => {
    req.auth = { userId: "user-1", roles: ["admin"] };
    next();
  },
  authorize: () => (_req, _res, next) => next(),
  createRefreshHandler: () => ({
    middleware: (_req, res) =>
      res.json({
        success: true,
        data: { accessToken: "mock-access", refreshToken: "mock-refresh" },
      }),
  }),
}));
