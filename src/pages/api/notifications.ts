import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

interface Notification {
  id: number;
  user: string;
  message: string;
  project: string;
  timeAgo: string;
  avatar: string;
  status: "success" | "error";
}

// Mock notifications storage (in-memory for demo)
let notifications: Notification[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userRole = session.user.role;

  if (userRole !== "admin" && userRole !== "super admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Return notifications for admin and super admin
  res.status(200).json(notifications);
}

// Helper functions to add notifications (to be called on signup and password save)
export function addNotification(notification: Notification) {
  notifications.unshift(notification);
  // Keep only latest 20 notifications
  if (notifications.length > 20) {
    notifications = notifications.slice(0, 20);
  }
}
