import AboutClient from "@/component/AboutClient";

export const metadata = {
  title: "About Us",
  description:
    "Kenali COMIT (Community of Information Technology), komunitas teknologi informasi yang menjadi wadah untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",

    keywords: [
      "About COMIT",
      "Community of Information Technology",
      "tentang COMIT",
      "komunitas IT",
      "komunitas teknologi",
      "teknologi informasi",
      "IT community",
    ],

    openGraph: {
      title: "About Us | COMIT",
      description:
        "Kenali COMIT dan perjalanan komunitas dalam membangun lingkungan belajar, kolaborasi, dan inovasi di bidang teknologi informasi.",
      url: "https://comitunipi.id/about",
      siteName: "COMIT",
      type: "website",
      locale: "id_ID",
    },

    alternates: {
      canonical: "https://comitunipi.id/about",
    },

    robots: {
      index: true,
      follow: true,
    },
  };

export default function Page() {
  return (
    <AboutClient />
  )
}