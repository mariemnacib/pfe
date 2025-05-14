import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method " + req.method + " Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  try {
    await dbConnect();

    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(trimmedPassword, user.password))) {
      const userObj = user.toObject();
      delete (userObj as { password?: string }).password;
      return res.status(200).json({ user: userObj });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
