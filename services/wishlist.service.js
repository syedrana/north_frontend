// import api from "@/lib/apiServer";

// export const fetchWishlist = async () => {
//   try {
//     const { data } = await api.get("/wishlist");
//     return data?.products ?? [];
//   } catch (err) {
//     console.error("Wishlist fetch error:", err);
//     return []; // NEVER return undefined
//   }
// };

// export const toggleWishlist = async (productId) => {
//   try {
//     const { data } = await api.post("/wishlist/toggle", { productId });
//     return data?.products ?? [];
//   } catch (err) {
//     console.error("Wishlist toggle error:", err);
//     return [];
//   }
// };






import api from "@/lib/apiServer";

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
