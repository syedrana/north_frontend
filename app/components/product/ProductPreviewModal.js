// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import Image from "next/image";

// export default function ProductPreviewModal({
//   product,
//   open,
//   onClose,
// }) {
//   if (!product) return null;

//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           {/* Overlay */}
//           <motion.div
//             className="fixed inset-0 bg-black/40 z-[100]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />

//           {/* Modal */}
//           <motion.div
//             className="fixed inset-0 z-[110] flex items-center justify-center p-4"
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//           >
//             <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full grid md:grid-cols-2 gap-6 p-6 relative">

//               <button
//                 onClick={onClose}
//                 className="absolute top-3 right-3 text-gray-500"
//               >
//                 ✕
//               </button>

//               {/* IMAGE */}
//               <div className="relative w-full h-80">
//                 <Image
//                   src={product.mainImage || "/placeholder.png"}
//                   alt={product.name}
//                   fill
//                   className="object-contain"
//                 />
//               </div>

//               {/* INFO */}
//               <div className="space-y-3">
//                 <h2 className="text-lg font-semibold">
//                   {product.name}
//                 </h2>

//                 <div className="flex gap-2 items-center">
//                   <span className="text-xl font-bold text-indigo-600">
//                     ৳{product.discountPrice || product.price}
//                   </span>

//                   {product.discountPrice && (
//                     <span className="line-through text-gray-400">
//                       ৳{product.price}
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-sm text-gray-600 line-clamp-4">
//                   {product.shortDescription ||
//                     "Premium quality product"}
//                 </p>

//                 <button className="w-full bg-black text-white py-3 rounded-lg">
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }















"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function ProductPreviewModal({
  product,
  onClose,
}) {
  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full grid md:grid-cols-2 gap-6 p-6 relative">

              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500"
              >
                ✕
              </button>

              {/* IMAGE */}
              <div className="relative w-full h-80">
                <Image
                  src={product.mainImage || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* INFO */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">
                  {product.name}
                </h2>

                <div className="flex gap-2 items-center">
                  <span className="text-xl font-bold text-indigo-600">
                    ৳{product.discountPrice || product.price}
                  </span>

                  {product.discountPrice && (
                    <span className="line-through text-gray-400">
                      ৳{product.price}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-4">
                  {product.shortDescription ||
                    "Premium quality product"}
                </p>

                <button className="w-full bg-black text-white py-3 rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}