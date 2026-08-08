"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full aspect-[16/6] md:aspect-[16/4] overflow-hidden rounded-xl">
      {banners.map((banner, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={banner.image} alt={banner.alt || "banner"} fill className="object-cover" priority={i === 0} />
        </div>
      ))}

      <button
        onClick={() => setIndex((index - 1 + banners.length) % banners.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((index + 1) % banners.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-brand-500" : "bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
