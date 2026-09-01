import { PageMasthead } from "@/components/sections/PageMasthead";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { CTA } from "@/components/sections/CTA";
import { projectsPage } from "@/data/site";

export default function ProjectsPage({ onBook }: { onBook: () => void }) {
  return (
    <main>
      <PageMasthead title={projectsPage.title} intro={projectsPage.intro} />
      <ProjectIndex />
      <CTA onBook={onBook} />
    </main>
  );
}
