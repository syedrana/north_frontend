"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductSkeleton from "../components/ProductSkeleton";
import ProductPreviewModal from "../components/product/ProductPreviewModal";

export default function ShopClient({
  initialProducts = [],
  totalPages = 1,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [previewProduct, setPreviewProduct] = useState(null);
  const trackedRef = useRef("");
  const [analyticsId, setAnalyticsId] = useState("");

  function useSessionId() {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
      let sid = localStorage.getItem("searchSessionId");
      if (!sid) {
        sid = crypto.randomUUID(); // modern browsers
        localStorage.setItem("searchSessionId", sid);
      }
      setSessionId(sid);
    }, []);

    return sessionId;
  }

  const sessionId = useSessionId();

  /* ================= URL PARAMS (STABLE PRIMITIVES) ================= */
  const search = params.get("search") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const sort = params.get("sort") || "";
  const color = params.get("color") || "";
  const size = params.get("size") || "";
  const page = Number(params.get("page") || 1);

  /* ================= STATE ================= */
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  /* ================= URL UPDATE ================= */
  const updateURL = (updates = {}) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) newParams.delete(key);
      else newParams.set(key, value);
    });

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  /* ================= DATA FETCH ================= */
  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);

      try {
        const res = await api.get("/products", {
          params: {
            search,
            minPrice,
            maxPrice,
            sort,
            color,
            size, 
            page,
            limit: 12,
          },
        });

        const fetchedProducts = res.data.products || [];

        if (!ignore) setProducts(fetchedProducts);

        if (search && trackedRef.current !== search && sessionId) {
          trackedRef.current = search;

          const resAnalytics = await api.post("/searchanalytics/track", {
            keyword: search,
            resultCount: fetchedProducts.length,
            sessionId: sessionId,
          });

          if (resAnalytics.data?.data?._id) {
            setAnalyticsId(resAnalytics.data.data._id);
          }
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [search, minPrice, maxPrice, sort, color, size, page, sessionId]);

  /* ================= UI ================= */
  return (
    <div className="px-4 md:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ================= SIDEBAR ================= */}
        <aside className="md:col-span-1 space-y-6">

          {/* PRICE */}
          <div>
            <h3 className="font-semibold mb-2">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onChange={(e) =>
                  updateURL({ minPrice: e.target.value, page: 1 })
                }
                className="w-1/2 border px-3 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onChange={(e) =>
                  updateURL({ maxPrice: e.target.value, page: 1 })
                }
                className="w-1/2 border px-3 py-1 rounded"
              />
            </div>
          </div>

          {/* COLOR */}
          <div>
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {["red", "black", "blue", "white", "green"].map((c) => (
                <button
                  key={c}
                  onClick={() => updateURL({ color: c, page: 1 })}
                  className={`w-6 h-6 rounded-full border ${
                    color === c ? "ring-2 ring-indigo-500" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateURL({ size: s, page: 1 })}
                  className={`px-3 py-1 border rounded ${
                    size === s ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) =>
              updateURL({ sort: e.target.value, page: 1 })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </aside>

        {/* ================= PRODUCT GRID ================= */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">No products found</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden relative group"
                >
                  <Link
                    key={product._id}
                    // href={`/product/${product.slug}?searchId=${analyticsId}`}
                    href={
                      analyticsId 
                      ? `/product/${product.slug}?searchId=${analyticsId}&pos=${index + 1}` 
                      : `/product/${product.slug}`
                    }
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-60">
                      <Image
                        src={product.mainImage || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className={`object-contain ${
                          product.stockStatus === "out"
                            ? "opacity-60 grayscale"
                            : ""
                        }`}
                      />

                      {product.stockStatus === "out" && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Out of stock
                        </span>
                      )}

                      {product.stockStatus === "low" && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Low stock
                        </span>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-3">
                      
                      
                      <h2 className="text-sm font-semibold line-clamp-2">
                        {product.name}
                      </h2>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-indigo-600 font-bold">
                          ৳{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs line-through text-gray-400">
                            ৳{product.price}
                          </span>
                        )}
                      </div>

                      {product.colors?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {product.colors.slice(0, 4).map((c) => (
                            <span
                              key={c}
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => setPreviewProduct(product)}
                    className="
                      absolute bottom-3 left-1/2 -translate-x-1/2
                      bg-black text-white px-4 py-1 text-sm rounded
                      opacity-0 group-hover:opacity-100 transition
                    "
                  >
                    Quick View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => updateURL({ page: num })}
                    className={`px-4 py-2 rounded ${
                      page === num
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          )}
        </main>
      </div>
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
