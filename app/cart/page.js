import { cookies } from "next/headers";
import CartClient from "./CartClient";

export const revalidate = 0; // cart always fresh

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  let cartItems = [];
  let summary = { subtotal: 0, itemCount: 0 };

  if (!token) {
    return (
      <CartClient
        initialCart={cartItems}
        initialSummary={summary}
      />
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart`,
      {
        headers: {
          Cookie: `token=${token}`, // 🔥 THIS FIXES IT
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    const data = await res.json();

    console.log("SERVER CART DATA:", data);

    if (data.success && data.cart?.items) {
      cartItems = data.cart.items;
      summary = data.summary;
    }
  } catch (err) {
    console.error("Cart fetch failed", err);
  }

  return (
    <CartClient
      initialCart={cartItems}
      initialSummary={summary}
    />
  );
}
