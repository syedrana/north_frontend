import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductGrid({ title, products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section>
      {title && <h2 className="mb-3 text-xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6 ">
        {products.map((product, index) => {
          const id = product?._id || product?.id || product?.slug || index;
          const href = product?.href || `/product/${product?.slug || ""}`;

          return (
            <article key={id} className="w-full rounded-lg border bg-white ">
              <div className="relative">
                <Link href={href}>
                  {product?.image && (
                    <Image
                      src={product.image}
                      alt={product?.name || "Product"}
                      width={300}
                      height={320}
                      className="h-50 w-full rounded object-cover"
                    />
                  )}
                </Link>

                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-700 transition hover:text-red-500"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <Link href={href} className="mt-3 pl-2 block text-sm font-medium text-gray-900">
                {product?.name || "Product"}
              </Link>

              <div className="mt-1 pl-2 pb-2 flex items-center gap-2">
                {product?.discountPrice ? (
                  <>
                    <span className="font-semibold text-emerald-600">৳{product.discountPrice}</span>
                    <span className="text-sm text-gray-500 line-through">৳{product?.price ?? ""}</span>
                  </>
                ) : (
                  <span className="font-semibold text-emerald-600">৳{product?.price ?? ""}</span>
                )}
              </div>

              {/* <button
                type="button"
                className="mt-3 w-full rounded bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Add to Cart
              </button> */}
            </article>
          );
        })}
      </div>
    </section>
  );
}
