import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb";
import Group from "../../../../models/Group";
import User from "../../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const groups = await Group.find()
        .populate("admin", "firstName lastName email role")
        .populate("users", "firstName lastName email role");
      
      return res.status(200).json({ groups });
    } 
    
    if (req.method === "POST") {
      const { groupName, adminId, userIds } = req.body;

      if (!groupName || !adminId) {
        return res.status(400).json({ message: "Group name and admin ID are required" });
      }

      // Check if admin exists and is an admin or superadmin
      const adminUser = await User.findById(adminId);
      if (!adminUser) {
        return res.status(400).json({ message: "Admin user not found" });
      }
      
      if (adminUser.role !== "admin" && adminUser.role !== "superadmin") {
        return res.status(400).json({ message: "Selected user must be an admin or superadmin" });
      }

      // Create and save the group
      const group = new Group({
        groupName,
        admin: adminId,
        users: userIds || [],
      });

      await group.save();

      // Fetch the populated group for the response
      const populatedGroup = await Group.findById(group._id)
        .populate("admin", "firstName lastName email role")
        .populate("users", "firstName lastName email role");

      return res.status(201).json({ group: populatedGroup });
    }

    // If we reach here, the method is not supported
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("Groups API error:", error);
    return res.status(500).json({ 
      message: "Server error processing group request", 
      error: error.message 
    });
  }
}