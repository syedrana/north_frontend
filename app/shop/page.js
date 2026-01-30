// import api from "@/lib/apiServer";
// import ShopClient from "./ShopClient";

// /* ================= SEO METADATA ================= */
// export const metadata = {
//   title: "Shop Online | Premium Fashion & Lifestyle Products",
//   description:
//     "Browse premium fashion products with best prices, fast delivery and easy returns.",
//   openGraph: {
//     title: "Shop Online | Premium Store",
//     description:
//       "Discover latest products with exciting offers. Shop now!",
//     type: "website",
//   },
// };

// export const revalidate = 60;

// /* ================= SERVER DATA FETCH ================= */
// async function getProducts(searchParams) {
//   const params = {
//     search: searchParams.search || "",
//     minPrice: searchParams.minPrice || "",
//     maxPrice: searchParams.maxPrice || "",
//     sort: searchParams.sort || "",
//     color: searchParams.color || "",
//     size: searchParams.size || "",
//     page: Number(searchParams.page) || 1,
//     limit: 12,
//   };

//   const res = await api.get("/products", { params });

//   return res.data;
// }

// /* ================= PAGE ================= */
// export default async function ShopPage({ searchParams }) {
//   // ✅ Next.js 16+ fix
//   const params = await searchParams;

//   const query = new URLSearchParams(params).toString();

//   const { data } = await api.get(`/products?${query}`, {
//     headers: {
//       "x-api-key": process.env.NEXT_PUBLIC_SECURE_API_KEY,
//     },
//   });

//   return (
//     <ShopClient
//       initialProducts={data.products || []}
//       initialMeta={data.meta || {}}
//       searchParams={params}  
//     />
//   );
// }











import api from "@/lib/apiServer";
import ShopClient from "./ShopClient";

/* ================= SEO METADATA ================= */
export const metadata = {
  title: "Shop Online | Premium Fashion & Lifestyle Products",
  description:
    "Browse premium fashion products with best prices, fast delivery and easy returns.",
  openGraph: {
    title: "Shop Online | Premium Store",
    description: "Discover latest products with exciting offers. Shop now!",
    type: "website",
  },
};

export const revalidate = 60;

/* ================= PAGE ================= */
export default async function ShopPage({ searchParams }) {
  // ✅ Next.js 16+ : searchParams is Promise
  const params = await searchParams;

  const query = new URLSearchParams({
    search: params.search || "",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
    sort: params.sort || "",
    color: params.color || "",
    size: params.size || "",
    page: params.page || "1",
    limit: "12",
  }).toString();

  const { data } = await api.get(`/products?${query}`);

  return (
    <ShopClient
      initialProducts={data.products || []}
      totalPages={data.totalPages || 1}
      searchParams={params}
    />
  );
}
