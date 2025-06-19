"use client";

import Link from "next/link";
import { Film, Star, BarChart2, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const links = [
  { href: "/dashboard", label: "Statistiques", icon: BarChart2 },
  { href: "/dashboard/movies", label: "Films", icon: Film },
  { href: "/dashboard/reviews", label: "Avis", icon: Star },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
      className={`h-screen border-r bg-gray-50 dark:bg-gray-900 p-2 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
      aria-label="Barre latérale de navigation"
    >
      <div className="flex justify-end mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggle}
              aria-label={collapsed ? "Ouvrir la barre latérale" : "Fermer la barre latérale"}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-transform duration-300"
              style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
              tabIndex={0}
            >
              <Menu className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{collapsed ? "Ouvrir" : "Fermer"}</TooltipContent>
        </Tooltip>
      </div>
      <nav className="flex flex-col gap-1" role="menu">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 dark:text-gray-300 dark:hover:bg-indigo-800 dark:hover:text-indigo-200"
                }
              `}
              aria-current={isActive ? "page" : undefined}
              role="menuitem"
              tabIndex={0}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
