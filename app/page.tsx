import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const res = await fetch('/api/projects', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }
  const projects = await res.json();

  // Omit MongoDB-specific fields and dates since client doesn't need them
  const serializedProjects = projects.map((project: any) => {
    const { _id, createdAt, updatedAt, ...rest } = project;
    return rest;
  });

  // Extract unique modules from projects for filtering
  const modules = Array.from(new Set(projects.flatMap(project => project.tags))) as string[];

  return <HomeClient initialProjects={serializedProjects} modules={modules} />;
}