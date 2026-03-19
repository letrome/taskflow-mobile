import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { projectApi } from "@/services/project-api";
import type { Project } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await projectApi.getProjects();
      if (response.ok) {
        setProjects(response.data);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects]),
  );

  return {
    projects,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchProjects(true),
  };
}
