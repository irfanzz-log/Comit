export default function robots() {
  const baseUrl = "https://comitunipi.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/internal/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}