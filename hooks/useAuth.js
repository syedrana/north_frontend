"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
    isPublicRoute,
    isTokenValid,
    logout,
    setupAutoLogout,
} from "../utils/auth";

export const useAuth = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 🔥 PUBLIC PAGE → auth guard OFF
    if (isPublicRoute(pathname)) return;

    // 🔒 PROTECTED PAGE
    if (!isTokenValid()) {
      logout();
    } else {
      setupAutoLogout();
    }
  }, [pathname]);
};
