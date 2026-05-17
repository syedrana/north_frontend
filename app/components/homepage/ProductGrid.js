// import Image from "next/image";
// import Link from "next/link";
// import WishlistButton from "../wishlist/WishlistButton";

// export default function ProductGrid({ title, products = [] }) {
//   if (!Array.isArray(products) || products.length === 0) {
//     return null;
//   }

//   return (
//     <section>
//       {title && <h2 className="mb-3 text-xl font-semibold">{title}</h2>} 

//       <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6 ">
//         {products.map((product, index) => {
//           const id = product?._id || product?.id || product?.slug || index;
//           const href = product?.href || `/product/${product?.slug || ""}`;

//           return (
//             <article key={id} className="w-full rounded-lg border bg-white ">
//               <div className="relative">
//                 <Link href={href}>
//                   {product?.image && (
//                     <Image
//                       src={product.image}
//                       alt={product?.name || "Product"}
//                       width={300}
//                       height={320}
//                       className="h-50 w-full rounded object-cover"
//                     />
//                   )}
//                 </Link>

//                 <WishlistButton
//                   productId={product?._id || product?.id}
//                   className="rounded-full bg-white/90 p-1.5 text-gray-700"
//                 />
//               </div>

//               <Link href={href} className="mt-3 pl-2 block text-sm font-medium text-gray-900">
//                 {product?.name || "Product"}
//               </Link>

//               <div className="mt-1 pl-2 pb-2 flex items-center gap-2">
//                 {product?.discountPrice ? (
//                   <>
//                     <span className="font-semibold text-emerald-600">৳{product.discountPrice}</span>
//                     <span className="text-sm text-gray-500 line-through">৳{product?.price ?? ""}</span>
//                   </>
//                 ) : (
//                   <span className="font-semibold text-emerald-600">৳{product?.price ?? ""}</span>
//                 )}
//               </div>

//               {/* <button
//                 type="button"
//                 className="mt-3 w-full rounded bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
//               >
//                 Add to Cart
//               </button> */}
//             </article>
//           );
//         })}
//       </div>
//     </section>
//   );
// }























// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { memo, useMemo } from "react";

// import WishlistButton from "../wishlist/WishlistButton";

// /* -------------------------------------------------------------------------- */
// /*                                   Helpers                                  */
// /* -------------------------------------------------------------------------- */

// const getProductImage = (product = {}) => {
//   return (
//     product?.image ||
//     product?.thumbnail ||
//     product?.images?.[0]?.url ||
//     null
//   );
// };

// const getProductHref = (product = {}) => {
//   return product?.href || `/product/${product?.slug || ""}`;
// };

// const getProductId = (product = {}, fallback = "") => {
//   return (
//     product?._id ||
//     product?.id ||
//     product?.slug ||
//     fallback
//   );
// };

// const getPricing = (product = {}) => {
//   const originalPrice =
//     Number(product?.price) || 0;

//   const discountedPrice =
//     Number(product?.discountPrice) || 0;

//   const hasDiscount =
//     discountedPrice > 0 &&
//     discountedPrice < originalPrice;

//   const finalPrice = hasDiscount
//     ? discountedPrice
//     : originalPrice;

//   const discountPercentage = hasDiscount
//     ? Math.round(
//         ((originalPrice - discountedPrice) /
//           originalPrice) *
//           100
//       )
//     : 0;

//   return {
//     originalPrice,
//     discountedPrice,
//     finalPrice,
//     hasDiscount,
//     discountPercentage,
//   };
// };

// const formatCurrency = (value) => {
//   const amount = Number(value);

//   if (!Number.isFinite(amount)) {
//     return "৳0";
//   }

//   return `৳${amount.toLocaleString("en-BD")}`;
// };

// const isInStock = (product = {}) => {
//   if (typeof product?.stock === "number") {
//     return product.stock > 0;
//   }

//   return true;
// };

// /* -------------------------------------------------------------------------- */
// /*                               Product Card                                 */
// /* -------------------------------------------------------------------------- */

// const ProductCard = memo(function ProductCard({
//   product,
//   index,
// }) {
//   const id = useMemo(
//     () => getProductId(product, index),
//     [product, index]
//   );

//   const href = useMemo(
//     () => getProductHref(product),
//     [product]
//   );

//   const image = useMemo(
//     () => getProductImage(product),
//     [product]
//   );

//   const pricing = useMemo(
//     () => getPricing(product),
//     [product]
//   );

//   const inStock = useMemo(
//     () => isInStock(product),
//     [product]
//   );

