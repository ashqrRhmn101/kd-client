"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function BannerCarousel({ banners = [] }) {
  if (banners.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden banner-swiper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={banners.length > 1}
        loop={banners.length > 1}
        className="aspect-[16/6] md:aspect-[16/4]"
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image src={banner.image} alt={banner.alt || "banner"} fill className="object-cover" priority={i === 0} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
