import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb";
import Group from "../../../../models/Group";
import User from "../../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  // Check if user is authenticated and is a superadmin
  if (!session || session.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Superadmins only." });
  }

  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const group = await Group.findById(id)
        .populate("admin", "firstName lastName email role")
        .populate("users", "firstName lastName email role");
        
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group" });
    }
  } else if (req.method === "PUT") {
    try {
      const { groupName, adminId, userIds } = req.body;

      if (!groupName || !adminId) {
        return res.status(400).json({ message: "Group name and admin ID are required" });
      }

      // Check if admin exists and is an admin or superadmin
      const adminUser = await User.findById(adminId);
      if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
        return res.status(400).json({ message: "Invalid admin user" });
      }

      const group = await Group.findByIdAndUpdate(
        id,
        { groupName, admin: adminId, users: userIds || [] },
        { new: true }
      ).populate("admin", "firstName lastName email role")
        .populate("users", "firstName lastName email role");

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ message: "Failed to update group" });
    }
  } else if (req.method === "DELETE") {
    try {
      const group = await Group.findByIdAndDelete(id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete group" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}