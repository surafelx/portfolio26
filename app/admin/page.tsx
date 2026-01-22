import AdminClient from "@/components/AdminClient";

export default async function Admin() {
  let serializedProjects: any[] = [];
  let serializedArticles: any[] = [];
  let serializedNotes: any[] = [];
  let serializedAbout: any = null;

  try {
    const [projectsRes, articlesRes, notesRes, aboutRes] = await Promise.all([
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/articles', { cache: 'no-store' }),
      fetch('/api/notes', { cache: 'no-store' }),
      fetch('/api/about', { cache: 'no-store' }),
    ]);

    if (projectsRes.ok && articlesRes.ok && notesRes.ok && aboutRes.ok) {
      const [projectsData, articlesData, notesData, aboutData] = await Promise.all([
        projectsRes.json(),
        articlesRes.json(),
        notesRes.json(),
        aboutRes.json(),
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

      if (aboutData) {
        const { _id, createdAt, updatedAt, ...rest } = aboutData;
        serializedAbout = rest;
      }
    } else {
      console.error('Failed to fetch admin data:', { projects: projectsRes.status, articles: articlesRes.status, notes: notesRes.status, about: aboutRes.status });
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }

  return (
    <AdminClient
      initialProjects={serializedProjects}
      initialArticles={serializedArticles}
      initialNotes={serializedNotes}
      initialAbout={serializedAbout}
    />
  );
}