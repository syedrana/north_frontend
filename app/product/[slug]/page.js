import apiServer from "@/lib/apiServer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";


/* ================= SEO (SAFE) ================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data } = await apiServer.get(`/products/${slug}`);
    const product = data.product;

    const variants = product?.variants ?? [];
    const defaultVariant =
      variants.find((v) => v.isDefault) ?? variants[0];

    const ogImage =
      defaultVariant?.images?.[0]?.url ?? "/placeholder.png";

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Product not found",
    };
  }
}

/* ================= ISR ================= */
export const revalidate = 60;

export default async function ProductPage({ params, searchParams  }) {
  const { slug } = await params;
  const { variant, searchId } = await searchParams;

  let product;
  let deliveryEstimate = null;

  try {
    const { data } = await apiServer.get(`/products/${slug}`);
    product = data.product;
    deliveryEstimate = data.deliveryEstimate;
  } catch {
    notFound();
  }

  const variants = product?.variants ?? [];
  if (variants.length === 0) notFound();

  // const defaultVariant =
  //   variants.find((v) => v.isDefault) ?? variants[0];

  const defaultVariant =
    variants.find((v) => v._id === variant) ||
    variants.find((v) => v.isDefault) ||
    variants[0];

  // ✅ AUTH CHECK
  const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;
  const token = cookieStore?.getAll?.().find(c => c.name === "token")?.value;

  const isAuthenticated = !!token;

  return (
    <ProductClient
      product={product}
      variants={variants}
      defaultVariant={defaultVariant}
      searchId={searchId}
      isAuthenticated={isAuthenticated}
      initialDeliveryEstimate={deliveryEstimate}
    />
  );
}
