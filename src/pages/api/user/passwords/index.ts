import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb";
import PasswordEntry from "../../../../models/PasswordEntry";
import User from "../../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.AES_SECRET_KEY || "default_secret_key", "salt", 32);

// Encryption function
function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  console.log("Session in API Route:", session); // Log session data

  if (!session || !session.user?.email) {
    console.log("Unauthorized access attempt:", session);
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = user._id;
    return handlePasswordManagerRequests(req, res, userId);
  } catch (error) {
    console.error("Error in password entries handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePasswordManagerRequests(req: NextApiRequest, res: NextApiResponse, userId: any) {
  switch (req.method) {
    case "GET":
      try {
        const entries = await PasswordEntry.find({ userId });
        return res.status(200).json(entries);
      } catch (error) {
        console.error("Error fetching password entries:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

    case "POST":
      try {
        const { title, username, password, url, notes } = req.body;
        if (!title || !username || !password) {
          return res.status(400).json({ message: "Title, username, and password are required" });
        }

        const encryptedPassword = encrypt(password);
        const newEntry = new PasswordEntry({
          userId,
          title,
          username,
          password: encryptedPassword,
          url,
          notes,
        });

        await newEntry.save();
        return res.status(201).json(newEntry);
      } catch (error) {
        console.error("Error creating password entry:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

    // Handle PUT and DELETE as needed...

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}