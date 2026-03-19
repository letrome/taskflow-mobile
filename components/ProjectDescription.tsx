import { TextInput } from "react-native";
import type { Project } from "@/types/project";

type ProjectDescriptionProps = Readonly<{
  project: Project;
  setProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
}>;

export default function ProjectDescription({
  project,
  setProject,
  updateProject,
}: ProjectDescriptionProps) {
  return (
    <TextInput
      className="text-base text-muted-foreground leading-relaxed mb-4"
      value={project.description}
      onChangeText={(description) => setProject({ ...project, description })}
      onBlur={() => updateProject({ description: project.description })}
      placeholder="No description provided."
      multiline
    />
  );
}
