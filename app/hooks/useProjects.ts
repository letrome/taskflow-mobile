import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { deleteToken } from "@/services/auth-storage";
import { projectApi } from "@/services/project-api";
import type { Project } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchProjects = async () => {
        const response = await projectApi.getProjects();
        if (response.ok) {
          setProjects(response.data);
        }
        if (response.status === 401) {
          await deleteToken();
          router.replace("/auth/login");
        }
      };
      fetchProjects();
    }, []),
  );

  return {
    projects,
  };
}
