import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "src/lib/mongodb";
import User from "src/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === "DELETE") {
    try {
      await dbConnect();
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  } else if (method === "PUT") {
    try {
      await dbConnect();
      const { firstName, lastName, email, role } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, email, role },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
