import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7000";

async function apiFetch(path, init) {
  const cookieStore = await cookies();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Wishlist API failed: ${response.status}`);
  }

  return response.json();
}

export const getWishlist = () => apiFetch("/wishlist");

export const getWishlistCount = () => apiFetch("/wishlist/count");

export const removeWishlistItem = (productId) =>
  apiFetch(`/wishlist/${productId}`, { method: "DELETE" });

export const toggleWishlistItem = (productId) =>
  apiFetch("/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
