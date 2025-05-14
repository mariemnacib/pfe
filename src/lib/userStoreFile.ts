import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "users.json");

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  name: string;
  image: string;
}

export function readUsers(): User[] {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

export function writeUsers(users: User[]) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users file:", error);
  }
}
