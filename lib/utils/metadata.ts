import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const createMetadata = (title: string, description?: string): Metadata => ({
  title,
  description: description ?? siteConfig.description,
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title,
    description: description ?? siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
});
