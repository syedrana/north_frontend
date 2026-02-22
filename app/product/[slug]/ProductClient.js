"use client";

import apiServer from "@/lib/apiServer";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddToCartButton from "../../components/cart/AddToCartButton";
import BuyNowButton from "../../components/cart/BuyNowButton";

export default function ProductClient({
  product,
  variants,
  defaultVariant,
  isAuthenticated,
  searchId,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= STATE ================= */
  const [selectedVariant, setSelectedVariant] =
    useState(defaultVariant);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  /* ================= IMAGES ================= */
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images.slice(0, 5)
      : [{ url: "/placeholder.png" }];

  const mainImage =
    images[activeImageIndex]?.url ??
    "/placeholder.png";

  /* ================= VARIANT SELECT ================= */
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setActiveImageIndex(0);

    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", variant._id);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (!searchId) return;

    const trackClick = async () => {
      try {
        await apiServer.patch("/searchanalytics/track-click", {
          searchId,
          productId: product._id,
        });
      } catch (error) {
        console.error("Failed to track click", error);
      }
    };

    trackClick();
  }, [searchId, product._id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ================= IMAGE GALLERY ================= */}
      <div>
        {/* MAIN IMAGE */}
        <div className="relative w-full h-[420px] bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority
            placeholder="blur"
            blurDataURL={
                images[activeImageIndex]?.blurDataURL ??
                "/blur-placeholder.png"
            }
            className="object-cover"
          />
          

          {/* STOCK BADGE */}
          {selectedVariant.stock === 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded">
              Out of stock
            </span>
          )}

          {selectedVariant.stock > 0 &&
            selectedVariant.stock <= 5 && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded">
                Low stock
              </span>
            )}
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() =>
                  setActiveImageIndex(index)
                }
                className={`relative w-20 h-20 rounded-lg overflow-hidden border
                  ${
                    index === activeImageIndex
                      ? "border-indigo-600"
                      : "border-gray-300"
                  }
                `}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  placeholder="blur"
                    blurDataURL={
                        img.blurDataURL ?? "/blur-placeholder.png"
                    }
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 🔥 IMAGE PRELOAD (hidden, zero UX impact) */}
        <div className="hidden">
          {images.map((img, i) => (
            <Image
              key={i}
              src={img.url}
              alt="preload"
              width={1}
              height={1}
              placeholder="blur"
                blurDataURL={
                    img.blurDataURL ?? "/blur-placeholder.png"
                }
            />
          ))}
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-600 mt-3">
          {product.description}
        </p>

        {/* PRICE */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold text-indigo-600">
            ৳{" "}
            {selectedVariant.discountPrice ??
              selectedVariant.price}
          </span>

          {selectedVariant.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ৳ {selectedVariant.price}
            </span>
          )}
        </div>

        {/* VARIANTS */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">
            Available Variants
          </h3>

          <div className="flex gap-3 flex-wrap">
            {variants.map((variant) => (
              <button
                key={variant._id}
                onClick={() =>
                  handleVariantChange(variant)
                }
                className={`px-4 py-2 rounded border transition
                  ${
                    variant._id === selectedVariant._id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }
                `}
              >
                <p className="text-sm font-medium">
                  {variant.color} • {variant.size}
                </p>

                <p className="text-xs text-gray-500">
                  ৳ {variant.price}
                </p>

                {variant.stock === 0 && (
                  <span className="block text-xs text-red-500 font-semibold mt-1">
                    Out of stock
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <AddToCartButton
            variantId={selectedVariant._id}
            disabled={selectedVariant.stock === 0}
            isAuthenticated={isAuthenticated}
          />

          <BuyNowButton
            variantId={selectedVariant._id}
            disabled={selectedVariant.stock === 0}
          />
        </div>
      </div>
    </div>
  );
}
