import { getWishlist } from "../../lib/wishlist";
import WishlistPageClient from "./WishlistPageClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const data = await getWishlist();

  return (
    <WishlistPageClient
      initialItems={data.wishlist ?? []}
      initialTotalItems={data.totalItems ?? 0}
    />
  );
}
