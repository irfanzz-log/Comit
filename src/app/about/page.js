import AboutClient from "@/component/AboutClient";

export async function generateMetadata() {
  return {
    title: 'About - Community of Information Technology',
  }
}

export default function Page() {
  return (
    <AboutClient />
  )
}