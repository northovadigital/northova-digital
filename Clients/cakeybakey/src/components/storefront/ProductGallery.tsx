"use client";

import { useEffect, useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
  category: string;
};

export function ProductGallery({
  images,
  productName,
  category,
}: ProductGalleryProps) {
  const safeImages = images.filter(
    (image) =>
      image &&
      typeof image.url === "string" &&
      image.url.trim().length > 0,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeActiveIndex =
    Math.min(activeIndex, Math.max(0, safeImages.length - 1));

  const activeImage = safeImages[safeActiveIndex];

  useEffect(() => {
    if (activeIndex >= safeImages.length && safeImages.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, safeImages.length]);

  function previous() {
    if (safeImages.length < 2) {
      return;
    }

    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1,
    );
  }

  function next() {
    if (safeImages.length < 2) {
      return;
    }

    setActiveIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1,
    );
  }

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }

      if (event.key === "ArrowLeft") {
        previous();
        return;
      }

      if (event.key === "ArrowRight") {
        next();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, safeImages.length]);

  if (!activeImage) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#ddd5c9] bg-[#f7f4ee]">
        <div className="flex aspect-square items-center justify-center">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-[#81776d] uppercase">
            {category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="group relative overflow-hidden rounded-2xl border border-[#ddd5c9] bg-[#f7f4ee]">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-zoom-in"
            aria-label={`Open ${productName} image fullscreen`}
          >
            <div className="flex aspect-square w-full items-center justify-center p-3 sm:p-5">
              <img
                src={activeImage.url}
                alt={activeImage.alt}
                className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous product image"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d7cec2] bg-white/95 text-lg text-[#332d27] shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next product image"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d7cec2] bg-white/95 text-lg text-[#332d27] shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
              >
                →
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#181512]/75 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white backdrop-blur">
                {safeActiveIndex + 1} / {safeImages.length}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute right-4 top-4 rounded-full border border-[#d7cec2] bg-white/95 px-3 py-2 text-[9px] font-semibold tracking-[0.14em] text-[#332d27] uppercase opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100"
          >
            View
          </button>
        </div>

        {safeImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {safeImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex}
                className={`overflow-hidden rounded-xl border bg-[#f7f4ee] transition ${
                  index === activeIndex
                    ? "border-[#9a7c50] ring-1 ring-[#9a7c50]"
                    : "border-[#ddd5c9] hover:border-[#b6a38c]"
                }`}
              >
                <div className="flex aspect-square items-center justify-center p-1.5">
                  <img
                    src={image.url}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#181512]/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image gallery`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxOpen(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen gallery"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[#181512] shadow-lg transition hover:scale-105"
          >
            ×
          </button>

          <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[88vh] max-w-[88vw] object-contain"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous product image"
                  className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#181512] shadow-lg transition hover:scale-105 sm:left-4"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next product image"
                  className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#181512] shadow-lg transition hover:scale-105 sm:right-4"
                >
                  →
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#332d27] shadow-lg">
                  {safeActiveIndex + 1} / {safeImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
