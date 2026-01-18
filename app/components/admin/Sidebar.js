"use client";

import { motion } from "framer-motion";
import { Boxes, LayoutGrid, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/admin", icon: LayoutGrid },
  { name: "Categories", href: "/admin/categories", icon: Boxes },
  { name: "Products", href: "/admin/products", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: 80 }}
      whileHover={{ width: 260 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
      }}
      className="fixed inset-y-0 left-0 z-40 bg-white border-r hidden lg:flex flex-col"
    >
      <div className="h-16 flex items-center px-4 font-semibold">
        Admin
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {nav.map((item, i) => {
          const active = pathname.startsWith(item.href);

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  transition-colors
                  ${
                    active
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <item.icon size={18} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
