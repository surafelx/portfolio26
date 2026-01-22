import AdminClient from "@/components/AdminClient";

export default async function Admin() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const [projectsRes, articlesRes, notesRes] = await Promise.all([
    fetch(`${baseUrl}/api/projects`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/articles`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/notes`, { cache: 'no-store' }),
  ]);

  if (!projectsRes.ok || !articlesRes.ok || !notesRes.ok) {
    throw new Error('Failed to fetch data');
  }

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