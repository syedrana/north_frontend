import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TrendingProducts({ title = "Trending Products", products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section>
      {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const id = product?._id || product?.id || product?.slug || index;
          const href = product?.href || `/product/${product?.slug || ""}`;

          return (
            <article key={id} className="rounded-lg border p-3 shadow-sm">
              <div className="relative">
                <Link href={href}>
                  {product?.image && (
                    <Image
                      src={product.image}
                      alt={product?.name || "Product"}
                      width={400}
                      height={300}
                      className="h-40 w-full rounded object-cover"
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

              <Link href={href} className="mt-3 block font-medium text-gray-900">
                {product?.name || "Product"}
              </Link>

              <p className="mt-1 font-semibold text-emerald-600">${product?.price ?? ""}</p>

              <button
                type="button"
                className="mt-3 w-full rounded bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
