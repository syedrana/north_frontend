// import Image from "next/image";
// import Link from "next/link";

// function getCategoryImageUrl(category) {
//   if (!category) return "";

//   if (typeof category.image === "string") return category.image;

//   return (
//     category?.image?.url ||
//     category?.image?.secure_url ||
//     category?.thumbnail?.url ||
//     ""
//   );
// }

// export default function CategoryGrid({ categories = [] }) {
//   if (!Array.isArray(categories) || categories.length === 0) {
//     return null;
//   }

//   return (
//     <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//       {categories.map((category, index) => {
//         const key = category?._id || category?.id || category?.slug || index;
//         const href = category?.href || `/shop?category=${category?.slug || ""}`;

//         const imageUrl = getCategoryImageUrl(category);

//         return (
//           <Link key={key} href={href} className="group overflow-hidden rounded-lg border">
//             {imageUrl && (
//               <Image
//                 src={imageUrl}
//                 alt={category?.name || "Category"}
//                 width={400}
//                 height={300}
//                 className="h-36 w-full object-cover transition duration-200 group-hover:scale-105"
//               />
//             )}

//             <div className="p-3">
//               <p className="font-medium">{category?.name || "Category"}</p>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }













"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

/* =========================================================
   IMAGE RESOLVER
========================================================= */
function getCategoryImageUrl(category) {
  if (!category) return "";

  if (typeof category.image === "string") return category.image;

  return (
    category?.image?.url ||
    category?.image?.secure_url ||
    category?.thumbnail?.url ||
    ""
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */
const CategoryCard = memo(function CategoryCard({ category, priority = false }) {
  const href =
    category?.href || `/shop?category=${category?.slug || ""}`;

  const imageUrl = getCategoryImageUrl(category);

  return (
    <Link
      href={href}
      aria-label={category?.name || "Category"}
      className="
        group relative overflow-hidden rounded-2xl border border-gray-200/70
        bg-white shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-black/20
      "
    >
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category?.name || "Category"}
            fill
            priority={priority}
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            className="
              object-cover transition-transform duration-500
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400">
              No Image
            </span>
          </div>
        )}

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0 bg-gradient-to-t
            from-black/50 via-black/10 to-transparent
            opacity-80 transition-opacity duration-300
            group-hover:opacity-100
          "
        />
      </div>

      {/* CONTENT */}
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0">
          <h3
            className="
              truncate text-sm font-semibold text-gray-900
              md:text-base
            "
          >
            {category?.name || "Category"}
          </h3>

          {category?.productCount >= 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {category.productCount} Products
            </p>
          )}
        </div>

        {/* ICON */}
        <div
          className="
            ml-3 flex h-9 w-9 shrink-0 items-center justify-center
            rounded-full bg-gray-100 text-gray-700
            transition-all duration-300
            group-hover:translate-x-1
            group-hover:bg-black
            group-hover:text-white
          "
        >
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
});

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function CategoryGrid({
  categories = [],
  title,
  description,
  className = "",
}) {
  const normalizedCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    return categories.filter(Boolean);
  }, [categories]);

  if (normalizedCategories.length === 0) {
    return null;
  }

  return (
    <section className={`w-full ${className}`}>
      {/* HEADER */}
      {(title || description) && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* GRID */}
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
        {normalizedCategories.map((category, index) => {
          const key =
            category?._id ||
            category?.id ||
            category?.slug ||
            index;

          return (
            <CategoryCard
              key={key}
              category={category}
              priority={index < 2}
            />
          );
        })}
      </div>
    </section>
  );
}