import api from "./api";

function normalizeProduct(product = {}) {
  return {
    _id: product?._id || product?.id || null,
    name: product?.name || "",
    slug: product?.slug || "",
    categoryId: product?.categoryId || null,
    image: product?.image || "",
    price: Number.isFinite(Number(product?.price)) ? Number(product.price) : null,
    discountPrice: Number.isFinite(Number(product?.discountPrice)) ? Number(product.discountPrice) : null,
    score: Number.isFinite(Number(product?.score)) ? Number(product.score) : 0,
    salesCount: Number.isFinite(Number(product?.salesCount)) ? Number(product.salesCount) : 0,
    wishlistCount: Number.isFinite(Number(product?.wishlistCount)) ? Number(product.wishlistCount) : 0,
    viewCount: Number.isFinite(Number(product?.viewCount)) ? Number(product.viewCount) : 0,
  };
}

export async function getTrendingProducts(params = {}) {
  try {
    const response = await api.get("/trending-products", {
      params,
    });

    const products = Array.isArray(response?.data?.products) ? response.data.products : [];
    const source = response?.data?.source || "trending_hybrid";
    const weights = response?.data?.weights || {};

    return {
      source,
      weights,
      products: products.map(normalizeProduct),
    };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch trending products";

    throw new Error(message);
  }
}
