import api from "@/lib/apiServer";

export const fetchWishlistIds = async () => {
  try {
    const { data } = await api.get("/wishlist");
    const wishlist = Array.isArray(data?.wishlist) ? data.wishlist : [];

    return wishlist.map((item) => item?._id).filter(Boolean);
  } catch (err) {
    console.error("Wishlist list error:", err);
    return [];
  }
};

export const fetchWishlistCount = async () => {
  try {
    const { data } = await api.get("/wishlist/count");
    return data?.count ?? 0;
  } catch (err) {
    console.error("Wishlist count error:", err);
    return 0;
  }
};

export const toggleWishlist = async (productId) => {
  try {
    const { data } = await api.post("/wishlist/toggle", { productId });
    return data;
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    throw err;
  }
};
