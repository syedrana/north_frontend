import { useRouter } from "next/navigation";

export default function OrderSummary({
  items = [],
  pricing = {
    subtotal: 0,
    shipping: 0,
    codFee: 0,
    discount: 0,
    payable: 0,
  },
  paymentMethod = "COD",
  warnings = [],
  onConfirm,
  loading = false,
  disabled = false,
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-5 h-fit">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      {/* FREE DELIVERY BADGE */}
      {pricing.shipping === 0 && pricing.subtotal > 0 && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">
          🚚 Free Delivery Applied
        </div>
      )}

      {/* FREE COD BADGE */}
      {paymentMethod === "COD" && pricing.codFee === 0 && pricing.subtotal > 0 && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">
          💵 Free COD Applied
        </div>
      )}

      {/* ITEMS */}
      {safeItems.length === 0 ? (
        <p className="text-sm text-gray-500">No items in checkout</p>
      ) : (
        <div className="space-y-4">
          {safeItems.map((item) => (
            <div
              key={item._id || item.variantId?._id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>৳ {item.lineTotal}</span>
            </div>
          ))}
        </div>
      )}

      <hr />

      {/* PRICING BREAKDOWN */}
      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳ {pricing.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>
            Delivery
            {pricing.shipping === 0 && (
              <span className="ml-2 text-green-600 text-xs">(Free)</span>
            )}
          </span>
          <span>৳ {pricing.shipping}</span>
        </div>

        {/* COD SECTION */}
        {paymentMethod === "COD" && (
          <div className="flex justify-between">
            <span>
              Cash on Delivery
              {pricing.codFee === 0 && (
                <span className="ml-2 text-green-600 text-xs">(Free)</span>
              )}
            </span>
            <span>৳ {pricing.codFee}</span>
          </div>
        )}

        {pricing.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-৳ {pricing.discount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between font-semibold text-lg border-t pt-4">
        <span>Total</span>
        <span>৳ {pricing.payable}</span>
      </div>

      {/* WARNINGS */}
      {safeWarnings.length > 0 && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm space-y-1">
          {safeWarnings.map((w, i) => (
            <p key={i}>⚠️ {w}</p>
          ))}
        </div>
      )}

      <button
        disabled={disabled || loading || safeItems.length === 0}
        onClick={onConfirm}
        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Placing order..." : "Place Order"}
      </button>
      <p
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/cart");
          }
        }}
        className="text-sm text-gray-500 text-center cursor-pointer border py-3 rounded-xl"
      >
        Cancel and return
      </p>
    </div>
  );
}
