import { router } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import CreateElement from "@/components/CreateElement";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";

export default function TabOneScreen() {
  const { projects, isLoading, isRefreshing, refresh } = useProjects();

  const createProject = useCallback(() => {
    router.push("/projects/create-project");
  }, []);

  const viewProject = useCallback((id: string) => {
    router.push(`/projects/${id}`);
  }, []);

  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View className="py-20 items-center justify-center">
            <Text className="text-lg text-muted-foreground font-medium">
              No projects found
            </Text>
            <Text className="text-sm text-muted-foreground mt-2">
              Create your first project to get started!
            </Text>
          </View>
        }
      />

      <CreateElement onPress={createProject} />
    </View>
  );
}
