import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import CreateElement from "@/app/components/CreateElement";
import ProjectMembersList from "@/app/components/ProjectMembersList";
import TagsList from "@/app/components/TagsList";
import TaskList from "@/app/components/TaskList";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import ProjectDetailsCard from "../../components/ProjectDetailsCard";
import ProjectHeader from "../../components/ProjectHeader";

export default function ProjectDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const {
    project,
    projectOwner,
    tasks,
    taskParams,
    setTaskParams,
    tags,
    project_members,
    isOwner,
    setProject,
    updateProject,
    addTag,
    deleteTag,
    addProjectMember,
    deleteProjectMember,
  } = useProjectDetails(id);

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

  const viewTask = (id: string) => {
    router.push(`/projects/tasks/${id}`);
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
        projectOwner={projectOwner}
        setProject={setProject}
        updateProject={updateProject}
      />

      <ProjectMembersList
        project_members={project_members}
        editable={isOwner}
        onAddProjectMember={addProjectMember}
        onDeleteProjectMember={deleteProjectMember}
      />
      <TagsList
        tags={tags}
        editable
        onAddTag={addTag}
        onDeleteTag={deleteTag}
      />

      {/* Task list */}
      <TaskList
        tasks={tasks || []}
        taskParams={taskParams}
        setTaskParams={setTaskParams}
        projectTags={tags}
        onViewTask={viewTask}
      />

      {/* Create task button */}
      <CreateElement onPress={createTask} />
    </View>
  );
}
