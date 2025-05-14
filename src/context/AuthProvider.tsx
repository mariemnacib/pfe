"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export const AuthContext = createContext<[any, React.Dispatch<React.SetStateAction<any>>] | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { data: session } = useSession();
  const [authUser, setAuthUser] = useState<any>(undefined);

  useEffect(() => {
    if (session && session.user) {
      setAuthUser(session.user);
      localStorage.setItem("Users", JSON.stringify(session.user));
    } else {
      setAuthUser(undefined);
      localStorage.removeItem("Users");
    }
  }, [session]);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
