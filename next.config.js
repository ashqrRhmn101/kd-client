/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" }, // relax during dev; tighten before production
    ],
  },
};

module.exports = nextConfig;
