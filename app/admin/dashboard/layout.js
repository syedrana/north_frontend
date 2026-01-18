'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, ReceiptText, Sun, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [admin, setAdmin] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  // Menu Items
  const menuItems = useMemo(() => [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    
    { 
      name: 'Product Management', 
      icon: ReceiptText,
      children: [
        { name: 'Add Category', href: "/admin/dashboard/category" },
        { name: 'Product List', href: "/admin/dashboard/products/list" },
        { name: 'Product Variant', href: "/admin/dashboard/products/variant" },
      ]
    },
    
  ], []);

  // Auto-expand parent if child is active
  useEffect(() => {
    const newOpenMenus = {};
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (pathname.startsWith(child.href)) {
            newOpenMenus[item.name] = true;
          }
        });
      }
    });
    // ✅ Use requestAnimationFrame to avoid "cascading render" warning
    requestAnimationFrame(() => setOpenMenus(newOpenMenus));
  }, [menuItems, pathname]);

  // Fetch admin profile
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/admin");
//       return;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       requestAnimationFrame(() => setAdmin(decoded));
//     } catch {
//       localStorage.removeItem("token");
//       router.push("/admin");
//     }
//   }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  }

  const isActive = (href) => pathname === href;

  return (
    <div className={clsx('flex h-screen', darkMode ? 'dark' : '')}>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 shadow-lg md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
                <span className="text-xl font-bold">Haat Seba</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User */}
              {admin && (
                <div className="flex flex-col items-center py-6 border-b border-gray-700">
                  {admin.image ? (
                    <Image
                      src={admin.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full mb-2"
                      unoptimized
                    />
                  ) : <User className="w-16 h-16 text-gray-400 mb-2" />}
                  <span className="font-semibold">{admin.name}</span>
                  <span className="text-sm text-gray-400">{admin.email}</span>
                </div>
              )}

              {/* Menu */}
              <nav className="mt-6 flex flex-col gap-1">
                {menuItems.map(item => (
                  <div key={item.name} className="flex flex-col">
                    {item.children ? (
                      <>
                        <button 
                          onClick={() => toggleMenu(item.name)}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between',
                            openMenus[item.name] && 'bg-gray-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
                        </button>
                        <AnimatePresence>
                          {openMenus[item.name] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col pl-10 bg-gray-700"
                            >
                              {item.children.map(child => (
                                <Link 
                                  key={child.name} 
                                  href={child.href} 
                                  className={clsx(
                                    'py-2 hover:bg-gray-600 rounded px-2',
                                    isActive(child.href) && 'bg-blue-600 font-semibold'
                                  )}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={item.href} className={clsx(
                        'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded',
                        isActive(item.href) && 'bg-blue-600 font-semibold'
                      )}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Logout */}
              <div className="mt-6 px-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-600 bg-red-500 text-white"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: sidebarHover ? 256 : 80 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="hidden md:flex flex-col bg-gray-800 text-white border-r border-gray-700 relative"
      >
        {/* Top Section */}
        <div className="flex flex-col items-center border-b border-gray-700 px-4 py-6">
          <motion.div className="flex items-center gap-2 mb-4 cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            {sidebarHover && <motion.span className="text-lg font-bold">Haat Seba</motion.span>}
          </motion.div>

          {admin && (
            <div className="relative group w-full flex flex-col items-center">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 120 }} className="mb-2 cursor-pointer">
                {admin.image ? (
                  <Image src={admin.image} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full" />
                ) : <User className="w-10 h-10 text-gray-500" />}
              </motion.div>
              {sidebarHover && (
                <motion.div className="text-center">
                  <span className="block text-white font-medium">{admin.name}</span>
                  <span className="block text-gray-300 text-sm">{admin.email}</span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="mt-6 flex-1 flex flex-col gap-1">
          {menuItems.map(item => (
            <div key={item.name} className="relative group">
              {item.children ? (
                <>
                  <button onClick={() => toggleMenu(item.name)} className={clsx('flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between', openMenus[item.name] && 'bg-gray-700')}>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarHover && <motion.span>{item.name}</motion.span>}
                    </div>
                    <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {openMenus[item.name] && sidebarHover && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col pl-10 bg-gray-700">
                        {item.children.map(child => (
                          <Link key={child.name} href={child.href} className={clsx('py-2 hover:bg-gray-600 rounded px-2', isActive(child.href) && 'bg-blue-600 font-semibold')}>
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href={item.href} className={clsx('flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded', isActive(item.href) && 'bg-blue-600 font-semibold')}>
                  <item.icon className="w-5 h-5" />
                  {sidebarHover && <motion.span>{item.name}</motion.span>}
                </Link>
              )}
            </div>
          ))}

          {/* Logout */}
          <div className="mt-auto px-4 py-2">
            <motion.button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-600 text-white bg-red-500">
              <LogOut className="w-5 h-5" />
              {sidebarHover && <motion.span className="flex-1 font-medium">Logout</motion.span>}
            </motion.button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {children && React.cloneElement(children, { darkMode })}
        </main>
      </div>
    </div>
  );
}
