"use client";

import { useWishlist } from "@/hooks/useWishlist";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarHeart() {
  const { count } = useWishlist();
  const [liveCount, setLiveCount] = useState(count);

  useEffect(() => {
    setLiveCount(count);
  }, [count]);

  useEffect(() => {
    const onWishlistCountChanged = (event) => {
      const next = event?.detail?.count;
      if (typeof next === "number") setLiveCount(next);
    };

    window.addEventListener("wishlist-count-changed", onWishlistCountChanged);
    return () => {
      window.removeEventListener("wishlist-count-changed", onWishlistCountChanged);
    };
  }, []);

  return (
    <Link href="/wishlist">
      <IconButton className="p-0 relative">
        <Badge
          badgeContent={liveCount}
          color="error"
          overlap="circular"
          sx={{ "& .MuiBadge-badge": { minWidth: 18, height: 18 } }}
        >
          <FavoriteBorderIcon />
        </Badge>
      </IconButton>
    </Link>
  );
}



 