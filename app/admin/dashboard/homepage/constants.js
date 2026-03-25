export const SECTION_TYPES = [
  { value: "hero_banner", label: "Hero Banner" },
  { value: "category_grid", label: "Category Grid" },
  { value: "product_grid", label: "Product Grid" },
  { value: "campaign_banner", label: "Campaign Banner" },
  { value: "flash_sale", label: "Flash Sale" },
];

export const PRODUCT_GRID_SOURCES = [
  { value: "manual", label: "Manual" },
  { value: "trending", label: "Trending" },
  { value: "best_seller", label: "Best Seller" },
  { value: "new_arrival", label: "New Arrival" },
  { value: "category", label: "Category" },
];

export const SECTION_DEFAULT_SETTINGS = {
  hero_banner: {
    banners: [
      {
        image: "",
        title: "",
        subtitle: "",
        buttonText: "",
        link: "",
      },
    ],
  },
  category_grid: {
    limit: 8,
  },
  product_grid: {
    source: "new_arrival",
    limit: 8,
    productIds: [],
  },
  campaign_banner: {
    campaigns: [
      {
        image: "",
        link: "",
      },
    ],
  },
  flash_sale: {
    mode: "active",
    limit: 8,
    flashSaleId: "",
  },
};

export const INITIAL_FORM_STATE = {
  sectionId: "",
  title: "",
  type: "hero_banner",
  status: "active",
  order: "",
  settingsJson: JSON.stringify(SECTION_DEFAULT_SETTINGS.hero_banner, null, 2),
};
