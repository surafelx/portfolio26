import NotesClient from "@/components/NotesClient";

export default async function Notes() {
  let articles: any[] = [];
  let notes: any[] = [];

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const [articlesRes, notesRes] = await Promise.all([
      fetch(`${baseUrl}/api/articles`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/notes`, { cache: 'no-store' })
    ]);

    if (articlesRes.ok) {
      articles = await articlesRes.json();
    } else {
      console.error(`Failed to fetch articles: ${articlesRes.status}`);
    }

    if (notesRes.ok) {
      notes = await notesRes.json();
    } else {
      console.error(`Failed to fetch notes: ${notesRes.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <NotesClient initialArticles={articles} initialNotes={notes} />;
}