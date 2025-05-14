import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "src/lib/mongodb";
import User from "src/models/User";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    return res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
