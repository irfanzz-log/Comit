import HomeComponent from "@/component/HomeComponent";

export const metadata = {
  title: "Home | Community of Information Technology",
  description:
    "COMIT (Community of Information Technology) adalah komunitas teknologi informasi yang menjadi wadah untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",

  keywords: [
    "COMIT",
    "Community of Information Technology",
    "komunitas IT",
    "komunitas teknologi",
    "teknologi informasi",
    "IT community",
    "programming",
    "web development",
  ],

  openGraph: {
    title: "COMIT — Community of Information Technology",
    description:
      "Komunitas teknologi informasi untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",
    url: "https://comitunipi.id",
    siteName: "COMIT",
    type: "website",
    locale: "id_ID",
  },

  alternates: {
    canonical: "https://comitunipi.id",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomeComponent />;
}

