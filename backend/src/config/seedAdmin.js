const User = require("../models/User");

async function ensureDefaultAdmin() {
  const email = "admin@campus.edu";
  const password = "Admin@123";

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    return existingAdmin;
  }

  const admin = await User.create({
    name: "Campus Admin",
    email,
    password,
    role: "admin",
  });

  console.log(`Default admin created: ${email} / ${password}`);
  return admin;
}

module.exports = ensureDefaultAdmin;
