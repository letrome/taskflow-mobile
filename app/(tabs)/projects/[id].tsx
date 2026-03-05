import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import CreateElement from "@/app/components/CreateElement";
import TaskList from "@/app/components/TaskList";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import ProjectDetailsCard from "../../components/ProjectDetailsCard";
import ProjectHeader from "../../components/ProjectHeader";

export default function ProjectDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const { project, tasks, setProject, updateProject } = useProjectDetails(id);

  // Loading state
  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  const createTask = () => {
    router.push(`/projects/create-task?projectId=${id}`);
  };

  return (
    <View className="flex-1 bg-background pt-8 px-4">
      {/* Project header */}
      <ProjectHeader
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      {/* Project details card */}
      <ProjectDetailsCard
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      {/* Task list */}
      <TaskList tasks={tasks || []} />

      {/* Create task button */}
      <CreateElement onPress={createTask} />
    </View>
  );
}
