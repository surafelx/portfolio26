import AboutClient from "@/components/AboutClient";
import { getAbout } from "@/data";

export default function About() {
  return <AboutClient initialAbout={getAbout()} />;
}
