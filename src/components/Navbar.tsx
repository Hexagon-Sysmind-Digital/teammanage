"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const menus = [
    { name: "Dashboard", href: "/" },
    { name: "Projects", href: "/projects" },
    ...(isLoggedIn ? [{ name: "Groups", href: "/groups" }] : []),
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur border-b shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-4">

          {/* TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-black hover:scale-105 active:scale-95"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-gray-900 hover:opacity-80 transition"
          >
            TEAMMANAGE
          </Link>

        </div>

      </div>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="border-t bg-white"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 py-7">

              {menus.map((menu) => {

                const active = pathname === menu.href;

                return (
                  <Link
                    key={menu.name}
                    href={menu.href}
                    onClick={() => setOpen(false)}
                    className="relative group text-lg font-medium"
                  >

                    <motion.span
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className={`transition ${
                        active
                          ? "text-black"
                          : "text-gray-600 group-hover:text-black"
                      }`}
                    >
                      {menu.name}
                    </motion.span>

                    {active ? (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute left-0 -bottom-2 h-[2px] w-full bg-lime-500 rounded"
                      />
                    ) : (
                      <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-lime-500 transition-all duration-300 group-hover:w-full"></span>
                    )}

                  </Link>
                );
              })}

              {/* LOGOUT BUTTON */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium hover:text-red-600 transition"
                >
                  Logout
                </button>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}