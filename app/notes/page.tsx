import NotesClient from "@/components/NotesClient";
import { getArticles, getNotes } from "@/data";

export default function Notes() {
  return <NotesClient initialArticles={getArticles()} initialNotes={getNotes()} />;
}
