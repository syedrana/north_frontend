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
