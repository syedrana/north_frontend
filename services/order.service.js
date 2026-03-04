import api from "@/lib/api";

export const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data.orders;
};