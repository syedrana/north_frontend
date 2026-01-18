"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTokenValid } from "../utils/auth";

export const useGuest = () => {
  const router = useRouter();

  useEffect(() => {
    if (isTokenValid()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);
};
