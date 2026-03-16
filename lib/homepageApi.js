import api from "./api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSection(section = {}) {
  const settings = section?.settings && typeof section.settings === "object" ? section.settings : {};
  const normalizedType = typeof section?.type === "string" ? section.type.toLowerCase() : section?.type;

  return {
    ...section,
    ...settings,
    type: normalizedType,
    items: section?.items ?? settings?.items ?? [],
    banners: ensureArray(section?.banners).length > 0 ? section.banners : ensureArray(settings?.banners),
    campaigns: ensureArray(section?.campaigns).length > 0 ? section.campaigns : ensureArray(settings?.campaigns),
    image: section?.image || settings?.image || settings?.campaigns?.[0]?.image || "",
    link: section?.link || settings?.link || settings?.campaigns?.[0]?.link || "",
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
