import HomeClient from "@/components/HomeClient";

export default async function Home() {
  let serializedProjects: any[] = [];
  let modules: string[] = [];

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });

    if (res.ok) {
      const projects = await res.json();

      // Omit MongoDB-specific fields and dates since client doesn't need them
      serializedProjects = projects.map((project: any) => {
        const { _id, createdAt, updatedAt, ...rest } = project;
        return rest;
      });

      // Extract unique modules from projects for filtering
      modules = Array.from(new Set(projects.flatMap(project => project.tags))) as string[];
    } else {
      console.error(`Failed to fetch projects: ${res.status}`);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return <HomeClient initialProjects={serializedProjects} modules={modules} />;
}