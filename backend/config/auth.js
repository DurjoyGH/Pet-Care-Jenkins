const { createTokenIssuer, createRefreshHandler } = require("@smart-auth/express");

const issuer = createTokenIssuer({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: "1m",
  refreshTokenExpiry: "5m",
  issuer: "blog-web",
});

module.exports = { issuer };
