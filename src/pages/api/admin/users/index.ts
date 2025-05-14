import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "src/lib/mongodb";
import User from "src/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const users = await User.find({}, { password: 0 }).lean();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
