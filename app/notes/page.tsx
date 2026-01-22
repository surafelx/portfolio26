import NotesClient from "@/components/NotesClient";

export default async function Notes() {
  let articles: any[] = [];

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/articles`, { cache: 'no-store' });
    if (res.ok) {
      articles = await res.json();
    } else {
      console.error(`Failed to fetch articles: ${res.status}`);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  return <NotesClient initialArticles={articles} />;
}