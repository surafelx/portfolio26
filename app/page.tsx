import HomeClient from "@/components/HomeClient";
import { getProjects, getArticles, getProjectModules } from "@/data";

export default function Home() {
  const projects = getProjects();
  const articles = getArticles();
  const modules = getProjectModules();

  return (
    <HomeClient
      initialProjects={projects}
      initialArticles={articles}
      modules={modules}
    />
  );
}