//   return (
//     <article
//       className="
//         group
//         relative
//         overflow-hidden
//         rounded-xl
//         border
//         border-gray-200
//         bg-white
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:border-emerald-200
//         hover:shadow-lg
//       "
//     >
//       {/* Image */}
//       <div className="relative overflow-hidden">
//         <Link
//           href={href}
//           aria-label={product?.name || "Product"}
//         >
//           {image ? (
//             <Image
//               src={image}
//               alt={product?.name || "Product"}
//               width={500}
//               height={500}
//               loading="lazy"
//               className="
//                 h-48
//                 w-full
//                 object-cover
//                 transition-transform
//                 duration-500
//                 group-hover:scale-105
//                 md:h-56
//               "
//             />
//           ) : (
//             <div
//               className="
//                 flex
//                 h-48
//                 w-full
//                 items-center
//                 justify-center
//                 bg-slate-100
//                 text-sm
//                 text-slate-400
//                 md:h-56
//               "
//             >
//               No Image
//             </div>
//           )}
//         </Link>

//         {/* Wishlist */}
//         <div className="absolute right-2 top-2 z-10">
//           <WishlistButton
//             productId={product?._id || product?.id}
//             className="
//               rounded-full
//               bg-white/90
//               p-2
//               shadow-md
//               backdrop-blur
//             "
//           />
//         </div>

//         {/* Discount Badge */}
//         {pricing.hasDiscount && (
//           <div
//             className="
//               absolute
//               left-2
//               top-2
//               z-10
//               rounded-md
//               bg-red-500
//               px-2
//               py-1
//               text-xs
//               font-semibold
//               text-white
//             "
//           >
//             -{pricing.discountPercentage}%
//           </div>
//         )}

//         {/* Stock Badge */}
//         {!inStock && (
//           <div
//             className="
//               absolute
//               bottom-2
//               left-2
//               z-10
//               rounded-md
//               bg-black/80
//               px-2
//               py-1
//               text-xs
//               font-medium
//               text-white
//             "
//           >
//             Out of Stock
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-3">
//         {/* Product Name */}
//         <Link
//           href={href}
//           className="
//             line-clamp-2
//             min-h-[42px]
//             text-sm
//             font-medium
//             text-gray-900
//             transition-colors
//             hover:text-emerald-600
//             md:text-base
//           "
//         >
//           {product?.name || "Unnamed Product"}
//         </Link>

//         {/* Brand */}
//         {product?.brand?.name && (
//           <p className="mt-1 text-xs text-gray-500">
//             {product.brand.name}
//           </p>
//         )}

//         {/* Price */}
//         <div className="mt-2 flex flex-wrap items-center gap-2">
//           <span
//             className="
//               text-base
//               font-bold
//               text-emerald-600
//             "
//           >
//             {formatCurrency(pricing.finalPrice)}
//           </span>

//           {pricing.hasDiscount && (
//             <span
//               className="
//                 text-sm
//                 text-gray-400
//                 line-through
//               "
//             >
//               {formatCurrency(
//                 pricing.originalPrice
//               )}
//             </span>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// });

// /* -------------------------------------------------------------------------- */
// /*                               Main Component                               */
// /* -------------------------------------------------------------------------- */

// export default function ProductGrid({
//   title,
//   products = [],
// }) {
//   const validProducts = useMemo(() => {
//     if (!Array.isArray(products)) {
//       return [];
//     }

//     return products.filter(
//       (product) =>
//         product &&
//         (product?._id ||
//           product?.id ||
//           product?.slug)
//     );
//   }, [products]);

//   if (validProducts.length === 0) {
//     return null;
//   }

//   return (
//     <section className="w-full">
//       {/* Header */}
//       {title && (
//         <div className="mb-4 flex items-center justify-between">
//           <h2
//             className="
//               text-xl
//               font-bold
//               tracking-tight
//               text-gray-900
//             "
//           >
//             {title}
//           </h2>

//           <span className="text-sm text-gray-500">
//             {validProducts.length} Products
//           </span>
//         </div>
//       )}

//       {/* Grid */}
//       <div
//         className="
//           grid
//           grid-cols-2
//           gap-3

//           sm:grid-cols-2
//           md:grid-cols-3
//           md:gap-4

//           lg:grid-cols-4
//           xl:grid-cols-5
//           2xl:grid-cols-6
//         "
//       >
//         {validProducts.map((product, index) => (
//           <ProductCard
//             key={getProductId(product, index)}
//             product={product}
//             index={index}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

















"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

import WishlistButton from "../wishlist/WishlistButton";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const getProductId = (product = {}, fallback = "") => {
  return (
    product?._id ||
    product?.id ||
    product?.slug ||
    fallback
  );
};

