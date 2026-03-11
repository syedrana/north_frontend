import Image from "next/image";
import CategoryGrid from "./CategoryGrid";
import HeroBanner from "./HeroBanner";
import ProductGrid from "./ProductGrid";

function CampaignBanner({ section }) {
  return (
    <section className="w-full">
      {section?.image && (
        <Image
          src={section.image}
          alt={section?.title || "Campaign banner"}
          width={1600}
          height={400}
          className="h-auto w-full object-cover"
        />
      )}
      {section?.title && <h2 className="mt-3 text-xl font-semibold">{section.title}</h2>}
    </section>
  );
}

function renderSection(section, index) {
  switch (section?.type) {
    case "hero_banner":
      return <HeroBanner key={section?._id || section?.id || index} data={section} />;
    case "category_grid":
      return <section key={section?._id || section?.id || index}>
        {section?.title && <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>}
        <CategoryGrid categories={section?.items} />
      </section>;
    case "product_grid":
      return <ProductGrid key={section?._id || section?.id || index} title={section?.title} products={section?.items} />;
    case "campaign_banner":
      return <CampaignBanner key={section?._id || section?.id || index} section={section} />;
    default:
      return null;
  }
}

export default function SectionRenderer({ sections = [] }) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return <div className="space-y-8">{sections.map((section, index) => renderSection(section, index))}</div>;
}
