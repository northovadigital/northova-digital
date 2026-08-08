import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date("2026-08-08"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date("2026-08-08"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
