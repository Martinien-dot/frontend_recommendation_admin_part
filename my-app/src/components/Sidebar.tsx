"use client";

import Link from "next/link";
import { Film, Star, BarChart2, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Statistiques", icon: BarChart2 },
  { href: "/movies", label: "Films", icon: Film },
  { href: "/reviews", label: "Avis", icon: Star },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const toggle = () => {
    localStorage.setItem("sidebar-collapsed", String(!collapsed));
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`h-screen border-r bg-gray-50 dark:bg-gray-900 p-2 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <button
        onClick={toggle}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 w-full text-left mb-4"
      >
        <Menu className="h-5 w-5" />
      </button>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
