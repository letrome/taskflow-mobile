import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import ProjectCard from "../../components/ProjectCard";
import { useProjects } from "../../hooks/useProjects";

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

      <Pressable
        onPress={createProject}
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <FontAwesome name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}
