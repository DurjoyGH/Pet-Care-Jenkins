require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const { hashPassword } = require("./utils/hash");

async function seed() {
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to DB");

  const exists = await User.findOne({ email: "admin@blog.com" });
  if (exists) {
    console.log("Admin already exists, skipping seed");
    return process.exit(0);
  }

  const hashed = await hashPassword("admin123");
  await User.create({
    name: "Admin",
    email: "admin@blog.com",
    password: hashed,
    city: "Dhaka",
    role: "admin",
  });

  console.log("✅ Admin user created: admin@blog.com / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
