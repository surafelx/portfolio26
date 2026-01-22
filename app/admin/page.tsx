import AdminClient from "@/components/AdminClient";

export default async function Admin() {
  let serializedProjects: any[] = [];
  let serializedArticles: any[] = [];
  let serializedNotes: any[] = [];

  try {
    const [projectsRes, articlesRes, notesRes] = await Promise.all([
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/articles', { cache: 'no-store' }),
      fetch('/api/notes', { cache: 'no-store' }),
    ]);

    if (projectsRes.ok && articlesRes.ok && notesRes.ok) {
      const [projectsData, articlesData, notesData] = await Promise.all([
        projectsRes.json(),
        articlesRes.json(),
        notesRes.json(),
      ]);

      // Serialize data for client components
      serializedProjects = projectsData.map((project: any) => {
        const { _id, createdAt, updatedAt, ...rest } = project;
        return rest;
      });

      serializedArticles = articlesData.map((article: any) => {
        const { _id, createdAt, updatedAt, ...rest } = article;
        return rest;
      });

      serializedNotes = notesData.map((note: any) => {
        const { _id, createdAt, updatedAt, ...rest } = note;
        return rest;
      });
    } else {
      console.error('Failed to fetch admin data:', { projects: projectsRes.status, articles: articlesRes.status, notes: notesRes.status });
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }

  return (
    <AdminClient
      initialProjects={serializedProjects}
      initialArticles={serializedArticles}
      initialNotes={serializedNotes}
    />
  );
}