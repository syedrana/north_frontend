// export default function OrderSummary({
//   items = [],
//   pricing = {
//     subtotal: 0,
//     shipping: 0,
//     discount: 0,
//     payable: 0,
//   },
//   warnings = [],
//   onConfirm,
//   loading = false,
//   disabled = false,
// }) {
//   // ✅ safety guards
//   const safeItems = Array.isArray(items) ? items : [];
//   const safeWarnings = Array.isArray(warnings) ? warnings : [];

//   return (
//     <div className="bg-white rounded-2xl border p-6 space-y-5 h-fit">
//       <h2 className="text-xl font-semibold">Order Summary</h2>

//       {pricing.shipping === 0 && pricing.subtotal > 0 && (
//         <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">
//           🚚 Free Delivery Applied
//         </div>
//       )}

//       {/* {pricing.codFee === 0 && paymentMethod === "COD" && (
//         <div className="text-green-600">
//           Free COD on orders above 3000৳ 🎉
//         </div>
//       )} */}

//       {/* ✅ ITEMS */}
//       {safeItems.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No items in checkout
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {safeItems.map((item) => {
//             const variant = item.variantId || {};
//             // const image = variant?.images?.[0]?.url || "/placeholder.png";

//             return (
//               <div
//                 key={item._id || item.variantId?._id}
//                 className="flex gap-4"
//               >
//                 {/* IMAGE */}
//                 {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-50">
//                   <Image
//                     src={image}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div> */}

//                 {/* INFO */}
//                 <div className="flex-1">
//                   <p className="text-sm font-medium leading-tight">
//                     {item.name} x {item.quantity}
//                   </p>

//                   {/* <p className="text-xs text-gray-500 mt-0.5">
//                     {variant.color || "—"} •{" "}
//                     {variant.size || "—"}
//                   </p> */}

//                   {/* <p className="text-xs text-gray-500">
//                     Qty: {item.quantity}
//                   </p> */}
//                 </div>

//                 {/* PRICE */}
//                 <div className="text-sm font-medium whitespace-nowrap">
//                   ৳ {item.lineTotal}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <hr />

//       {/* ✅ PRICING */}
//       <div className="space-y-1.5 text-sm">
//         <div className="flex justify-between">
//           <span>Subtotal</span>
//           <span>৳ {pricing.subtotal}</span>
//         </div>

//         {/* <div className="flex justify-between">
//           <span>Shipping</span>
//           <span>৳ {pricing.shipping}</span>
//         </div> */}

//         {/* {pricing.shipping === 0 && pricing.subtotal > 0 && (
//           <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl">
//             🚚 Free Delivery Applied
//           </div>
//         )} */}


//         <div className="flex justify-between">
//           <span>
//             Delivery
//             {pricing.shipping === 0 && (
//               <span className="ml-2 text-green-600 text-xs">
//                 (Free)
//               </span>
//             )}
//           </span>
//           <span>৳ {pricing.shipping}</span>
//         </div>

//         {pricing.codFee > 0 && (
//           <div className="flex justify-between">
//             <span className="ml-2 text-green-600 text-xs">
//               COD Charge
//             </span>
//             <span>৳ {pricing.codFee}</span>
//           </div>
//         )}

//         {pricing.discount > 0 && (
//           <div className="flex justify-between text-green-600">
//             <span>Discount</span>
//             <span>-৳ {pricing.discount}</span>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-between font-semibold text-lg">
//         <span>Total</span>
//         <span>৳ {pricing.payable}</span>
//       </div>

//       {/* ✅ WARNINGS */}
//       {safeWarnings.length > 0 && (
//         <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm space-y-1">
//           {safeWarnings.map((w, i) => (
//             <p key={i}>⚠️ {w}</p>
//           ))}
//         </div>
//       )}

//       {/* ✅ CONFIRM */}
//       <button
//         disabled={disabled || loading || safeItems.length === 0}
//         onClick={onConfirm}
//         className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
//       >
//         {loading ? "Placing order..." : "Place Order"}
//       </button>
//     </div>
//   );
// }

















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
    </div>
  );
}
