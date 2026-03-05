"use client";

import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function NavbarCart() {
  const { user } = useAuth();
  const [liveCount, setLiveCount] = useState(0);

  const loadCartCount = useCallback(async () => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const totalQty = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      setLiveCount(totalQty);
      return;
    }

    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        setLiveCount(res.data.summary?.itemCount || 0);
      }
    } catch {
      setLiveCount(0);
    }
  }, [user]);

  useEffect(() => {
    queueMicrotask(loadCartCount);
  }, [loadCartCount]);

  useEffect(() => {
    const handler = () => loadCartCount();
    window.addEventListener("cart-changed", handler);
    window.addEventListener("auth-changed", handler);

    return () => {
      window.removeEventListener("cart-changed", handler);
      window.removeEventListener("auth-changed", handler);
    };
  }, [loadCartCount]);

  return (
    <Link href="/cart">
      <IconButton className="p-0 relative">
        <Badge
          badgeContent={liveCount}
          color="primary"
          overlap="circular"
          sx={{ "& .MuiBadge-badge": { minWidth: 18, height: 18 } }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Link>
  );
}
