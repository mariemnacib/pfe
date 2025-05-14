import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import PasswordManagerAccessRequest from "../../../models/PasswordManagerAccessRequest";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(403).json({ message: "Forbidden" });
    }

    switch (req.method) {
      case "GET":
        // List all pending access requests with user info
        const requests = await PasswordManagerAccessRequest.find({ status: "pending" }).populate("userId", "firstName lastName email");
        return res.status(200).json(requests);

      case "POST":
        // Approve or reject an access request
        const { requestId, approve } = req.body;
        if (!requestId || typeof approve !== "boolean") {
          return res.status(400).json({ message: "requestId and approve(boolean) are required" });
        }

        const accessRequest = await PasswordManagerAccessRequest.findById(requestId);
        if (!accessRequest) {
          return res.status(404).json({ message: "Access request not found" });
        }

        accessRequest.status = approve ? "approved" : "rejected";
        accessRequest.approvedBy = user._id as mongoose.Types.ObjectId;
        accessRequest.approvedAt = new Date();
        await accessRequest.save();

        return res.status(200).json({ message: `Access request ${approve ? "approved" : "rejected"}` });


      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error in password manager access requests handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