const getProductHref = (product = {}) => {
  return product?.href || `/product/${product?.slug || ""}`;
};

const getProductImage = (product = {}) => {
  return (
    product?.image ||
    product?.thumbnail ||
    product?.images?.[0]?.url ||
    null
  );
};

const getPricing = (product = {}) => {
  const originalPrice =
    Number(product?.price) || 0;

  const discountedPrice =
    Number(product?.discountPrice) || 0;

  const hasDiscount =
    discountedPrice > 0 &&
    discountedPrice < originalPrice;

  const finalPrice = hasDiscount
    ? discountedPrice
    : originalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - discountedPrice) /
          originalPrice) *
          100
      )
    : 0;

  return {
    originalPrice,
    discountedPrice,
    finalPrice,
    hasDiscount,
    discountPercentage,
  };
};

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "৳0";
  }

  return `৳${amount.toLocaleString("en-BD")}`;
};

const isInStock = (product = {}) => {
  if (typeof product?.stock === "number") {
    return product.stock > 0;
  }

  return true;
};

/* -------------------------------------------------------------------------- */
/*                               Product Card                                 */
/* -------------------------------------------------------------------------- */

const ProductCard = memo(function ProductCard({
  product,
  index,
}) {
  const id = useMemo(
    () => getProductId(product, index),
    [product, index]
  );

  const href = useMemo(
    () => getProductHref(product),
    [product]
  );

  const image = useMemo(
    () => getProductImage(product),
    [product]
  );

  const pricing = useMemo(
    () => getPricing(product),
    [product]
  );

  const inStock = useMemo(
    () => isInStock(product),
    [product]
  );

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-md
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link
          href={href}
          aria-label={product?.name || "Product"}
        >
          {image ? (
            <Image
              src={image}
              alt={product?.name || "Product"}
              width={500}
              height={500}
              loading="lazy"
              className="
                h-36
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105

                md:h-40
                lg:h-44
              "
            />
          ) : (
            <div
              className="
                flex
                h-36
                w-full
                items-center
                justify-center
                bg-slate-100
                text-xs
                text-slate-400

                md:h-40
                lg:h-44
              "
            >
              No Image
            </div>
          )}
        </Link>

        {/* Wishlist */}
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton
            productId={product?._id || product?.id}
            className="
              rounded-full
              bg-white/90
              p-1.5
              shadow-sm
              backdrop-blur
            "
          />
        </div>

        {/* Discount Badge */}
        {pricing.hasDiscount && (
          <div
            className="
              absolute
              left-2
              top-2
              z-10
              rounded-md
              bg-red-500
              px-1.5
              py-1
              text-[10px]
              font-semibold
              text-white
            "
          >
            -{pricing.discountPercentage}%
          </div>
        )}

        {/* Stock Badge */}
        {!inStock && (
          <div
            className="
              absolute
              bottom-2
              left-2
              z-10
              rounded-md
              bg-black/80
              px-2
              py-1
              text-[10px]
              font-medium
              text-white
            "
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        {/* Product Name */}
        <Link
          href={href}
          className="
            line-clamp-2
            min-h-[38px]
            text-sm
            font-medium
            leading-5
            text-gray-900
            transition-colors
            hover:text-emerald-600
          "
        >
          {product?.name || "Unnamed Product"}
        </Link>

        {/* Brand */}
        {product?.brand?.name && (
          <p className="mt-1 text-[11px] text-gray-500">
            {product.brand.name}
          </p>
        )}

        {/* Price */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className="
              text-sm
              font-bold
              text-emerald-600

              md:text-base
            "
          >
            {formatCurrency(pricing.finalPrice)}
          </span>

          {pricing.hasDiscount && (
            <span
              className="
                text-xs
                text-gray-400
                line-through
              "
            >
              {formatCurrency(
                pricing.originalPrice
              )}
            </span>
          )}
        </div>
      </div>
    </article>
  );
});

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export default function ProductGrid({
  title,
  products = [],
}) {
  const validProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter(
      (product) =>
        product &&
        (product?._id ||
          product?.id ||
          product?.slug)
    );
  }, [products]);

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Header */}
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="
              text-lg
              font-bold
              tracking-tight
              text-gray-900

              md:text-xl
            "
          >
            {title}
          </h2>

          <span className="text-xs text-gray-500 md:text-sm">
            {validProducts.length} Products
          </span>
        </div>
      )}

      {/* Grid */}
      <div
        className="
          grid grid-cols-2 gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          2xl:grid-cols-7
        "
      >
        {validProducts.map((product, index) => (
          <ProductCard
            key={getProductId(product, index)}
            product={product}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}