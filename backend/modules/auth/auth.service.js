const User = require("../../models/User");
const { hashPassword, verifyPassword } = require("../../utils/hash");
const { issuer } = require("../../config/auth");
const DISTRICTS = require("../../config/districts");

const register = async ({ name, email, password, city }) => {
  if (!name || !email || !password || !city) {
    const err = new Error("All fields are required");
    err.statusCode = 400;
    throw err;
  }

  if (!DISTRICTS.includes(city)) {
    const err = new Error("Invalid district");
    err.statusCode = 400;
    throw err;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, city });

  return { id: user._id, name: user.name, email: user.email, city: user.city };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const valid = await verifyPassword(user.password, password);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // Using @smart-auth/express issuer to create JWT token pair
  const tokens = issuer.issueTokenPair({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    roles: [user.role],
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      role: user.role,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

module.exports = { register, login };
