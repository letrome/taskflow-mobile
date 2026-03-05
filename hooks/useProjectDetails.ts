import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { deleteToken } from "@/services/auth-storage";
import { projectApi } from "@/services/project-api";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

const fetchProject = async (id: string) => {
  const response = await projectApi.getProject(id);
  if (response.ok) {
    return response.data;
  }
  if (response.status === 401) {
    await deleteToken();
    router.replace("/auth/login");
  }
  return null;
};

const fetchTasks = async (id: string) => {
  const response = await projectApi.getTasks(id);
  if (response.ok) {
    return response.data;
  }
  if (response.status === 401) {
    await deleteToken();
    router.replace("/auth/login");
  }
  return null;
};

export function useProjectDetails(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadProject = async () => {
        const data = await fetchProject(id);
        if (data) setProject(data);
      };
      const loadTasks = async () => {
        const data = await fetchTasks(id);
        if (data) setTasks(data);
      };

      if (id) {
        loadProject();
        loadTasks();
      }
    }, [id]),
  );

  const updateProject = async (updates: Partial<Project> = {}) => {
    if (!project) return;
    const updatedProject = { ...project, ...updates };

    const response = await projectApi.updateProject(id, {
      title: updatedProject.title,
      description: updatedProject.description,
      start_date: updatedProject.start_date || undefined,
      end_date: updatedProject.end_date || undefined,
      status: updatedProject.status,
    });

    if (response.ok) {
      setProject(response.data);
    }
    if (response.status === 401) {
      await deleteToken();
      router.replace("/auth/login");
    }
  };

  return {
    project,
    setProject,
    tasks,
    updateProject,
  };
}
