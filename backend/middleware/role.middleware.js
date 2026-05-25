/**
 * Role-based authorization middleware using @smart-auth/express
 *
 * authorize() checks if the authenticated user has the required role.
 * It reads roles from req.auth (set by verifyAccessToken middleware).
 */
const { authorize } = require("@smart-auth/express");

const requireAdmin = authorize(["admin"]);

module.exports = { requireAdmin };
