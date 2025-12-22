import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://ruslan-lapiniak-cv.vercel.app/sitemap.xml",
  };
}
