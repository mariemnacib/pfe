"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn as nextAuthSignIn, useSession } from "next-auth/react";

export default function SignInForm() {
  const [, setAuthUser] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard"); // Or wherever you want to redirect authenticated users
    }
  }, [session, status, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      // Using NextAuth's signIn method directly with credentials
      const result = await nextAuthSignIn("credentials", {
        redirect: false, // Don't redirect automatically
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error || "Invalid email or password");
        return;
      }
      
      if (result?.ok) {
        // Get the session after successful sign-in
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();
        
        // Set your custom auth state (for backward compatibility)
        if (sessionData?.user) {
          setAuthUser(sessionData.user);
          localStorage.setItem("Users", JSON.stringify(sessionData.user));
        }
        
        toast.success("Sign in successful!");
        router.push("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-64">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 border rounded"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}