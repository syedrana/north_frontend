import api from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSection(section = {}) {
  const data = section?.data && typeof section.data === "object" ? section.data : {};
  const settings = section?.settings && typeof section.settings === "object" ? section.settings : {};
  const normalizedType = typeof section?.type === "string" ? section.type.toLowerCase() : section?.type;
  const categories = ensureArray(section?.categories).length > 0
    ? section.categories
    : ensureArray(data?.categories);
  const products = ensureArray(section?.products).length > 0
    ? section.products
    : ensureArray(data?.products);
  const sectionItems = ensureArray(section?.items);
  const dataItems = ensureArray(data?.items);

  return {
    ...section,
    ...data,
    ...settings,
    type: normalizedType,
    items:
      sectionItems.length > 0
        ? sectionItems
        : dataItems.length > 0
          ? dataItems
          : categories.length > 0
            ? categories
            : products,
    categories,
    products,
    banners: ensureArray(section?.banners).length > 0 ? section.banners : ensureArray(settings?.banners),
    campaigns:
      ensureArray(section?.campaigns).length > 0
        ? section.campaigns
        : ensureArray(data?.campaigns).length > 0
          ? data.campaigns
          : ensureArray(settings?.campaigns),
    image:
      section?.image ||
      data?.image ||
      settings?.image ||
      data?.campaigns?.[0]?.image ||
      settings?.campaigns?.[0]?.image ||
      "",
    link:
      section?.link ||
      data?.link ||
      settings?.link ||
      data?.campaigns?.[0]?.link ||
      settings?.campaigns?.[0]?.link ||
      "",
  };
}

function normalizeSections(sections) {
  return ensureArray(sections)
    .map((section) => normalizeSection(section))
    .filter((section) => section?.status !== "hidden");
}

export async function getHomepage() {
  try {
    const response = await api.get("/homepage");
    const sections = response?.data?.sections;

    if (!Array.isArray(sections)) {
      throw new Error("Invalid homepage response: sections must be an array");
    }

    return normalizeSections(sections);
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch homepage data";

    throw new Error(message);
  }
}
