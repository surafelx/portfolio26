import AdminClient from "@/components/AdminClient";

export default async function Admin() {
  const [projectsRes, articlesRes, notesRes] = await Promise.all([
    fetch('http://localhost:3000/api/projects', { cache: 'no-store' }),
    fetch('http://localhost:3000/api/articles', { cache: 'no-store' }),
    fetch('http://localhost:3000/api/notes', { cache: 'no-store' }),
  ]);

  const [projectsData, articlesData, notesData] = await Promise.all([
    projectsRes.json(),
    articlesRes.json(),
    notesRes.json(),
  ]);

  // Serialize data for client components
  const serializedProjects = projectsData.map((project: any) => {
    const { _id, createdAt, updatedAt, ...rest } = project;
    return rest;
  });

  const serializedArticles = articlesData.map((article: any) => {
    const { _id, createdAt, updatedAt, ...rest } = article;
    return rest;
  });

  const serializedNotes = notesData.map((note: any) => {
    const { _id, createdAt, updatedAt, ...rest } = note;
    return rest;
  });

  return (
    <AdminClient
      initialProjects={serializedProjects}
      initialArticles={serializedArticles}
      initialNotes={serializedNotes}
    />
  );
}