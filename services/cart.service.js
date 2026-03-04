import api from "@/lib/api";

export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data.cart;
};

export const addToCart = async (payload) => {
  const { data } = await api.post("/cart/add", payload);
  return data.cart;
};