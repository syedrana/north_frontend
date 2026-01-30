import { cookies } from "next/headers";
import CartClient from "./CartClient";

export const revalidate = 0; // cart always fresh

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let cartData = {
    cart: [],
    summary: { subtotal: 0, itemCount: 0 },
  };

  if (!token) {
    return <CartClient initialCart={[]} initialSummary={cartData.summary} />;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart`,
      {
        headers: {
          Cookie: `token=${token}`, // 🔥 THIS FIXES IT
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (data.success && data.cart) {
      cartData = {
        cart: data.cart.items,
        summary: data.summary,
      };
    }
  } catch (err) {
    console.error("Cart fetch failed", err);
  }

  return (
    <CartClient
      initialCart={cartData.cart}
      initialSummary={cartData.summary}
    />
  );
}
