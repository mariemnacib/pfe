const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require(path.join(__dirname, "../src/models/User")).default;
const dbConnect = require(path.join(__dirname, "../src/lib/mongodb")).default;

async function createAdminUser() {
  try {
    await dbConnect();

    const email = "admin@example.com";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
