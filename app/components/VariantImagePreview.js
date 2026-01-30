"use client";

import Image from "next/image";
import { useState } from "react";

export default function VariantImagePreview({ images = [] }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const showImages = images.slice(0, 2);
  const extraCount = images.length - 2;

  const openPreview = (index = 0) => {
    setActiveIndex(index);
    setPreviewOpen(true);
  };

  return (
    <>
      {/* Thumbnails */}
      <div className="flex gap-2">
        {showImages.map((img, index) => (
          <div
            key={img.public_id || index}
            className="relative cursor-pointer"
            onClick={() => openPreview(index)}
          >
            <Image
              src={img.url}
              width={48}
              height={48}
              alt=""
              className="rounded object-cover"
            />

            {/* +N Overlay */}
            {index === 1 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold rounded">
                +{extraCount}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-4 max-w-lg w-full relative">
            {/* Close */}
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-2 right-3 text-xl font-semibold"
            >
              ✕
            </button>

            {/* Main Image */}
            <div className="flex justify-center mb-4">
              <Image
                src={images[activeIndex].url}
                width={420}
                height={420}
                alt=""
                className="rounded object-contain max-h-[70vh]"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {images.map((img, i) => (
                  <Image
                    key={img.public_id || i}
                    src={img.url}
                    width={60}
                    height={60}
                    alt=""
                    onClick={() => setActiveIndex(i)}
                    className={`cursor-pointer rounded border ${
                      i === activeIndex
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
