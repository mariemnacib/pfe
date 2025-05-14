import dbConnect from "src/lib/mongodb";
import User from "src/models/User";
import bcrypt from "bcrypt";

async function createSuperAdminUser() {
  try {
    await dbConnect();

    const email = "superadmin@example.com";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Superadmin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("superadminpassword", 10);

    const superAdminUser = new User({
      firstName: "Super",
      lastName: "Admin",
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    await superAdminUser.save();
    console.log("Superadmin user created successfully");
  } catch (error) {
    console.error("Error creating superadmin user:", error);
  }
}

createSuperAdminUser();
