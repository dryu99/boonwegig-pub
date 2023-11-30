import { MetadataRoute } from "next";

// TODO add logic to dynamically generate sitemaps for venues, artists, etc
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://boonwegig.com/en/seoul",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://boonwegig.com/ko/seoul",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://boonwegig.com/en/busan",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://boonwegig.com/ko/busan",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://boonwegig.com/en",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://boonwegig.com/ko",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
