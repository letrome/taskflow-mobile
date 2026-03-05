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

const fetchTags = async (id: string) => {
  const response = await projectApi.getProjectTags(id);
  if (response.ok) {
    return response.data;
  }
  return [];
};

export function useProjectDetails(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

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
      const loadTags = async () => {
        const data = await fetchTags(id);
        if (data) setTags(data);
      };

      if (id) {
        loadProject();
        loadTasks();
        loadTags();
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

  const addTag = async (name: string) => {
    const response = await projectApi.addProjectTag(id, name);
    if (response.ok && response.data) {
      setTags((prev) => [...prev, response.data]);
    } else {
      console.error("Failed to add tag", response);
    }
  };

  const deleteTag = async (tagId: string) => {
    // Optimistic update
    const previousTags = [...tags];
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    const response = await projectApi.deleteTag(tagId);
    if (!response.ok) {
      // Revert on failure
      console.error("Failed to delete tag", response);
      setTags(previousTags);
    }
  };

  return {
    project,
    setProject,
    tasks,
    tags,
    updateProject,
    addTag,
    deleteTag,
  };
}
