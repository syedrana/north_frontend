"use client";

import { useWishlist } from "@/hooks/useWishlist";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";

export default function NavbarHeart() {
  const { count } = useWishlist();

  return (
    <Link href="/wishlist">
      <IconButton className="p-0 relative">
        <Badge
          badgeContent={count}
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