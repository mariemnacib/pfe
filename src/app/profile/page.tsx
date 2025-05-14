"use client";

import React from "react";
import UserAddressCard from "../../components/user-profile/UserAddressCard";
import UserInfoCard from "../../components/user-profile/UserInfoCard";
import UserMetaCard from "../../components/user-profile/UserMetaCard";
import AppHeader from "../../layout/AppHeader";
import AppSidebar from "../../layout/AppSidebar";

export default function ProfilePage() {
  return (
    <>
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 max-w-4xl mx-auto p-6 space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </main>
      </div>
    </>
  );
}
