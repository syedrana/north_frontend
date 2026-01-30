// import Image from "next/image";

// export default function CheckoutItems({ items = [] }) {
//   if (!items.length) return null;

  

//   return (
//     <div className="bg-white rounded-2xl border p-6 space-y-4">
//       <h2 className="text-lg font-semibold">
//         Products
//       </h2>

//       {items.map((item) => (
//         <div
//           key={item.variantId?._id || item.variantId}
//           className="flex gap-4"
//         >
            
//           <Image
//             src={imageUrl || "/placeholder.png"}
//             alt={item.name}
//             width={64}
//             height={64}
//             className="rounded-xl border"
//           />

//           <div className="flex-1">
//             <p className="font-medium">
//               {item.name}
//             </p>

//             <p className="text-sm text-gray-500">
//               Color: {item.variantId?.color || "—"} ·
//               Size: {item.variantId?.size || "—"}
//             </p>

//             <p className="text-sm">
//               Qty: {item.quantity}
//             </p>
//           </div>

//           <div className="text-sm font-medium">
//             ৳ {item.lineTotal}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }









import Image from "next/image";

export default function CheckoutItems({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Products
      </h2>

      {items.map((item) => {
        const imageUrl =
          typeof item.variantId?.images?.[0] === "string"
            ? item.variantId.images[0]
            : item.variantId?.images?.[0]?.url;

        return (
          <div
            key={item.variantId?._id || item.variantId}
            className="flex gap-4 items-center"
          >
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={item.name}
              width={64}
              height={64}
              className="rounded-xl border object-cover"
            />

            <div className="flex-1">
              <p className="font-medium">
                {item.name}
              </p>

              <p className="text-sm text-gray-500">
                Color: {item.variantId?.color || "—"} ·
                Size: {item.variantId?.size || "—"}
              </p>

              <p className="text-sm">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="text-sm font-semibold">
              ৳ {item.lineTotal}
            </div>
          </div>
        );
      })}
    </div>
  );
}
