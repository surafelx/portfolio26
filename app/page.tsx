import HomeClient from "@/components/HomeClient";

export default async function Home() {
  let serializedProjects: any[] = [];
  let serializedArticles: any[] = [];
  let modules: string[] = [];

  try {
    // Fetch projects and articles in parallel
    const [projectsRes, articlesRes] = await Promise.all([
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/articles', { cache: 'no-store' })
    ]);

    if (projectsRes.ok) {
      const projects = await projectsRes.json();

      // Omit MongoDB-specific fields and dates since client doesn't need them
      serializedProjects = projects.map((project: any) => {
        const { _id, createdAt, updatedAt, ...rest } = project;
        return rest;
      });

      // Extract unique modules from projects for filtering
      modules = Array.from(new Set(projects.flatMap(project => project.tags))) as string[];
    } else {
      console.error(`Failed to fetch projects: ${projectsRes.status}`);
    }

    if (articlesRes.ok) {
      const articles = await articlesRes.json();

      // Omit MongoDB-specific fields and dates since client doesn't need them
      serializedArticles = articles.map((article: any) => {
        const { _id, createdAt, updatedAt, ...rest } = article;
        return rest;
      });
    } else {
      console.error(`Failed to fetch articles: ${articlesRes.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <HomeClient initialProjects={serializedProjects} initialArticles={serializedArticles} modules={modules} />;
}