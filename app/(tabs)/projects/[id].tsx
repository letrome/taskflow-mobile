import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ProjectDetailsCard from "../../components/ProjectDetailsCard";
import ProjectHeader from "../../components/ProjectHeader";
import TaskItem from "../../components/TaskItem";
import { useProjectDetails } from "../../hooks/useProjectDetails";

export default function ProjectDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const { project, tasks, setProject, updateProject } = useProjectDetails(id);

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-8 px-4">
      <ProjectHeader
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      <ProjectDetailsCard
        project={project}
        setProject={setProject}
        updateProject={updateProject}
      />

      <View className="flex-1">
        <Text className="text-xl font-bold text-foreground mb-4">Tasks</Text>
        <FlatList
          data={tasks}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => <TaskItem item={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-8 items-center justify-center">
              <Text className="text-muted-foreground text-center">
                No tasks available for this project.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
