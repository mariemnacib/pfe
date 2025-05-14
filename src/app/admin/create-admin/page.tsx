"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CreateAdminUserForm from "src/components/admin/CreateAdminUserForm";

export default function CreateAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect authenticated users away from create-admin page
      const role = (session.user as any).role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSuccess = () => {
    // Redirect to signin page after successful admin creation
    router.push("/signin");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    // While redirecting, optionally show nothing or a message
    return null;
  }

  // Show create admin form only if unauthenticated
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Admin User</h1>
      <CreateAdminUserForm onSuccess={handleSuccess} />
    </div>
  );
}
