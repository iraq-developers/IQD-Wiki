import { getAllPages } from "@/lib/markdown";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages();
  const baseUrl = "https://iqdwiki.com";

  const latestContentUpdate = pages.reduce<Date>(
    (latest, page) =>
      page.lastModified && page.lastModified > latest
        ? page.lastModified
        : latest,
    new Date(0),
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestContentUpdate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/cv`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/practice-touch-typing`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = pages
    .filter((page) => page.slug.length > 0)
    .map((page) => {
      const slugPath = page.slug.map(encodeURIComponent).join("/");
      return {
        url: `${baseUrl}/${slugPath}`,
        lastModified: page.lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

  return [...staticPages, ...dynamicPages];
}
