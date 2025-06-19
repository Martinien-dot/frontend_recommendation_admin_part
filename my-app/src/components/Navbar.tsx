"use client";

import { LogOut, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-950">
      <div className="flex items-center gap-2">
        <BarChart2 className="h-6 w-6 text-indigo-600" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
          aria-label="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </header>
  );
}
