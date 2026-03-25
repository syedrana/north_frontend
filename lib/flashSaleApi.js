import api from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeProduct(product = {}) {
  return {
    ...product,
    id: product?._id || product?.id || "",
    href: product?.slug ? `/product/${product.slug}` : product?.href || "#",
    image: product?.image || product?.images?.[0]?.url || "",
    price: Number.isFinite(Number(product?.price)) ? Number(product.price) : null,
    discountPrice:
      Number.isFinite(Number(product?.discountPrice)) ? Number(product.discountPrice) : null,
    flashSalePrice:
      Number.isFinite(Number(product?.flashSalePrice)) ? Number(product.flashSalePrice) : null,
    stock: Number.isFinite(Number(product?.stock)) ? Number(product.stock) : null,
  };
}

export function normalizeFlashSale(sale = {}) {
  const timing = sale?.timing && typeof sale.timing === "object" ? sale.timing : {};
  const products = ensureArray(sale?.products).map(normalizeProduct);

  return {
    ...sale,
    id: sale?._id || sale?.id || "",
    products,
    productCount: sale?.productCount ?? products.length,
    startsAt: sale?.startTime || sale?.startsAt || "",
    endsAt: sale?.endTime || sale?.endsAt || "",
    timing: {
      isUpcoming: Boolean(timing?.isUpcoming),
      isLive: Boolean(timing?.isLive),
      hasEnded: Boolean(timing?.hasEnded),
      startsInMs: Number(timing?.startsInMs ?? 0),
      endsInMs: Number(timing?.endsInMs ?? 0),
    },
  };
}

export async function getAdminFlashSales(params = {}) {
  const response = await api.get("/flash-sales/admin", { params });
  return {
    items: ensureArray(response?.data?.items).map(normalizeFlashSale),
    pagination: response?.data?.pagination || {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    },
  };
}

export async function getAdminFlashSaleById(flashSaleId) {
  const response = await api.get(`/flash-sales/admin/${flashSaleId}`);
  return normalizeFlashSale(response?.data?.flashSale || {});
}

export async function createAdminFlashSale(payload) {
  const response = await api.post("/flash-sales/admin", payload);
  return normalizeFlashSale(response?.data?.flashSale || {});
}

export async function updateAdminFlashSale(flashSaleId, payload) {
  const response = await api.put(`/flash-sales/admin/${flashSaleId}`, payload);
  return normalizeFlashSale(response?.data?.flashSale || {});
}

export async function deleteAdminFlashSale(flashSaleId) {
  return api.delete(`/flash-sales/admin/${flashSaleId}`);
}

export async function getActiveFlashSale() {
  const response = await api.get("/flash-sales/active");
  return normalizeFlashSale(response?.data?.flashSale || {});
}
