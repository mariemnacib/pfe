"use client";

import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../context/SidebarContext";
import AuthProvider from "../context/AuthProvider";
import { SessionProvider } from "next-auth/react";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
};

export default Providers;
