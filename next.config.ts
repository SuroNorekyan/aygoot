import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wdr45wmne6umf0iy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/houses/**",
      },
    ],
  }
};

export default withNextIntl(nextConfig);
