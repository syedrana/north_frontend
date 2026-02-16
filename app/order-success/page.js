// "use client";

// import { CheckCircle } from "lucide-react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// export default function OrderSuccessPage() {
//   const params = useSearchParams();
//   const orderNumber = params.get("orderNumber");

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center space-y-6">

//         <CheckCircle className="mx-auto text-green-500" size={70} />

//         <h1 className="text-2xl font-semibold">
//           Order Placed Successfully 🎉
//         </h1>

//         <p className="text-gray-600 text-sm">
//           Thank you for your purchase. Your order has been confirmed.
//         </p>

//         {orderNumber && (
//           <div className="bg-gray-100 rounded-xl p-3 text-sm">
//             Order ID: <span className="font-medium">{orderNumber}</span>
//           </div>
//         )}

//         <div className="space-y-3 pt-4">

//           <Link
//             href="/orders"
//             className="block w-full bg-black text-white py-3 rounded-xl"
//           >
//             View My Orders
//           </Link>

//           <Link
//             href="/"
//             className="block w-full border py-3 rounded-xl"
//           >
//             Continue Shopping
//           </Link>

//         </div>

//       </div>
//     </div>
//   );
// }
















// "use client";

// import apiServer from "@/lib/apiServer";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function OrderSuccessPage() {
//   const params = useSearchParams();
//   const orderId = params.get("orderId");

//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     if (!orderId) return;

//     apiServer.get(`/order/${orderId}`).then((res) => {
//       setOrder(res.data.order);
//     });
//   }, [orderId]);

//   if (!order) return <div className="p-10">Loading...</div>;

//   const estimateDate = new Date(order.createdAt);
//   estimateDate.setDate(estimateDate.getDate() + 3);

//   return (
//     <div className="max-w-3xl mx-auto p-6 py-14">
//       <div className="bg-white rounded-2xl border p-8 space-y-6">

//         {/* SUCCESS ICON */}
//         <div className="text-center space-y-3">
//           <div className="text-5xl">✅</div>
//           <h1 className="text-2xl font-semibold">
//             Order Placed Successfully
//           </h1>
//           <p className="text-gray-500">
//             Thank you for your purchase
//           </p>
//         </div>

//         {/* ORDER INFO */}
//         <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Order Number</span>
//             <span className="font-semibold">
//               {order.orderNumber}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span>Estimated Delivery</span>
//             <span>
//               {estimateDate.toDateString()}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span>Payment Method</span>
//             <span className="px-3 py-1 rounded-full bg-black text-white text-xs">
//               {order.paymentMethod}
//             </span>
//           </div>
//         </div>

//         {/* ITEMS */}
//         <div>
//           <h2 className="font-semibold mb-3">Order Summary</h2>

//           <div className="space-y-3">
//             {order.items.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex justify-between text-sm"
//               >
//                 <span>
//                   {item.name} x {item.quantity}
//                 </span>
//                 <span>৳ {item.lineTotal}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TOTAL */}
//         <div className="flex justify-between font-semibold border-t pt-4">
//           <span>Total Paid</span>
//           <span>৳ {order.pricing.total}</span>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex gap-3 pt-4">

//           <a
//             href={`/api/invoice/${order._id}`}
//             className="flex-1 text-center border rounded-xl py-3"
//           >
//             Download Invoice
//           </a>

//           <Link
//             href="/shop"
//             className="flex-1 text-center bg-black text-white rounded-xl py-3"
//           >
//             Continue Shopping
//           </Link>

//         </div>
//       </div>
//     </div>
//   );
// }





















"use client";

import apiServer from "@/lib/apiServer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const downloadInvoice = () => {
  window.open(`/order/invoice/${order._id}`);
};


  useEffect(() => {
    if (!orderId) return;

    apiServer.get(`/order/${orderId}`)
      .then((res) => {
        setOrder(res.data.order);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!order) return <div className="p-10 text-center">Order not found</div>;

  const isCOD = order.paymentMethod === "COD";

  const totalLabel = isCOD ? "Total Due" : "Total Paid";

  const paymentLabel = isCOD
    ? "Cash on Delivery"
    : "Online Payment";

  // ===== Delivery estimate =====
  const estimateDelivery = () => {
    const start = new Date();
    const end = new Date();

    start.setDate(start.getDate() + 2);
    end.setDate(end.getDate() + 4);

    return `${start.toDateString()} - ${end.toDateString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* SUCCESS HEADER */}
      <div className="bg-white rounded-2xl border p-8 text-center mb-6">

        <div className="text-green-600 text-5xl mb-3">✓</div>

        <h1 className="text-2xl font-semibold">
          Order Placed Successfully
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for your purchase
        </p>

        <div className="mt-4 text-lg font-medium">
          Order Number: {order.orderNumber}
        </div>

      </div>

      {/* PAYMENT + DELIVERY */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>

          <div className="inline-block bg-gray-100 px-4 py-2 rounded-xl text-sm">
            {paymentLabel}
          </div>

          {isCOD && (
            <p className="text-sm text-gray-500 mt-3">
              Pay with cash upon delivery
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold mb-3">
            Estimated Delivery
          </h3>

          <p className="text-sm text-gray-600">
            {estimateDelivery()}
          </p>
        </div>

      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-2xl border p-6 mb-6">

        <h2 className="font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">

          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ৳ {item.lineTotal}
              </span>
            </div>
          ))}

        </div>

        <hr className="my-4" />

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳ {order.pricing.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>৳ {order.pricing.shipping}</span>
          </div>

          {isCOD && (
            <div className="flex justify-between">
              <span>Cash on Delivery</span>
              <span>৳ {order.pricing.codFee}</span>
            </div>
          )}

          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-৳ {order.pricing.discount}</span>
            </div>
          )}

        </div>

        <div className="flex justify-between font-semibold text-lg border-t pt-4 mt-4">
          <span>{totalLabel}</span>
          <span>৳ {order.pricing.total}</span>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4">

        <button
          onClick={downloadInvoice}
          className="flex-1 bg-black text-white py-3 rounded-xl"
        >
          Download Invoice
        </button>

        <button
          onClick={() => router.push("/")}
          className="flex-1 border py-3 rounded-xl"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}
