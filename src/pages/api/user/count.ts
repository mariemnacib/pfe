import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const count = await User.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
