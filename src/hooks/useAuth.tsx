"use client";

import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthHook(roleRequired: "admin" | "user") {
  const [authUser] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/signin");
    } else {
      const userRole = authUser.role || "user";
      if (roleRequired === "admin" && userRole !== "admin") {
        router.push("/signin");
      }
      if (roleRequired === "user" && userRole !== "user" && userRole !== "admin") {
        router.push("/signin");
      }
    }
  }, [authUser, router, roleRequired]);

  return { authUser };
}
