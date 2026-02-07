import { getAllPages } from "@/lib/markdown";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages();
  const baseUrl = "https://iraq-developers.netlify.app";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const dynamicPages = pages.map((page) => {
    const slugPath = page.slug.join("/");
    return {
      url: `${baseUrl}/${slugPath}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...dynamicPages];
}
