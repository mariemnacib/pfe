"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

export default function HomePage() {
  const [authUser] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      if (authUser.role === "admin" || authUser.role === "superadmin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    } else {
      router.replace("/signin");
    }
  }, [authUser, router]);

  return null;
}
