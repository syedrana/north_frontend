import CampaignBannerFields from "./CampaignBannerFields";
import CategoryGridFields from "./CategoryGridFields";
import FlashSaleFields from "./FlashSaleFields";
import HeroBannerFields from "./HeroBannerFields";
import ProductGridFields from "./ProductGridFields";

export default function QuickSettingsForm({
  type,
  values,
  onChange,
  onOpenHeroImagePicker,
  onOpenCampaignImagePicker,
  onAddHeroBanner,
  onRemoveHeroBanner,
}) {
  if (type === "hero_banner") {
    return (
      <HeroBannerFields
        values={values}
        onChange={onChange}
        onOpenFilePicker={onOpenHeroImagePicker}
        onAddBanner={onAddHeroBanner}
        onRemoveBanner={onRemoveHeroBanner}
      />
    );
  }

  if (type === "category_grid") {
    return <CategoryGridFields values={values} onChange={onChange} />;
  }

  if (type === "product_grid") {
    return <ProductGridFields values={values} onChange={onChange} />;
  }

  if (type === "campaign_banner") {
    return <CampaignBannerFields values={values} onChange={onChange} onOpenFilePicker={onOpenCampaignImagePicker} />;
  }

  if (type === "flash_sale") {
    return <FlashSaleFields values={values} onChange={onChange} />;
  }

  return null;
}
