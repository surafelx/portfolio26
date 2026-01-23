import NotesClient from "@/components/NotesClient";
import { getArticles, getNotes } from "@/lib/database";

export default async function Notes() {
  let articles: any[] = [];
  let notes: any[] = [];

  try {
    console.log('Fetching articles and notes from database');

    // Fetch directly from database on server side
    const [articlesData, notesData] = await Promise.all([
      getArticles(),
      getNotes()
    ]);

    articles = articlesData;
    notes = notesData;

    console.log(`Fetched ${articles.length} articles and ${notes.length} notes`);
  } catch (error) {
    console.error('Error fetching data from database:', error);
  }

  return <NotesClient initialArticles={articles} initialNotes={notes} />;
}