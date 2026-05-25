const argon2 = require("argon2");

const hashPassword = (password) => argon2.hash(password);
const verifyPassword = (hash, password) => argon2.verify(hash, password);

module.exports = { hashPassword, verifyPassword };
