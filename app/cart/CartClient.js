// "use client";

// import apiServer from "@/lib/apiServer";
// import Image from "next/image";
// import { useMemo, useState } from "react";
// import AddToCartButton from "../components/cart/AddToCartButton";

// export default function CartClient({
//   initialCart,
//   accessToken,
// }) {
//   const [cart, setCart] = useState(initialCart);

//     const summary = useMemo(() => {
//     const subtotal = cart.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//     );

//     const itemCount = cart.reduce(
//         (sum, item) => sum + item.quantity,
//         0
//     );

//     return { subtotal, itemCount };
//     }, [cart]);


//   if (!cart || cart.length === 0) {
//     return (
//         <div className="text-center mt-20">
//         <p className="text-lg text-gray-500">
//             Your cart is empty
//         </p>
//         </div>
//     );
//   }


//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

//       <div className="grid gap-6">
//         {cart.map((item) => (
//           <div
//             key={item.variantId._id}
//             className="grid grid-cols-4 gap-4 items-center p-4 bg-white rounded-xl shadow"
//           >
//             <div className="relative w-24 h-24 rounded overflow-hidden">
//               <Image
//                 src={
//                   item.variantId.images?.[0]?.url ||
//                   "/placeholder.png"
//                 }
//                 alt={item.productId.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             <div className="col-span-2">
//               <p className="font-semibold">
//                 {item.productId.name}
//               </p>
//               <p className="text-sm text-gray-500">
//                 {item.variantId.color} •{" "}
//                 {item.variantId.size}
//               </p>
//               <p className="text-sm mt-1">
//                 ৳ {item.price} × {item.quantity}
//               </p>
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <AddToCartButton
//                 variantId={item.variantId._id}
//                 isAuthenticated
//               />

//               <button
//                 onClick={async () => {
//                   await apiServer.delete(
//                     `/cart/${item.variantId._id}`,
//                     {
//                       headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                       },
//                     }
//                   );

//                   setCart((prev) =>
//                     prev.filter(
//                       (i) =>
//                         i.variantId._id !==
//                         item.variantId._id
//                     )
//                   );
//                 }}
//                 className="text-red-500 text-sm underline"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SUMMARY */}
//       <div className="mt-10 flex justify-end items-center gap-6">
//         <p className="text-lg font-semibold">
//           Total ({summary.itemCount} items): ৳{" "}
//           {summary.subtotal}
//         </p>
//       </div>
//     </div>
//   );
// }












"use client";

import apiServer from "@/lib/apiSet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function CartClient({ initialCart }) {
  const [cart, setCart] = useState(initialCart);
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const itemCount = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return { subtotal, itemCount };
  }, [cart]);

  /* ================= ACTIONS ================= */
  const updateQty = async (variantId, delta) => {
    const item = cart.find(
      (i) => i.variantId._id === variantId
    );
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    setLoadingId(variantId);

    try {
      await apiServer.put("/cart/update", {
        variantId,
        quantity: newQty,
      });

      setCart((prev) =>
        prev.map((i) =>
          i.variantId._id === variantId
            ? { ...i, quantity: newQty }
            : i
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const removeItem = async (variantId) => {
    setLoadingId(variantId);
    try {
      await apiServer.delete(`/cart/${variantId}`);
      setCart((prev) =>
        prev.filter((i) => i.variantId._id !== variantId)
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= EMPTY ================= */
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center mt-24">
        <p className="text-xl text-gray-500">
          Your cart is empty
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
      {/* CART ITEMS */}
      <div className="lg:col-span-2 space-y-6">
        {/* <h1 className="text-3xl font-bold">Shopping Cart</h1> */}

        {cart.map((item) => {
          const outOfStock =
            item.variantId.stock <= item.quantity;

          return (
            <div
              key={item.variantId._id}
              className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border"
            >
              {/* IMAGE */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                <Image
                  src={
                    item.variantId.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={item.productId.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="font-semibold">
                  {item.productId.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.variantId.color} •{" "}
                  {item.variantId.size}
                </p>

                {/* STOCK WARNING */}
                {outOfStock && (
                  <p className="text-xs text-red-500 mt-1">
                    Only {item.variantId.stock} left in stock
                  </p>
                )}

                {/* QTY */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    disabled={loadingId === item.variantId._id}
                    onClick={() =>
                      updateQty(item.variantId._id, -1)
                    }
                    className="w-8 h-8 border rounded-lg"
                  >
                    −
                  </button>

                  <span className="w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    disabled={
                      outOfStock ||
                      loadingId === item.variantId._id
                    }
                    onClick={() =>
                      updateQty(item.variantId._id, 1)
                    }
                    className="w-8 h-8 border rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="text-right space-y-2">
                <p className="font-semibold">
                  ৳ {item.price * item.quantity}
                </p>

                <button
                  disabled={loadingId === item.variantId._id}
                  onClick={() =>
                    removeItem(item.variantId._id)
                  }
                  className="text-sm text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳ {summary.subtotal}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>৳ {summary.subtotal}</span>
          </div>
        </div>

        <button
          onClick={async () => {
            await apiServer.post("/checkout"); // 🔥 CREATE from cart
            router.push("/checkout");
          }}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90"
        >
          Proceed to Checkout
        </button>


        {/* <button
          onClick={() => router.push("/checkout")}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90"
        >
          Proceed to Checkout
        </button> */}
      </div>
    </div>
  );
}
