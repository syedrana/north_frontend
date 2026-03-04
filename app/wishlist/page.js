import WishlistPageClient from "@/components/wishlist/WishlistPageClient";
import { getWishlist } from "@/lib/api/wishlist";

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
