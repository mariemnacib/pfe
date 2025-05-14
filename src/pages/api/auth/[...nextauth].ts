import NextAuth, { AuthOptions, User as NextAuthUser, Session as NextAuthSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string;
      role: string;
    };
  }
}

interface IUser extends NextAuthUser {
  id: string;
  role: string;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour session max age
    updateAge: 15 * 60, // 15 minutes session update age
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }) as { 
          _id: string; 
          email: string; 
          firstName: string; 
          lastName: string; 
          role: string; 
          password: string; 
        };

        if (!user) {
          throw new Error("No user found with the email");
        }

        if (!await bcrypt.compare(credentials.password, user.password)) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.firstName + " " + user.lastName,
          role: user.role,
        } as IUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as IUser;
        token.id = u.id;
        token.role = u.role;
        token.email = u.email;  // Add this line to assign email to token
      }
      return token;
    },
    async session({ session, token }) {
      if (!token) {
        console.log("Session callback with NO valid token - should be logged out");
        return session;
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        console.log("Session callback with valid user:", session.user.email);
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: '/api/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);