import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { useProjects } from "@/hooks/useProjects";
import CreateElement from "../../components/CreateElement";
import ProjectCard from "../../components/ProjectCard";

export default function TabOneScreen() {
  const { projects } = useProjects();

  const createProject = () => {
    router.push("/projects/create-project");
  };

  const viewProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-10 pb-4">
        <Text className="text-3xl font-bold text-foreground">Projects</Text>
      </View>

      <FlatList
        className="flex-1 px-5"
        data={projects}
        renderItem={({ item }) => (
          <ProjectCard item={item} onPress={viewProject} />
        )}
        keyExtractor={(item) => item.id}
      />

      <CreateElement onPress={createProject} />
    </View>
  );
}
