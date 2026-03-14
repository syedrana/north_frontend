import { cookies } from "next/headers";
import { getWishlist } from "../../lib/wishlist";
import WishlistPageClient from "./WishlistPageClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <WishlistPageClient initialItems={[]} initialTotalItems={0} />;
  }

  let data = { wishlist: [], totalItems: 0 };

  try {
    data = await getWishlist();
  } catch (error) {
    console.error("Failed to load wishlist:", error);
  }

  return (
    <WishlistPageClient
      initialItems={data.wishlist ?? []}
      initialTotalItems={data.totalItems ?? 0}
    />
  );
}
