"use client";

import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

export default function Logout() {
  const [, setAuthUser] = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. First clear your custom auth state
      setAuthUser(undefined);
      
      // 2. Clear local storage
      localStorage.removeItem("Users");
      
      // 3. Clear all cookies (as an extra precaution)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      
      // 4. Log the logout attempt
      console.log("Logging out user...");
      
      // 5. Use NextAuth signOut with specific options
      await signOut({
        callbackUrl: "/signin?signout=true", // Add a flag to show success message
        redirect: true,
      });
      
      // The code below won't normally execute due to the redirect
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      
      // If NextAuth signOut fails, ensure we still clean up and redirect
      toast.error("Logout had an issue. Redirecting you to sign in...");
      router.push("/signin");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}