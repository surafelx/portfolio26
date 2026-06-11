 import HomeClient from "@/components/HomeClient";
import { getProjects, getArticles } from "@/lib/database";

export default async function Home() {
  let serializedProjects: any[] = [];
  let serializedArticles: any[] = [];
  let modules: string[] = [];

  try {
    // Fetch directly from database on server side
    const [projects, articles] = await Promise.all([
      getProjects(),
      getArticles()
    ]);

    // Omit MongoDB-specific fields and dates since client doesn't need them
    serializedProjects = projects.map((project: any) => {
      const { _id, createdAt, updatedAt, ...rest } = project;
      return rest;
    });

    serializedArticles = articles.map((article: any) => {
      const { _id, createdAt, updatedAt, ...rest } = article;
      return rest;
    });

    // Extract unique modules from projects for filtering
    modules = Array.from(new Set(projects.flatMap(project => project.tags))) as string[];
  } catch (error) {
    console.error('Error fetching data from database:', error);
  }

  return <HomeClient initialProjects={serializedProjects} initialArticles={serializedArticles} modules={modules} />;
}