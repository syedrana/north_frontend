"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();        // clear user from context
      queryClient.clear();   // clear all react-query cache
      router.replace("/");   // redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { handleLogout };
};