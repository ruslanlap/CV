import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.vercel.app";
  return [
    { url: `${base}/en`, lastModified: new Date() },
    { url: `${base}/ua`, lastModified: new Date() },
    { url: `${base}/cv/pdf?lang=en`, lastModified: new Date() },
    { url: `${base}/cv/pdf?lang=ua`, lastModified: new Date() },
  ];
}
