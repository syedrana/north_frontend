import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    redirect("/login?redirect=/checkout");
  }

  let checkoutData = null;
  
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
            headers: {
                Cookie: `token=${token}`,
            },
            cache: "no-store",
        }
    );


    const data = await res.json();
    console.log("data :", data)
    if (data.success) {
      checkoutData = data;
    }
  } catch (err) {
    console.error("Cart fetch failed", err);
    checkoutData = null;
  }

  

  return (
    <CheckoutClient initialCheckout={checkoutData.checkout} />
  );
}









// export default async function CheckoutPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) redirect("/login?redirect=/checkout");

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
//     {
//       headers: { Cookie: `token=${token}` },
//       cache: "no-store",
//     }
//   );

//   const data = await res.json();

//   return <CheckoutClient initialCheckout={data.checkout} />;
// }
