import Image from "next/image";
import Link from "next/link";

function getCategoryImageUrl(category) {
  if (!category) return "";

  if (typeof category.image === "string") return category.image;

  return (
    category?.image?.url ||
    category?.image?.secure_url ||
    category?.thumbnail?.url ||
    ""
  );
}

export default function CategoryGrid({ categories = [] }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => {
        const key = category?._id || category?.id || category?.slug || index;
        const href = category?.href || `/shop?category=${category?.slug || ""}`;

        const imageUrl = getCategoryImageUrl(category);

        return (
          <Link key={key} href={href} className="group overflow-hidden rounded-lg border">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={category?.name || "Category"}
                width={400}
                height={300}
                className="h-36 w-full object-cover transition duration-200 group-hover:scale-105"
              />
            )}

            <div className="p-3">
              <p className="font-medium">{category?.name || "Category"}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
