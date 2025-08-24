"use client";

import React from "react";
import { ThemeProvider } from "../providers/theme-provider";
import { BottomNavigation } from "../bottom-navigation";
import ErrorBoundary from "../error-boundary";
import { UserProvider, useUser } from "@/contexts/user-context";

const InnerShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useUser();

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
          {user && <BottomNavigation currentUser={user} onLogout={logout} />}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UserProvider>
    <InnerShell>{children}</InnerShell>
  </UserProvider>
);

export default Shell;
