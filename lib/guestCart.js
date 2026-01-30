/* ================= GET GUEST CART ================= */
export const getGuestCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("guest_cart")) || [];
};

/* ================= ADD TO GUEST CART ================= */
export const addToGuestCart = (variantId, quantity = 1) => {
  const cart = getGuestCart();

  const index = cart.findIndex(
    (item) => item.variantId === variantId
  );

  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ variantId, quantity });
  }

  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

/* ================= CLEAR GUEST CART ================= */
export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};
