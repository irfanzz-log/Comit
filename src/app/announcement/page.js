import Announcement from "@/component/announcement/Announcement";

export const metadata = {
  title: "Announcement",
  description:
    "Dapatkan informasi dan pengumuman terbaru dari COMIT (Community of Information Technology), mulai dari kegiatan, event, program, hingga informasi penting lainnya.",

  keywords: [
    "announcement COMIT",
    "pengumuman COMIT",
    "informasi COMIT",
    "Community of Information Technology",
    "event COMIT",
    "kegiatan IT",
    "komunitas IT",
    "teknologi informasi",
  ],

  openGraph: {
    title: "Announcement | COMIT",
    description:
      "Temukan informasi dan pengumuman terbaru mengenai kegiatan, event, program, dan berbagai aktivitas COMIT.",
    url: "https://comit.id/announcement",
    siteName: "COMIT",
    type: "website",
    locale: "id_ID",
  },

  alternates: {
    canonical: "https://comit.id/announcement",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <Announcement />
  )
}