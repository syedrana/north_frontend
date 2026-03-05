"use client";

import apiServer from "@/lib/apiSet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CartClient() {
  const [cart, setCart] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const [delivery, setDelivery] = useState(null);
  const [addressExists, setAddressExists] = useState(false);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await apiServer.get("/cart");

      if (res.data.success && res.data.cart?.items) {
        // setCart(res.data.cart.items);
        setCart(res.data.cart?.items || []);
        setDelivery(res.data.delivery);
        setAddressExists(res.data.addressExists);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.log("Cart load failed");
      setCart([]);
    } finally {
      setPageLoading(false);
    }
  };

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

    const total = subtotal + (delivery && addressExists ? delivery : 0);

    return { subtotal, itemCount, total };

  }, [cart, delivery, addressExists]);

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
      window.dispatchEvent(new Event("cart-changed"));
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
      window.dispatchEvent(new Event("cart-changed"));
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="text-center mt-24 text-gray-500">
        Loading cart...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!cart.length) {
    return (
      <div className="text-center mt-24">
        <p className="text-xl text-gray-500">
          cart is empty
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
      {/* ITEMS */}
      <div className="lg:col-span-2 space-y-6">
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

                {outOfStock && (
                  <p className="text-xs text-red-500 mt-1">
                    Only {item.variantId.stock} left
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

          {/* <div className="flex justify-between text-gray-500">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div> */}
          <div className="flex justify-between text-gray-500">
            <span>Delivery</span>

            {addressExists ? (
              <span>
                {delivery === 0
                  ? "Free"
                  : `৳ ${delivery ?? "—"}`}
              </span>
            ) : (
              <span
                onClick={() => router.push("/account/address")}
                className="text-orange-500 cursor-pointer"
              >
                Add address to see fee
              </span>
            )}
          </div>

          <hr />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>৳ {summary.total}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Final amount will be calculated at checkout
          </p>
        </div>

        <button
          onClick={async () => {
            await apiServer.post("/checkout");
            router.push("/checkout");
          }}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
