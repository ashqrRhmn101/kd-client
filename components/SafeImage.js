"use client";
import Image from "next/image";
import { ImageOff } from "lucide-react";

// next/image throws a HARD runtime error (crashes the whole page in dev,
// shows a broken image in prod) if `src` isn't an absolute URL or a
// leading-slash local path — e.g. legacy data like "electronics.jpg" saved
// before the Cloudinary uploader existed. This wrapper checks first and
// renders a neutral placeholder instead of letting bad data take the page
// down. Always use this instead of next/image directly for any src that
// ultimately comes from the database (product/category images, avatars).
const isValidSrc = (src) => typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

export default function SafeImage({ src, alt, fallbackClassName = "", width, height, fill, ...props }) {
  if (!isValidSrc(src)) {
    const style = !fill && width && height ? { width, height } : undefined;
    return (
      <div
        style={style}
        className={`flex items-center justify-center bg-gray-100 text-gray-300 ${fill ? "w-full h-full" : ""} ${fallbackClassName}`}
      >
        <ImageOff className="w-1/3 h-1/3 min-w-4 min-h-4" />
      </div>
    );
  }
  return <Image src={src} alt={alt || ""} width={width} height={height} fill={fill} {...props} />;
}
