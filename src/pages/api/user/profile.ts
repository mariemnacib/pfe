import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "src/lib/mongodb";
import User from "src/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
      const user = await User.findOne({ email }, "-password").lean();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  } else if (req.method === "PUT") {
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      country,
      cityState,
      postalCode,
      taxId,
      facebook,
      linkedin,
      instagram,
      role,
      location,
    } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const updateData = {
        firstName,
        lastName,
        phone,
        bio,
        country,
        cityState,
        postalCode,
        taxId,
        facebook,
        linkedin,
        instagram,
        role,
        location,
      };

      const user = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true, select: "-password" }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
