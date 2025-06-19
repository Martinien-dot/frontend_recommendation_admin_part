"use client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-950">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
