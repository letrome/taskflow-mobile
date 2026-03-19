import { View } from "react-native";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";
import ProjectDates from "./ProjectDates";
import ProjectDescription from "./ProjectDescription";
import ProjectOwner from "./ProjectOwner";

type ProjectDetailsCardProps = Readonly<{
  project: Project;
  projectOwner?: User | null;
  updateProject: (updates: Partial<Project>) => void;
  setProject: (project: Project) => void;
}>;

export default function ProjectDetailsCard({
  project,
  projectOwner,
  updateProject,
  setProject,
}: ProjectDetailsCardProps) {
  const ownerName = projectOwner
    ? `${projectOwner.first_name} ${projectOwner.last_name}`
    : project.created_by;

  return (
    <View className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-8">
      <ProjectDescription
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      <ProjectDates
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      <ProjectOwner ownerName={ownerName} />
    </View>
  );
}
