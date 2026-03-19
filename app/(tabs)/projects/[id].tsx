import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import CreateElement from "@/components/CreateElement";
import ProjectDetailsCard from "@/components/ProjectDetailsCard";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectMembersList from "@/components/ProjectMembersList";
import ProjectTasks from "@/components/ProjectTasks";
import TagsList from "@/components/TagsList";
import { useProjectDetails } from "@/hooks/useProjectDetails";

export default function ProjectDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const {
    project,
    projectOwner,
    tasks,
    taskParams,
    setTaskParams,
    tags,
    projectMembers,
    isOwner,
    setProject,
    updateProject,
    addTag,
    deleteTag,
    addProjectMember,
    deleteProjectMember,
    isRefreshing,
    refresh,
  } = useProjectDetails(id);

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  const createTask = () => {
    router.push(`/projects/tasks/create-task?projectId=${id}`);
  };

  const viewTask = (id: string) => {
    router.push(`/projects/tasks/${id}`);
  };

  return (
    <View className="flex-1 bg-background pt-8 px-4">
      <ProjectTasks
        tasks={tasks || []}
        taskParams={taskParams}
        setTaskParams={setTaskParams}
        projectTags={tags}
        onViewTask={viewTask}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        header={
          <>
            <ProjectHeader
              project={project}
              setProject={setProject}
              updateProject={updateProject}
            />

            <ProjectDetailsCard
              project={project}
              projectOwner={projectOwner}
              setProject={setProject}
              updateProject={updateProject}
            />

            <ProjectMembersList
              projectMembers={projectMembers}
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
          </>
        }
      />

      <CreateElement onPress={createTask} />
    </View>
  );
}
