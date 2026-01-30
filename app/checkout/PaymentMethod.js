// export default function PaymentMethod() {
//   return (
//     <div className="bg-white rounded-2xl border p-6 space-y-4">
//       <h2 className="text-lg font-semibold">Payment Method</h2>

//       <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
//         <input type="radio" checked readOnly />
//         <span>Cash on Delivery</span>
//       </label>

//       <label className="flex items-center gap-3 p-4 border rounded-xl opacity-50">
//         <input type="radio" disabled />
//         <span>Online Payment (Coming soon)</span>
//       </label>
//     </div>
//   );
// }











"use client";

export default function PaymentMethod({
  value = "COD",
  onChange,
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Payment Method
      </h2>

      {/* COD */}
      <label
        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
        ${
          value === "COD"
            ? "border-black ring-1 ring-black"
            : "hover:border-gray-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            checked={value === "COD"}
            onChange={() => onChange("COD")}
          />
          <div>
            <p className="font-medium">
              Cash on Delivery
            </p>
            <p className="text-sm text-gray-500">
              Pay when you receive the product
            </p>
          </div>
        </div>

        <span className="text-sm font-semibold text-green-600">
          Available
        </span>
      </label>

      {/* Online payment (disabled) */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-gray-50 opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <input type="radio" disabled />
          <div>
            <p className="font-medium">
              Online Payment
            </p>
            <p className="text-sm text-gray-500">
              bKash / Nagad / Card
            </p>
          </div>
        </div>

        <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
          Coming soon
        </span>
      </div>
    </div>
  );
}
