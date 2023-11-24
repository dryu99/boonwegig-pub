import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/en/admin/", "/ko/admin/"],
    },
    sitemap: "https://www.boonwegig.com/sitemap.xml",
  };
}
