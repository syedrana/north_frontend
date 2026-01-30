// "use client";

// import api from "@/lib/api";
// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import ProductSkeleton from "../components/ProductSkeleton";


// export default function ShopPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // filters
//   const [search, setSearch] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sort, setSort] = useState("");
//   const [color, setColor] = useState("");
//   const [size, setSize] = useState("");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/products", {
//         params: {
//           search,
//           minPrice,
//           maxPrice,
//           sort,
//           color,
//           size,
//           page,
//           limit: 12,
//         },
//       });

//       setProducts(res.data.products);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [search, minPrice, maxPrice, sort, color, size, page]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   return (
//     <div className="px-4 md:px-12 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* ================= LEFT SIDEBAR (DARAZ STYLE) ================= */}
//         <aside className="md:col-span-1 space-y-6">
//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search products"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
//           />

//           {/* Price Filter */}
//           <div>
//             <h3 className="font-semibold mb-2">Price</h3>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(e.target.value)}
//                 className="w-1/2 border px-3 py-1 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={maxPrice}
//                 onChange={(e) => setMaxPrice(e.target.value)}
//                 className="w-1/2 border px-3 py-1 rounded"
//               />
//             </div>
//           </div>

//           {/* Color Filter */}
//           <div>
//             <h3 className="font-semibold mb-2">Color</h3>
//             <div className="flex flex-wrap gap-2">
//               {["red", "black", "blue", "white", "green"].map((c) => (
//                 <button
//                   key={c}
//                   onClick={() => {
//                     setColor(c);
//                     setPage(1);
//                   }}
//                   className={`w-6 h-6 rounded-full border ${
//                     color === c ? "ring-2 ring-indigo-500" : ""
//                   }`}
//                   style={{ backgroundColor: c }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Size Filter */}
//           <div>
//             <h3 className="font-semibold mb-2">Size</h3>
//             <div className="flex gap-2 flex-wrap">
//               {["S", "M", "L", "XL"].map((s) => (
//                 <button
//                   key={s}
//                   onClick={() => {
//                     setSize(s);
//                     setPage(1);
//                   }}
//                   className={`px-3 py-1 border rounded ${
//                     size === s
//                       ? "bg-indigo-600 text-white"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Sort */}
//           <div>
//             <h3 className="font-semibold mb-2">Sort</h3>
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Newest</option>
//               <option value="price-low">Price: Low → High</option>
//               <option value="price-high">Price: High → Low</option>
//             </select>
//           </div>
//         </aside>

//         {/* ================= PRODUCT GRID ================= */}
//         <main className="md:col-span-3">
//           {loading ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 12 }).map((_, i) => (
//                 <ProductSkeleton key={i} />
//               ))}
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-20">No products found</div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <Link
//                   key={product._id}
//                   href={`/product/${product.slug}`}
//                   className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
//                 >
//                   {/* IMAGE */}
//                   <div className="relative w-full h-80">
//                     {product.mainImage ? (
//                       <Image
//                         src={product.mainImage}
//                         alt={product.name}
//                         fill
//                         className={`object-contain ${product.stockStatus === "out" ? "opacity-60 grayscale" : ""}`}
//                       />
//                     ) : (
//                       <Image
//                         src="/placeholder.png"
//                         alt="placeholder"
//                         fill
//                         className="object-contain"
//                       />
//                     )}

//                     {/* STOCK BADGE */}
//                     {product.stockStatus === "out" && (
//                       <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
//                         Out of stock
//                       </span>
//                     )}

//                     {product.stockStatus === "low" && (
//                       <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
//                         Low stock
//                       </span>
//                     )}
//                   </div>

//                   {/* INFO */}
//                   <div className="p-3">
//                     <h2 className="text-sm font-semibold line-clamp-2">
//                       {product.name}
//                     </h2>

//                     {/* PRICE */}
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-indigo-600 font-bold">
//                         ৳{product.discountPrice || product.price}
//                       </span>
//                       {product.discountPrice && (
//                         <span className="text-xs line-through text-gray-400">
//                           ৳{product.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* COLORS */}
//                     {product.colors?.length > 0 && (
//                       <div className="flex gap-1 mt-2">
//                         {product.colors.slice(0, 4).map((c) => (
//                           <span
//                             key={c}
//                             className="w-3 h-3 rounded-full border"
//                             style={{ backgroundColor: c }}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-10 flex-wrap">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => setPage(num)}
//                   className={`px-4 py-2 rounded ${
//                     page === num
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-200 hover:bg-indigo-500 hover:text-white"
//                   }`}
//                 >
//                   {num}
//                 </button>
//               ))}
//             </div>
//           )}
//         </main>

        
//       </div>
//     </div>
//   );
// }













"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductSkeleton from "../components/ProductSkeleton";

export default function ShopClient({
  initialProducts = [],
  totalPages = 1,
  searchParams = {},
}) {
  const router = useRouter();
  const pathname = usePathname();

  /* ================= STATE ================= */
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(searchParams.search || "");
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
  const [sort, setSort] = useState(searchParams.sort || "");
  const [color, setColor] = useState(searchParams.color || "");
  const [size, setSize] = useState(searchParams.size || "");
  const [page, setPage] = useState(Number(searchParams.page) || 1);

  /* ================= URL UPDATE ================= */
  const updateURL = (updates = {}) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  /* ================= CLIENT FETCH (pagination / filter change) ================= */
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
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

        if (!ignore) setProducts(res.data.products || []);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => (ignore = true);
  }, [search, minPrice, maxPrice, sort, color, size, page]);

  /* ================= UI ================= */
  return (
    <div className="px-4 md:px-12 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="md:col-span-1 space-y-6">
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              updateURL({ search: e.target.value, page: 1 });
            }}
            className="w-full border px-4 py-2 rounded"
          />

          {/* Price */}
          <div>
            <h3 className="font-semibold mb-2">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateURL({ minPrice: e.target.value, page: 1 });
                }}
                className="w-1/2 border px-3 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateURL({ maxPrice: e.target.value, page: 1 });
                }}
                className="w-1/2 border px-3 py-1 rounded"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {["red", "black", "blue", "white", "green"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    updateURL({ color: c, page: 1 });
                  }}
                  className={`w-6 h-6 rounded-full border ${
                    color === c ? "ring-2 ring-indigo-500" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    updateURL({ size: s, page: 1 });
                  }}
                  className={`px-3 py-1 border rounded ${
                    size === s ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateURL({ sort: e.target.value, page: 1 });
            }}
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
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-80">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className={`object-contain ${product.stockStatus === "out" ? "opacity-60 grayscale" : ""}`}
                      />
                    ) : (
                      <Image
                        src="/placeholder.png"
                        alt="placeholder"
                        fill
                        className="object-contain"
                      />
                    )}

                    {/* STOCK BADGE */}
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

                    {/* PRICE */}
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

                    {/* COLORS */}
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
              ))}
            </div>
          )}
          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-4 py-2 rounded ${
                    page === num
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
