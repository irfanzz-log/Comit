import { Geist, Geist_Mono } from "next/font/google";
import { SlideNavProvider } from "@/hooks/ui/useSlideNav";
import { AuthProvider } from "./context/AuthContext";
import FloatingFAQ from "@/component/FloatingFAQ";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://comit.id"),

  title: {
    default: "COMIT — Community of Information Technology",
    template: "%s | Community of Information Technology",
  },

  description:
    "COMIT (Community of Information Technology) adalah komunitas teknologi informasi yang menjadi wadah bagi mahasiswa dan pelajar untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",

  keywords: [
    "COMIT",
    "Community of Information Technology",
    "komunitas teknologi",
    "komunitas IT",
    "teknologi informasi",
    "IT community",
    "programming",
    "web development",
    "software development",
    "mahasiswa IT",
  ],

  authors: [
    {
      name: "COMIT",
      url: "https://comit.id",
    },
  ],

  creator: "COMIT",
  publisher: "COMIT",

  applicationName: "COMIT",

  icons: {
    icon: "/logo/commitLogo.png",
    apple: "/logo/commitLogo.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://comit.id",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://comit.id",
    siteName: "COMIT",
    title: "COMIT — Community of Information Technology",
    description:
      "Komunitas teknologi informasi untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",
    images: [
      {
        url: "/logo/commitLogo.png",
        width: 512,
        height: 512,
        alt: "COMIT — Community of Information Technology",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "COMIT — Community of Information Technology",
    description:
      "Komunitas teknologi informasi untuk belajar, berkembang, berkolaborasi, dan berinovasi di bidang teknologi.",
    images: ["/logo/commitLogo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SlideNavProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SlideNavProvider>
        <FloatingFAQ />
      </body>
    </html>
  );
}