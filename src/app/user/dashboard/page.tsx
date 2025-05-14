"use client";

import React from "react";
import { useAuthHook } from "../../../hooks/useAuth";
import AppSidebar from "../../../layout/AppSidebar";
import AppHeader from "../../../layout/AppHeader";

import DemographicCard from "components/keepass/DemographicCard";
import StatisticsChart from "components/keepass/StatisticsChart";
import UserCountCircleChart from "components/keepass/UserCountCircleChart";
import { useSidebar } from "src/context/SidebarContext";
import Backdrop from "src/layout/Backdrop";

interface UserDashboardProps {
  children?: React.ReactNode;
}

export default function UserDashboard({ children }: UserDashboardProps) {
  const { authUser } = useAuthHook("user");
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
      ? "ml-0"
      : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";
  return (
    <>
    
     <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <main className="p-6 min-h-screen">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white/90">
                  Welcome back,
                </h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-white/90">
                  {authUser?.name || authUser?.firstName} {authUser?.lastName}
                </p>
              </div>
              <div className="w-48">
                <UserCountCircleChart />
              </div>
            </div>
            <DemographicCard />
            <StatisticsChart />
            {children}
          </main>
        </div>
      </div>
    </div>
    </>
    
  );
}
