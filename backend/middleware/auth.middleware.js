/**
 * Auth middleware using @smart-auth/express
 *
 * This is the primary showcase of the published SDK.
 * verifyAccessToken() handles all JWT verification, expiry checks,
 * and attaches decoded user data to req.auth automatically.
 */
const { verifyAccessToken } = require("@smart-auth/express");

const authenticate = verifyAccessToken({
  secret: process.env.JWT_ACCESS_SECRET,
});

module.exports = authenticate;
