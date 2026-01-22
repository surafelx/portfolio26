import AboutClient from "@/components/AboutClient";

export default async function About() {
  let about: any = null;

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/about`, { cache: 'no-store' });
    if (res.ok) {
      about = await res.json();
    } else {
      console.error(`Failed to fetch about: ${res.status}`);
    }
  } catch (error) {
    console.error('Error fetching about:', error);
  }

  return <AboutClient initialAbout={about} />;
}