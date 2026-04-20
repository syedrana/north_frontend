"use client";

import apiServer from "@/lib/apiServer";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AddToCartButton from "../../components/cart/AddToCartButton";
import BuyNowButton from "../../components/cart/BuyNowButton";
import WishlistButton from "../../components/wishlist/WishlistButton";

const formatAddress = (address) => {
  if (!address) return "";

  return [address.addressLine, address.area, address.district]
    .filter(Boolean)
    .join(", ");
};

const resolveDeliveryFee = (address, product, variant) => {
  const candidates = [
    address?.deliveryFee,
    address?.shippingFee,
    address?.estimatedDeliveryFee,
    variant?.deliveryFee,
    product?.deliveryFee,
    product?.shippingFee,
  ];

  const numeric = candidates.find((value) => Number.isFinite(Number(value)));
  return numeric === undefined ? null : Number(numeric);
};

const resolveCodAvailable = (product, variant) => {
  if (typeof variant?.codAvailable === "boolean") return variant.codAvailable;
  if (typeof product?.codAvailable === "boolean") return product.codAvailable;
  if (typeof product?.isCodAvailable === "boolean") return product.isCodAvailable;
  return true;
};

export default function ProductClient({
  product,
  variants,
  defaultVariant,
  isAuthenticated,
  searchId,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const position = searchParams.get("pos");

  /* ================= STATE ================= */
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedColor, setSelectedColor] = useState(defaultVariant?.color || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(isAuthenticated);
  const initialIsAuthenticated = useRef(isAuthenticated);

  const colors = useMemo(
    () => [...new Set(variants.map((variant) => variant.color).filter(Boolean))],
    [variants]
  );

  const sizeVariants = useMemo(
    () => variants.filter((variant) => variant.color === selectedColor),
    [variants, selectedColor]
  );

  const selectedAddress = useMemo(() => {
    if (!savedAddresses.length) return null;
    return savedAddresses.find((address) => address.isDefault) || savedAddresses[0];
  }, [savedAddresses]);

  const deliveryFee = useMemo(
    () => resolveDeliveryFee(selectedAddress, product, selectedVariant),
    [selectedAddress, product, selectedVariant]
  );

  const codAvailable = useMemo(
    () => resolveCodAvailable(product, selectedVariant),
    [product, selectedVariant]
  );

  /* ================= IMAGES ================= */
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images.slice(0, 5)
      : [{ url: "/placeholder.png" }];

  const mainImage = images[activeImageIndex]?.url ?? "/placeholder.png";

  /* ================= VARIANT SELECT ================= */
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedColor(variant.color);
    setActiveImageIndex(0);

    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", variant._id);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);

    const firstVariant = variants.find((variant) => variant.color === color);
    if (firstVariant) {
      handleVariantChange(firstVariant);
    }
  };

  useEffect(() => {
    if (!searchId) return;

    const trackClick = async () => {
      try {
        await apiServer.patch("/searchanalytics/track-click", {
          searchId,
          productId: product._id,
          position: Number(position) || null,
        });
      } catch (error) {
        console.error("Failed to track click", error);
      }
    };

    trackClick();
  }, [searchId, product._id, position]);

  useEffect(() => {
    if (!initialIsAuthenticated.current) {
      setAddressesLoading(false);
      return;
    }

    const loadAddresses = async () => {
      try {
        setAddressesLoading(true);
        const res = await apiServer.get("/address");
        setSavedAddresses(res.data?.addresses || []);
      } catch (error) {
        console.error("Failed to load addresses", error);
        setSavedAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
  const trackView = async () => {
    try {
      await api.post("/recentlyviewed/track-view", {
        productId: product._id,
      });
    } catch (err) {
      console.log("Tracking failed", err);
    }
  };

  trackView();
}, [product._id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div className="relative w-full h-[420px] bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority
            placeholder="blur"
            blurDataURL={images[activeImageIndex]?.blurDataURL ?? "/blur-placeholder.png"}
            className="object-cover"
          />
          
          {selectedVariant.stock === 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded">
              Out of stock
            </span>
          )}

          {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded">
              Low stock
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border ${
                  index === activeImageIndex ? "border-indigo-600" : "border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  placeholder="blur"
                  blurDataURL={img.blurDataURL ?? "/blur-placeholder.png"}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <WishlistButton
            productId={product._id}
            className="static rounded-full border border-gray-200 p-2 hover:bg-gray-50"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold text-indigo-600">
            ৳ {selectedVariant.discountPrice ?? selectedVariant.price}
          </span>

          {selectedVariant.discountPrice && (
            <span className="text-sm text-gray-400 line-through">৳ {selectedVariant.price}</span>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 p-5 space-y-5">
          <div>
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    color === selectedColor
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-3">
              {sizeVariants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => handleVariantChange(variant)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    variant._id === selectedVariant._id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Stock: <span className="font-semibold text-gray-900">{selectedVariant.stock}</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <AddToCartButton
            variantId={selectedVariant._id}
            disabled={selectedVariant.stock === 0}
          />

          <BuyNowButton variantId={selectedVariant._id} disabled={selectedVariant.stock === 0} />
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="font-semibold">Billing & Delivery</h3>

          {addressesLoading && <p className="text-sm text-gray-500">Loading saved address...</p>}

          {!addressesLoading && !isAuthenticated && (
            <p className="text-sm text-gray-600">
              Please <Link href="/customer/login" className="text-indigo-600 font-medium">login</Link> to use your saved billing address.
            </p>
          )}

          {!addressesLoading && isAuthenticated && !selectedAddress && (
            <p className="text-sm text-gray-600">
              No saved billing address found. <Link href="/account/address" className="text-indigo-600 font-medium">Add billing address</Link> to continue.
            </p>
          )}

          {!addressesLoading && selectedAddress && (
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">{selectedAddress.fullName} · {selectedAddress.phone}</p>
              <p>{formatAddress(selectedAddress)}</p>
            </div>
          )}

          <div className="text-sm text-gray-700">
            Delivery Fee:{" "}
            <span className="font-semibold text-gray-900">
              {deliveryFee === null ? "Calculated at checkout" : deliveryFee === 0 ? "Free" : `৳ ${deliveryFee}`}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            Delivery Method:{" "}
            <span className={`font-semibold ${codAvailable ? "text-emerald-700" : "text-red-600"}`}>
              {codAvailable ? "Cash on Delivery available" : "Cash on Delivery unavailable"}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
