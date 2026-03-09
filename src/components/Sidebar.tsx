"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, FolderKanban, Users, LogOut, ClipboardCheck, Megaphone, CalendarClock } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsMobileOpen(false);

    if (!token && pathname !== "/") {
      router.push("/");
    } else if (token && pathname === "/") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menus = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    ...(isLoggedIn
      ? [
          { name: "Users", href: "/users", icon: Users },
          { name: "Attendance", href: "/attendance", icon: ClipboardCheck },
          { name: "Leads", href: "/leads", icon: Megaphone },
          { name: "Schedules", href: "/schedules", icon: CalendarClock },
          { name: "Groups", href: "/groups", icon: Users },
        ]
      : []),
  ];

  if (pathname === "/") return null;

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-white px-6 py-4 border-b sticky top-0 z-50 shadow-sm shrink-0">
        <Link href="/" className="text-xl font-bold tracking-wide text-gray-900">
          TEAMMANAGE
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-lime-100 text-gray-700 active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-screen z-50
          bg-white border-r border-gray-200 shadow-sm
          flex flex-col shrink-0
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[80px]" : "md:w-[260px]"}
          w-[260px]
        `}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-gray-200 px-4 py-5 min-h-[73px] ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/" className="text-xl font-bold tracking-wide text-gray-900">
              TEAMMANAGE
            </Link>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-lime-100 text-gray-600 hidden md:flex items-center justify-center transition-all hover:text-lime-700 active:scale-95 shrink-0"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-lime-100 text-gray-600 md:hidden absolute right-3 top-5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {menus.map((menu) => {
            const active = pathname === menu.href;
            const Icon = menu.icon;

            return (
              <Link
                key={menu.name}
                href={menu.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${active
                    ? "bg-lime-500 text-white shadow-md shadow-lime-500/25"
                    : "text-gray-600 hover:bg-lime-100 hover:text-lime-700"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? menu.name : ""}
              >
                <Icon
                  size={22}
                  className={`shrink-0 transition-colors duration-200 ${
                    active ? "text-white" : "text-gray-400 group-hover:text-lime-600"
                  }`}
                />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap tracking-wide text-[15px]">
                    {menu.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {isLoggedIn && (
          <div className="p-3 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 px-3 py-3 w-full rounded-xl
                transition-all duration-200 group
                text-red-500 hover:bg-red-50 hover:text-red-600
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? "Logout" : ""}
            >
              <LogOut size={22} className="group-hover:scale-110 transition-transform shrink-0" />
              {!collapsed && (
                <span className="font-medium whitespace-nowrap tracking-wide text-[15px]">Logout</span>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
